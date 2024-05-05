import { Contract } from "ethers";
import { deployments, ethers, getNamedAccounts } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DCAFacet, MultiBatchSwapFacet, Swapper } from "../typechain-types";
import { getSelectors } from "../utils/getSelectors";

const deployDiamond: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment,
) {
  const { deploy, log, execute, get } = deployments;
  const { deployer } = await getNamedAccounts();

  const swapperContract = await deployments.get("Swapper");
  const dcaFacetAddress = (await deployments.get("DCAFacet")).address;
  const multiBatchSwap = await deployments.get("MultiBatchSwapFacet");

  // Retrieve factory for Swapper
  const swapperFactory: Swapper = await ethers.getContractAt(
    "Swapper",
    swapperContract.address,
  );

  const dcaFacetFactory: DCAFacet = await ethers.getContractAt(
    "DCAFacet",
    dcaFacetAddress,
  );
  // const governanceFacetFactory: DiamondGovernance = await ethers.getContractAt(
  //   "DiamondGovernance",
  //   diamondGovernance.address,
  // );
  const batchSwapFactory: MultiBatchSwapFacet = await ethers.getContractAt(
    "MultiBatchSwapFacet",
    multiBatchSwap.address,
  );

  // Get selectors for facets
  const dcaSelectors = getSelectors(dcaFacetFactory as unknown as Contract);
  const batchSwapSelectors = getSelectors(
    batchSwapFactory as unknown as Contract,
  );
  // const governanceSelectors = getSelectors(
  //   governanceFacetFactory as unknown as Contract,
  // );

  // Get selectors for Swapper
  const swapperSelectors = getSelectors(swapperFactory as unknown as Contract);

  log("Selectors for Swapper: ", swapperSelectors.join(", "));
  log("Selectors for DCAFacet: ", dcaSelectors.join(", "));

  // Define the cuts for the DiamondCut
  const facetCuts = [
    {
      facetAddress: swapperContract.address,
      action: 0,
      functionSelectors: swapperSelectors,
    },
    {
      facetAddress: dcaFacetAddress,
      action: 0,
      functionSelectors: dcaSelectors,
    },
    {
      facetAddress: multiBatchSwap.address,
      action: 0,
      functionSelectors: batchSwapSelectors,
    },
  ];
  // all function selectors console
  log("\n\nSelectors for Swapper: ", ...swapperSelectors);
  log("\n\nSelectors for dca: ", ...dcaSelectors);
  log("\n\nSelectors for batchSwapSelectors: ", ...batchSwapSelectors);

  const diamondInitContract = await ethers.getContractAt(
    "DiamondInit",
    (await deployments.get("DiamondInit")).address,
  );

  const diamondCut = await ethers.getContractAt(
    "IDiamondCut",
    (await deployments.get("Diamond")).address,
  );

  let tx;
  let receipt;
  // call to init function
  let functionCall = diamondInitContract.interface.encodeFunctionData("init");
  tx = await diamondCut.diamondCut(
    facetCuts,
    diamondInitContract.address,
    functionCall,
  );
  await diamondCut.updateSwapper(swapperContract.address);
  console.log("Diamond cut tx: ", tx.hash);
  receipt = await tx.wait();
  if (!receipt.status) {
    throw Error(`Diamond upgrade failed: ${tx.hash}`);
  }
  console.log("Completed diamond cut");
  log("Facets have been successfully added to the Diamond");

  // Execute the diamond cut
  // await execute(
  //   "DiamondCutFacet",
  //   { from: deployer },
  //   "diamondCut",
  //   facetCuts,
  //   ethers.constants.AddressZero,
  //   "0x",
  // );
  // log("Facets have been successfully added to the Diamond");
};

export default deployDiamond;
deployDiamond.tags = ["all", "swapper"];

// scripts/deployDiamond.ts
import { Contract } from "ethers";
import { deployments, ethers, getNamedAccounts } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import {
  DCAFacet,
  MultiBatchSwapFacet,
  TokenManagementFacet,
} from "../typechain-types";
import { getSelectors } from "../utils/getSelectors";
import { ROUTERS } from "../utils/polygon.constants";

const deployDiamond: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment,
) {
  const { deploy, log, execute, get } = deployments;
  const { deployer } = await getNamedAccounts();

  // Deploy PriceFeedRegistry
  const priceFeedRegistry = await deploy("PriceFeedRegistry", {
    from: deployer,
    log: true,
  });

  // Deploy PriceAggregator
  const priceAggregator = await deploy("PriceAggregator", {
    from: deployer,
    args: [priceFeedRegistry.address],
    log: true,
  });

  // Deploy DiamondCutFacet
  const diamondCutFacet = await deploy("DiamondCutFacet", {
    from: deployer,
    log: true,
  });

  // // Deploy DiamondGovernance
  // const diamondGovernance = await deploy("DiamondGovernance", {
  //   from: deployer,
  //   log: true,
  // });

  // Deploy Diamond
  const diamond = await deploy("Diamond", {
    from: deployer,
    args: [deployer, diamondCutFacet.address],
    log: true,
  });

  const diamondInitDeployment = await deploy("DiamondInit", {
    from: deployer,
    log: true,
  });

  // Deploy DCAFacet with PriceAggregator
  const dcaFacetAddress = (
    await deploy("DCAFacet", {
      from: deployer,
      args: [
        priceAggregator.address,
        ROUTERS.QUICKSWAP_V2, // quickswap router v2
      ],
      log: true,
    })
  ).address;

  // Deploy TokenManagementFacet
  const tokenManagementFacetAddress = (
    await deploy("TokenManagementFacet", {
      from: deployer,
      log: true,
    })
  ).address;

  // Deploy MultiBatchSwap
  const multiBatchSwap = await deploy("MultiBatchSwapFacet", {
    from: deployer,
    args: [ROUTERS.QUICKSWAP_V2, ROUTERS.QUICKSWAP_FACTORY_V2], // Uniswap Router, Uniswap Factory
    log: true,
  });

  // Retrieve factories for each facet
  const dcaFacetFactory: DCAFacet = await ethers.getContractAt(
    "DCAFacet",
    dcaFacetAddress,
  );
  const tokenManagementFacetFactory: TokenManagementFacet =
    await ethers.getContractAt(
      "TokenManagementFacet",
      tokenManagementFacetAddress,
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
  const tokenManagementSelectors = getSelectors(
    tokenManagementFacetFactory as unknown as Contract,
  );
  // const governanceSelectors = getSelectors(
  //   governanceFacetFactory as unknown as Contract,
  // );

  log("Selectors for DCAFacet: ", dcaSelectors.join(", "));
  log(
    "Selectors for TokenManagementFacet: ",
    tokenManagementSelectors.join(", "),
  );

  // Define the cuts for the DiamondCut
  const facetCuts = [
    {
      facetAddress: dcaFacetAddress,
      action: 0,
      functionSelectors: dcaSelectors,
    },
    // {
    //   facetAddress: tokenManagementFacetAddress,
    //   action: 0,
    //   functionSelectors: tokenManagementSelectors,
    // },
    // {
    //   facetAddress: diamondGovernance.address,
    //   action: 0,
    //   functionSelectors: governanceSelectors,
    // },
    {
      facetAddress: multiBatchSwap.address,
      action: 0,
      functionSelectors: batchSwapSelectors,
    },
  ];
  // all function selectors console
  log("\n\nSelectors for dca: ", ...dcaSelectors);

  log("\n\nSelectors for batchSwapSelectors: ", ...batchSwapSelectors);

  const diamondInitContract = await ethers.getContractAt(
    "DiamondInit",
    diamondInitDeployment.address,
  );

  const diamondCut = await ethers.getContractAt("IDiamondCut", diamond.address);

  let tx;
  let receipt;
  // call to init function
  let functionCall = diamondInitContract.interface.encodeFunctionData("init");
  tx = await diamondCut.diamondCut(
    facetCuts,
    diamondInitContract.address,
    functionCall,
  );
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
deployDiamond.tags = ["all", "diamond"];

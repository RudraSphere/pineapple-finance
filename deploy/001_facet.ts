// scripts/deployDiamond.ts
import { Contract } from "ethers";
import { deployments, ethers, getNamedAccounts } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import {
  DCAFacet,
  DiamondGovernance,
  TokenManagementFacet,
} from "../typechain-types";
import { getSelectors } from "../utils/getSelectors";

const deployDiamond: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment,
) {
  const { deploy, execute, log } = deployments;
  const { deployer } = await getNamedAccounts();

  // deploy facets
  const dcaFacetAddress = (
    await deploy("DCAFacet", { from: deployer, log: true })
  ).address;
  const tokenManagementFacetAddress = (
    await deploy("TokenManagementFacet", { from: deployer, log: true })
  ).address;
  const diamondCutFacet = await deploy("DiamondCutFacet", {
    from: deployer,
    log: true,
  });
  log(`DiamondCutFacet deployed at ${diamondCutFacet.address}`);

  const DiamondGovernance = await deploy("DiamondGovernance", {
    from: deployer,
    log: true,
  });
  log(`DiamondGovernance deployed at ${DiamondGovernance.address}`);

  const Diamond = await deploy("Diamond", {
    from: deployer,
    args: [diamondCutFacet.address],
    log: true,
  });

  const dcaFacetFactory: DCAFacet = (await ethers.getContractAt(
    "DCAFacet",
    dcaFacetAddress,
  )) as DCAFacet;
  const tokenManagementFacetFactory: TokenManagementFacet =
    (await ethers.getContractAt(
      "TokenManagementFacet",
      tokenManagementFacetAddress,
    )) as TokenManagementFacet;

  const governanceFacetFactory: DiamondGovernance = (await ethers.getContractAt(
    "DiamondGovernance",
    DiamondGovernance,
  )) as DiamondGovernance;

  const _dcaSelectors = getSelectors(dcaFacetFactory as unknown as Contract);
  const _tokenManagementSelectors = getSelectors(
    tokenManagementFacetFactory as unknown as Contract,
  );
  const _governanceFacetSelectors = getSelectors(
    governanceFacetFactory as unknown as Contract,
  );

  log("Selectors for DCAFacet: ", _dcaSelectors.join(", "));
  log(
    "Selectors for TokenManagementFacet: ",
    _tokenManagementSelectors.join(", "),
  );

  // Add facets to diamond
  const facetCuts = [
    {
      facetAddress: dcaFacetAddress,
      action: 0,
      functionSelectors: _dcaSelectors,
    },
    {
      facetAddress: tokenManagementFacetAddress,
      action: 0,
      functionSelectors: _tokenManagementSelectors,
    },
    {
      facetAddress: DiamondGovernance.address,
      action: 0,
      functionSelectors: _governanceFacetSelectors,
    }, // Assuming governance facet has functions to manage roles
  ];

  await execute(
    "DiamondCutFacet",
    { from: deployer },
    "diamondCut",
    facetCuts,
    ethers.constants.AddressZero,
    "0x",
  );
  log("Facets added to Diamond");

  // await hre.run("verify:verify", {
  //   address: diamondCutFacet.address,
  //   constructorArguments: [],
  // });
};

export default deployDiamond;
deployDiamond.tags = ["all", "diamond"];

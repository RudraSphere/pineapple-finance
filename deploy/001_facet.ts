// scripts/deployDiamond.ts
import { Contract } from "ethers";
import { deployments, ethers, getNamedAccounts } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DCAFacet, TokenManagementFacet } from "../typechain-types";
import { getSelectors } from "../utils/getSelectors";

const deployDiamond: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { deploy, execute, log } = deployments;
  const { deployer } = await getNamedAccounts();

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

  const dcaFacetFactory: DCAFacet = (await ethers.getContractAt(
    "DCAFacet",
    dcaFacetAddress
  )) as DCAFacet;
  const tokenManagementFacetFactory: TokenManagementFacet =
    (await ethers.getContractAt(
      "TokenManagementFacet",
      tokenManagementFacetAddress
    )) as TokenManagementFacet;

  const _dcaSelectors = getSelectors(dcaFacetFactory as unknown as Contract);
  const _tokenManagementSelectors = getSelectors(
    tokenManagementFacetFactory as unknown as Contract
  );

  log("Selectors for DCAFacet: ", _dcaSelectors);
  log("Selectors for TokenManagementFacet: ", _tokenManagementSelectors);

  const facetCuts = [
    {
      facetAddress: dcaFacetFactory.address,
      action: 0,
      functionSelectors: _dcaSelectors,
    },
    {
      facetAddress: tokenManagementFacetFactory.address,
      action: 0,
      functionSelectors: _tokenManagementSelectors,
    },
  ];

  await execute(
    "DiamondCutFacet",
    { from: deployer },
    "diamondCut",
    facetCuts,
    ethers.constants.AddressZero,
    "0x"
  );
  log("Facets added to Diamond");
};

export default deployDiamond;
deployDiamond.tags = ["all", "diamond"];

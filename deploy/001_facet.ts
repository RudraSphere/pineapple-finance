// scripts/deployDiamond.ts
import { deployments, ethers, getNamedAccounts } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { getSelectors } from "../utils/getSelectors";

const deployDiamond: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { deploy, execute, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const [deployerSigner] = await ethers.getSigners();

  try {
    const diamondCutFacet = await deploy("DiamondCutFacet", {
      from: deployer,
      log: true,
    });

    const _dcaFacet = await deploy("DCAFacet", {
      from: deployer,
      log: true,
    });
    const _tokenManagementFacet = await deploy("TokenManagementFacet", {
      from: deployer,
      log: true,
    });

    const dcaFacetFactory = await ethers.getContractAt(
      "DCAFacet",
      _dcaFacet.address
    );
    const tokenManagementFacetFactory = await ethers.getContractAt(
      "TokenManagementFacet",
      _tokenManagementFacet.address
    );

    const facetCuts = [
      {
        facetAddress: _dcaFacet.address,
        action: 0,
        functionSelectors: getSelectors(dcaFacetFactory),
      },
      {
        facetAddress: _tokenManagementFacet.address,
        action: 0,
        functionSelectors: getSelectors(tokenManagementFacetFactory),
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
  } catch (error) {
    log("An error occurred during deployment:", error);
  }
};

export default deployDiamond;
deployDiamond.tags = ["all", "diamond"];

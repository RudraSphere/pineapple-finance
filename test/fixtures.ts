import { log } from "console";
import { Contract } from "ethers";
import hre, { deployments, ethers } from "hardhat";
import {
  DCAFacet,
  DiamondGovernance,
  TokenManagementFacet,
} from "../typechain-types";
import { getSelectors } from "../utils/getSelectors";

async function localFixtures() {
  await deployments.fixture(); // Reset Hardhat deployments
  const { deployer } = await hre.getNamedAccounts();

  const dcaFacet = await deployments.deploy("DCAFacet", { from: deployer });
  const tokenManagementFacet = await deployments.deploy(
    "TokenManagementFacet",
    { from: deployer },
  );
  const diamondCutFacet = await deployments.deploy("DiamondCutFacet", {
    from: deployer,
  });
  const diamondGovernance = await deployments.deploy("DiamondGovernance", {
    from: deployer,
  });
  const diamond = await deployments.deploy("Diamond", {
    args: [diamondCutFacet.address],
    from: deployer,
  });

  const dcaFacetFactory: DCAFacet = (await ethers.getContractAt(
    "DCAFacet",
    dcaFacet.address,
  )) as DCAFacet;
  const tokenManagementFacetFactory: TokenManagementFacet =
    (await ethers.getContractAt(
      "TokenManagementFacet",
      tokenManagementFacet.address,
    )) as TokenManagementFacet;

  const governanceFacetFactory: DiamondGovernance = (await ethers.getContractAt(
    "DiamondGovernance",
    diamondGovernance.address,
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

  // Attach facets to diamond using diamondCut
  const cuts = [
    {
      facetAddress: dcaFacet.address,
      action: 0,
      functionSelectors: _dcaSelectors,
    },
    {
      facetAddress: tokenManagementFacet.address,
      action: 0,
      functionSelectors: _tokenManagementSelectors,
    },
    {
      facetAddress: diamondGovernance.address,
      action: 0,
      functionSelectors: _governanceFacetSelectors,
    },
  ];

  const diamondCut = await ethers.getContractAt(
    "DiamondCutFacet",
    diamondCutFacet.address,
  );
  await diamondCut.diamondCut(cuts, ethers.constants.AddressZero, "0x");

  // Use Diamond address for facet interaction
  const diamondAsDCAFacet = await ethers.getContractAt(
    "DCAFacet",
    diamond.address,
  );

  const signers = await hre.ethers.getSigners();
  return {
    dcaFacet: diamondAsDCAFacet,
    governor: signers[0],
    // Add other roles/signers as needed
  };
}

export { localFixtures };

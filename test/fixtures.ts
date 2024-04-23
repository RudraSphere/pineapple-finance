import { log } from "console";
import { Contract } from "ethers";
import hre, { deployments, ethers } from "hardhat";
import {
  DCAFacet,
  DiamondGovernance,
  MultiBatchSwapFacet,
  TokenManagementFacet,
} from "../typechain-types";
import { getSelectors } from "../utils/getSelectors";
import { ROUTERS } from "../utils/polygon.constants";

async function localFixtures() {
  await deployments.fixture();
  const { deployer } = await hre.getNamedAccounts();

  // Deploy PriceFeedRegistry
  const priceFeedRegistry = await deployments.deploy("PriceFeedRegistry", {
    from: deployer,
    log: true,
  });

  // Deploy PriceAggregator
  const priceAggregator = await deployments.deploy("PriceAggregator", {
    from: deployer,
    args: [priceFeedRegistry.address],
    log: true,
  });

  const dcaFacet = await deployments.deploy("DCAFacet", {
    args: [
      priceAggregator.address,
      ROUTERS.QUICKSWAP_V2, // quickswap router v2
    ],
    from: deployer,
  });
  const tokenManagementFacet = await deployments.deploy(
    "TokenManagementFacet",

    { from: deployer },
  );

  // Deploy MultiBatchSwap
  const multiBatchSwap = await deployments.deploy("MultiBatchSwapFacet", {
    from: deployer,
    args: [ROUTERS.QUICKSWAP_V2, ROUTERS.QUICKSWAP_FACTORY_V2], // Uniswap Router, Uniswap Factory
    log: true,
  });

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

  const batchSwapFactory: MultiBatchSwapFacet = (await ethers.getContractAt(
    "MultiBatchSwapFacet",
    multiBatchSwap.address,
  )) as MultiBatchSwapFacet;

  const dcaFacetFactory: DCAFacet = (await ethers.getContractAt(
    "DCAFacet",
    dcaFacet.address,
  )) as DCAFacet;
  const batchSwapSelectors = getSelectors(
    batchSwapFactory as unknown as Contract,
  );
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
    {
      facetAddress: multiBatchSwap.address,
      action: 0,
      functionSelectors: batchSwapSelectors,
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

  const diamondAsBatchSwapFacet = await ethers.getContractAt(
    "MultiBatchSwapFacet",
    diamond.address,
  );

  const signers = await hre.ethers.getSigners();
  return {
    dcaFacet: diamondAsDCAFacet,
    multiBatchSwapFacet: diamondAsBatchSwapFacet,
    governor: signers[0],
    // Add other roles/signers as needed
  };
}

export { localFixtures };

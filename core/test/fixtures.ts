import hre, { deployments, ethers } from "hardhat";
import { ROUTERS } from "../utils/polygon.constants";

async function localFixtures() {
  await deployments.fixture();
  const { deployer } = await hre.getNamedAccounts();

  async function deployFacet(name: any, args: any, dependencies = []) {
    const existingDeployment = await deployments.getOrNull(name);
    if (!existingDeployment) {
      throw Error(`Deployment for ${name} not found`);
      // return await deployments.deploy(name, {
      //   from: deployer,
      //   args: args,
      //   log: true,
      //   waitConfirmations: 5,
      // });
    } else {
      return existingDeployment;
    }
  }

  // Deploying or fetching existing contracts
  const priceFeedRegistry = await deployFacet("PriceFeedRegistry", []);
  const priceAggregator = await deployFacet("PriceAggregator", [
    priceFeedRegistry.address,
  ]);
  const dcaFacet = await deployFacet("DCAFacet", [
    priceAggregator.address,
    ROUTERS.QUICKSWAP_V2,
  ]);
  const tokenManagementFacet = await deployFacet("TokenManagementFacet", []);
  const multiBatchSwap = await deployFacet("MultiBatchSwapFacet", [
    ROUTERS.QUICKSWAP_V2,
    ROUTERS.QUICKSWAP_FACTORY_V2,
  ]);
  const diamondCutFacet = await deployFacet("DiamondCutFacet", []);
  // const diamondGovernance = await deployFacet("DiamondGovernance", []);
  const diamond = await deployFacet("Diamond", [diamondCutFacet.address]);

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

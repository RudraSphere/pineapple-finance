import { deployments, getNamedAccounts } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const deployDiamond: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment,
) {
  const { deploy, log, execute, get } = deployments;
  const { deployer } = await getNamedAccounts();

  const swapperAddress = (await deployments.get("Swapper")).address;

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

  log("\ndeploying dca");
  const dcaFacetAddress = (
    await deploy("DCAFacet", {
      from: deployer,
      args: [],
      log: true,
    })
  ).address;
  // Deploy MultiBatchSwap
  log("\ndeploying MultiBatchSwapFacet");
  const multiBatchSwap = await deploy("MultiBatchSwapFacet", {
    from: deployer,
    log: true,
  });

  // log("Facets have been successfully added to the Diamond");
};

export default deployDiamond;
deployDiamond.tags = ["all", "init"];

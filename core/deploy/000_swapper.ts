import { deployments, getNamedAccounts } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ROUTERS } from "../utils/polygon.constants";

const deployDiamond: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment,
) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  // Deploy swapperContract
  await deploy("Swapper", {
    from: deployer,
    log: true,
    args: [ROUTERS.QUICKSWAP_V2, ROUTERS.QUICKSWAP_FACTORY_V2],
  });

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

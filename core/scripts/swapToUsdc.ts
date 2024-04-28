import { ethers } from "hardhat";
import { IERC20, IUniswapV2Router } from "../typechain-types";
import { COINS, ROUTERS } from "../utils/polygon.constants";

async function main() {
  const [deployer] = await ethers.getSigners();

  const quickswapRouterAddress = ROUTERS.QUICKSWAP_V2; // QuickSwap V2 Router
  const usdcAddress = COINS.USDC_ADDRESS; // USDC contract address on Polygon
  const wrappedMaticAddress = COINS.WMATIC_ADDRESS; // Wrapped Matic (WMATIC) address on Polygon
  const usdcABI = ["function transfer(address to, uint amount) returns (bool)"];

  const usdcContract = (await ethers.getContractAt(
    "IERC20",
    usdcAddress,
  )) as IERC20;

  const maticBalanceBefore = await ethers.provider.getBalance(deployer.address);
  console.log(
    `MATIC balance before swap: ${ethers.utils.formatEther(maticBalanceBefore)} MATIC`,
  );

  const usdcBalanceBefore = await usdcContract
    .connect(deployer as any)
    .balanceOf(deployer.address);
  console.log(
    `USDC balance before swap: ${ethers.utils.formatUnits(usdcBalanceBefore, 6)} USDC`,
  );

  const router = (await ethers.getContractAt(
    "IUniswapV2Router",
    quickswapRouterAddress,
  )) as IUniswapV2Router;

  const amountInMatic = ethers.utils.parseEther("100");
  const path = [wrappedMaticAddress, usdcAddress]; // WETH (MATIC) -> USDC
  const to = deployer.address;
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes from now

  const tx = await router
    .connect(deployer as any)
    .swapExactETHForTokens(0, path, to, deadline, {
      value: amountInMatic,
      gasLimit: 200000,
    });

  const receipt = await tx.wait();
  console.log("Swap transaction hash:", receipt.transactionHash);

  const maticBalanceAfter = await ethers.provider.getBalance(deployer.address);
  console.log(
    `MATIC balance after swap: ${ethers.utils.formatEther(maticBalanceAfter)} MATIC`,
  );

  const usdcBalanceAfter = await usdcContract.balanceOf(deployer.address);
  console.log(
    `USDC balance after swap: ${ethers.utils.formatUnits(usdcBalanceAfter, 6)} USDC`,
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { log } from "console";
import { ethers } from "hardhat";
import { DCAFacet } from "../typechain-types";
import { COINS } from "../utils/polygon.constants";
import { localFixtures } from "./fixtures";

describe("DCA Facet", function () {
  let dcaFacet: DCAFacet;
  let deployerSigner: HardhatEthersSigner;

  beforeEach(async () => {
    const fixtures = await localFixtures();
    dcaFacet = fixtures.dcaFacet;
    deployerSigner = fixtures.governor;
  });

  it("should allow setting up a DCA order", async function () {
    const fromTokenAddress = COINS.USDC_ADDRESS;
    const toTokenAddress = COINS.WMATIC_ADDRESS;
    const amount = ethers.utils.parseUnits("1", 6);
    const interval = 86400; // 1 day
    const orderCount = 4;

    const usdcABI = [
      "function approve(address spender, uint256 amount) returns (bool)",
      "function allowance(address owner, address spender) external view returns (uint256)",
    ];
    const usdcContract = new ethers.Contract(fromTokenAddress, usdcABI);

    console.log("Setting allowance...");
    const approveTx = await usdcContract
      .connect(deployerSigner as any)
      .approve(dcaFacet.address, ethers.utils.parseUnits("10", 6));
    await approveTx.wait();
    console.log("Allowance set.");

    // Check allowance
    const allowance = await usdcContract.allowance(
      deployerSigner.address,
      dcaFacet.address,
    );
    console.log(
      `Allowance set: ${ethers.utils.formatUnits(allowance, 6)} USDC`,
    );

    // Set up DCA order
    console.log("Setting up DCA order...");
    const tx = await dcaFacet
      .connect(deployerSigner)
      .setupDCA(fromTokenAddress, toTokenAddress, amount, interval, orderCount);
    await tx.wait();

    console.log("Fetching order details...");
    const orderDetail = await dcaFacet.getOrderDetails(
      deployerSigner.address,
      0,
    );
    console.log(`Order Details:`);
    console.log(`from Token Address: ${orderDetail.order.fromToken}`);
    console.log(`to Token Address: ${orderDetail.order.toToken}`);
    console.log(
      `Total Amount: ${ethers.utils.formatUnits(orderDetail.order.totalAmount, 6)} USDC`,
    );
    console.log(
      `Amount Per Interval: ${ethers.utils.formatUnits(orderDetail.order.amountPerInterval, 6)} USDC`,
    );
    console.log(`Interval: ${Number(orderDetail.order.interval) / 3600} hours`);
    console.log(
      `Next Execution Time: ${new Date(Number(orderDetail.order.nextExecutionTime) * 1000).toLocaleString()}`,
    );
    console.log(`Order Count: ${orderDetail.order.orderCount}`);
    console.log(`Orders Placed: ${orderDetail.order.ordersPlaced}`);
    console.log(
      `Remaining Amount: ${ethers.utils.formatUnits(orderDetail.remainingAmount, 6)} USDC`,
    );
    console.log(
      `Current Value: ${ethers.utils.formatEther(orderDetail.currentValue)} MATIC`,
    );
    console.log(
      `Current Price per Token: ${ethers.utils.formatUnits(orderDetail.currentPrice, "wei")} MATIC`,
    );
    console.log("Transaction successfully executed");
  });

  it("should execute a DCA order correctly", async function () {
    const fromTokenAddress = COINS.USDC_ADDRESS;
    const toTokenAddress = COINS.WMATIC_ADDRESS;
    const amount = ethers.utils.parseUnits("1", 6);
    const interval = 86400; // 1 day
    const orderCount = 4;

    const usdcABI = [
      "function approve(address spender, uint256 amount) returns (bool)",
      "function allowance(address owner, address spender) external view returns (uint256)",
    ];
    const usdcContract = new ethers.Contract(fromTokenAddress, usdcABI);

    console.log("Setting allowance...");
    const approveTx = await usdcContract
      .connect(deployerSigner as any)
      .approve(dcaFacet.address, ethers.utils.parseUnits("10", 6));
    await approveTx.wait();
    console.log("Allowance set.");

    // Set up DCA order
    console.log("Setting up DCA order...");
    const tx = await dcaFacet
      .connect(deployerSigner)
      .setupDCA(fromTokenAddress, toTokenAddress, amount, interval, orderCount);
    await tx.wait();

    // Move time forward to pass the interval and execute the DCA
    await ethers.provider.send("evm_increaseTime", [interval * 2]);
    await ethers.provider.send("evm_mine", []);

    const _tx = await dcaFacet.connect(deployerSigner).executeDCA(0);
    log(`Transaction hash: ${_tx.hash}`);

    const orderDetail = await dcaFacet.getOrderDetails(
      deployerSigner.address,
      0,
    );
    console.log(`Order Details:`);
    console.log(`from Token Address: ${orderDetail.order.fromToken}`);
    console.log(`to Token Address: ${orderDetail.order.toToken}`);
    console.log(
      `Total Amount: ${ethers.utils.formatEther(orderDetail.order.totalAmount)} tokens`,
    );
    console.log(
      `Amount Per Interval: ${ethers.utils.formatEther(orderDetail.order.amountPerInterval)} tokens`,
    );
    console.log(`Interval: ${Number(orderDetail.order.interval) / 3600} hours`);
    console.log(
      `Next Execution Time: ${new Date(Number(orderDetail.order.nextExecutionTime) * 1000).toLocaleString()}`,
    );
    console.log(`Order Count: ${orderDetail.order.orderCount}`);
    console.log(`Orders Placed: ${orderDetail.order.ordersPlaced}`);
    console.log(
      `Remaining Amount: ${ethers.utils.formatEther(orderDetail.remainingAmount)} tokens`,
    );
    console.log(
      `Current Value: ${ethers.utils.formatEther(orderDetail.currentValue)} ETH`,
    );
    console.log(
      `Current Price per Token: ${ethers.utils.formatUnits(orderDetail.currentPrice, "wei")} ETH`,
    );
  });
});

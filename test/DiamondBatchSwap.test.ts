import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { IERC20, MultiBatchSwapFacet } from "../typechain-types";
import { COINS } from "../utils/polygon.constants";
import { localFixtures } from "./fixtures";

describe("MultiBatchSwap Contract", function () {
  let multiBatchSwapContract: MultiBatchSwapFacet;
  let deployerSigner: HardhatEthersSigner;
  const tokensToSwap = [
    { address: COINS.USDC_ADDRESS, amount: ethers.utils.parseUnits("10", 6) },
    { address: COINS.SHIB, amount: ethers.utils.parseUnits("10", 18) },
  ];
  const targetToken = COINS.WMATIC_ADDRESS;

  beforeEach(async () => {
    const fixtures = await localFixtures();
    multiBatchSwapContract = fixtures.multiBatchSwapFacet;
    deployerSigner = fixtures.governor;
  });

  it("should set allowances for each token and execute batch swap", async function () {
    for (const token of tokensToSwap) {
      const tokenContract = (await ethers.getContractAt(
        "IERC20",
        token.address,
      )) as IERC20;

      // Set allowance for MultiBatchSwap
      console.log(`Setting allowance for ${token.address}...`);
      await tokenContract
        .connect(deployerSigner)
        .approve(multiBatchSwapContract.address, token.amount);
      const allowance = await tokenContract.allowance(
        deployerSigner.address,
        multiBatchSwapContract.address,
      );
      console.log(
        `Allowance set for ${token.address}: ${ethers.utils.formatUnits(allowance, token.amount._isBigNumber ? token.amount._hex.length - 2 : 18)}`,
      );
    }

    // Perform batch swap
    console.log("Performing batch swap...");
    const tx = await multiBatchSwapContract
      .connect(deployerSigner)
      .batchSwapsToSingleToken(
        tokensToSwap.map((token) => token.address),
        tokensToSwap.map((token) => token.amount),
        targetToken,
        deployerSigner.address,
        10,
      );
    await tx.wait();

    console.log(`Transaction hash: ${tx.hash}`);

    for (const token of tokensToSwap) {
      const tokenContract = (await ethers.getContractAt(
        "IERC20",
        token.address,
      )) as IERC20;

      const balance = await tokenContract.balanceOf(deployerSigner.address);
      console.log(
        `Balance after swap for ${token.address}: ${ethers.utils.formatUnits(balance, token.amount._isBigNumber ? token.amount._hex.length - 2 : 18)}`,
      );
    }
  });
});

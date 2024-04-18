import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { DCAFacet } from "../typechain-types";
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
    const tokenAddress = ethers.constants.AddressZero;
    const amount = ethers.utils.parseUnits("1", 18); // 1 token, assuming 18 decimals
    const interval = 86400; // 1 day in seconds

    // Use the Diamond to perform the transaction through the DCA Facet
    const txResponse = await dcaFacet
      .connect(deployerSigner)
      .setupDCA(tokenAddress, amount, interval, { gasLimit: 1000000 });
    await txResponse.wait();

    console.log("Transaction successfully executed");
  });
});

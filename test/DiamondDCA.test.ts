import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { DCAFacet } from "../typechain-types";
import { localFixtures } from "./fixtures";

describe("DCA Facet", function () {
  let dcaFacet: DCAFacet;
  let deployerSigner: HardhatEthersSigner;

  beforeEach(async () => {
    const fixtures = await localFixtures();
    const { dcaFacet: _dcaFacet, governor: _deployer } = fixtures;
    dcaFacet = _dcaFacet;
    deployerSigner = _deployer;
  });

  it("should allow setting up a DCA order", async function () {
    const tokenAddress = ethers.constants.AddressZero;
    const amount = ethers.utils.parseUnits("1", 18);
    const interval = 86400; // 1 day in seconds

    const txResponse = await dcaFacet
      .connect(deployerSigner)
      .setupDCA(tokenAddress, amount, interval);
    console.log("TEST::CALL DONE");
    await txResponse.wait();
    console.log("TEST::CALL DONE 2");
  });
});

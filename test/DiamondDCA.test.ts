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
    const amount = ethers.utils.parseUnits("100", 18); // Assuming token has 18 decimals
    const interval = 86400; // 1 day in seconds

    // Execute transaction and confirm event emission
    await dcaFacet
      .connect(deployerSigner)
      .setupDCA(tokenAddress, amount, interval);
    // await expect(

    // )
    //   .to.emit(dcaFacet, "DCASetup")
    //   .withArgs(deployer, tokenAddress, amount, interval);

    // Fetch orders for deployer
    // const orders = await dcaFacet.userOrders(deployer, deployer);

    // Check the order details
    // expect(orders.length).to.be.greaterThan(0);
    // const order = orders[0];
    // expect(order.tokenAddress).to.equal(tokenAddress);
    // expect(order.amount.toString()).to.equal(amount.toString());
    // expect(order.interval).to.equal(interval);
    // Further checks can be added here for `nextExecutionTime`
  });

  // Add more tests for executeDCA, checkUpkeep, and performUpkeep
});

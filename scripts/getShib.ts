import hre, { ethers } from "hardhat";
import { COINS, WHALES } from "../utils/polygon.constants";

async function main() {
  const [deployer] = await ethers.getSigners();

  // Impersonate the SHIB whale account
  const shibWhaleAddress = WHALES.SHIB_WHALE;
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [shibWhaleAddress],
  });
  const shibWhale = await ethers.provider.getSigner(shibWhaleAddress);

  await deployer.sendTransaction({
    to: shibWhaleAddress,
    value: ethers.utils.parseEther("10"), // Sending 10 MATIC
  });

  const shibAddress = COINS.SHIB; // SHIB contract address on Polygon
  const shibABI = ["function transfer(address to, uint amount) returns (bool)"];
  const shibContract = new ethers.Contract(shibAddress, shibABI);

  const amount = ethers.utils.parseUnits("1000", 18); // 1,000 SHIB
  for (let i = 0; i < 5; i++) {
    const recipient = (await ethers.getSigners())[i];
    await shibContract
      .connect(shibWhale as any)
      .transfer(recipient.address, amount);
    console.log(`Transferred 1000 SHIB to ${recipient.address}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

import hre, { ethers } from "hardhat";
import { COINS, WHALES } from "../utils/polygon.constants";

async function main() {
  const [deployer] = await ethers.getSigners();

  // Impersonate the USDC whale account
  const usdcWhaleAddress = WHALES.USDC_WHALE;
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [usdcWhaleAddress],
  });
  const usdcWhale = await ethers.provider.getSigner(usdcWhaleAddress);

  await deployer.sendTransaction({
    to: usdcWhaleAddress,
    value: ethers.utils.parseEther("10"), // Sending 10 MATIC
  });

  const usdcAddress = COINS.USDC_ADDRESS; // USDC contract address on Polygon
  const usdcABI = ["function transfer(address to, uint amount) returns (bool)"];
  const usdcContract = new ethers.Contract(usdcAddress, usdcABI);

  const amount = ethers.utils.parseUnits("1000", 6); // 1,000 USDC
  for (let i = 0; i < 5; i++) {
    const recipient = (await ethers.getSigners())[i];
    await usdcContract
      .connect(usdcWhale as any)
      .transfer(recipient.address, amount);
    console.log(`Transferred 1000 USDC to ${recipient.address}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

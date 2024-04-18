import hre, { deployments, ethers } from "hardhat";

async function localFixtures() {
  await deployments.fixture(["all"]);
  const { deployer } = await hre.getNamedAccounts();
  const diamond = await ethers.getContractAt(
    "Diamond",
    (await deployments.get("Diamond")).address
  );
  const dcaFacet = await ethers.getContractAt(
    "DCAFacet",
    (await deployments.get("DCAFacet")).address
  );

  const contracts = {
    dcaFacet,
    diamond,
  };

  const signers = await hre.ethers.getSigners();
  const governor = signers[0];
  const strategist = signers[0];
  const adjuster = signers[0];
  const treasury = signers[1];
  const matt = signers[4];
  const josh = signers[5];
  const anna = signers[6];
  const rio = signers[7];

  return {
    ...contracts,
    governor,
    strategist,
    adjuster,
    treasury,
    matt,
    josh,
    anna,
    rio,
  };
}

export { localFixtures };

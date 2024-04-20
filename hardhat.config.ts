import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-network-helpers";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-solhint";
import "@openzeppelin/hardhat-upgrades";
import "dotenv/config";
import "hardhat-contract-sizer";
import "hardhat-deploy";
import "hardhat-gas-reporter";
import { HardhatUserConfig } from "hardhat/config";
import "solidity-coverage";

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  solidity: {
    version: "0.8.10",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 137,
      allowUnlimitedContractSize: true,
      forking: {
        enabled: true,
        url: "https://rpc.ankr.com/polygon",
      },
      // live: true,
      // mining: { auto: true },
      // blockGasLimit: 15000000, // Set to a higher limit
      // gas: 12000000, // Set to a higher limit, optional as Hardhat automatically handles gas
      loggingEnabled: true,
      accounts: {
        mnemonic: process.env.MNEMONICS,
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 10,
        passphrase: "",
        accountsBalance: "10000000000000000000000",
      },
    },
    internalRPC: {
      url: "https://ankit5577.eu.org/",
      accounts: [process.env.PK || ""],
      allowUnlimitedContractSize: true,
      // blockGasLimit: 1e5,
      // gas: 1e4,
      timeout: 30 * 60 * 60,
    },
  },
  // ? with use of hardhat-verify, we can verify contracts from here.
  etherscan: {
    apiKey: "59YTKIM92FH2MJCK6IY69A2DV7RX2XVBFX",
  },
  gasReporter: {
    enabled: false,
    currency: "USD",
    gasPrice: 1e12,
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
    // only: [":ERC20$"],
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  mocha: {
    timeout: 40000,
  },
  paths: {
    sources: "./contracts",
    artifacts: "./artifacts",
    cache: "./cache",
    tests: "./test",
  },
};

export default config;

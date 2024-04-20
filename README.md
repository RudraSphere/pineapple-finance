# Pineapple Finance: DCA + Diamond Architecture Project

This project implements a Decentralized Finance (DeFi) application using a Diamond architecture to facilitate Dollar Cost Averaging (DCA) strategies across various ERC-20 tokens. The system leverages the Diamond standard (EIP-2535) for flexibility and upgradability, and Uniswap/Quickswap for token swapping and liquidity management.

## Overview

The project integrates multiple facets in a diamond architecture to manage different aspects of DCA strategies:

- **DCAFacet**: Manages the lifecycle of DCA orders, including token swaps via Uniswap/Quickswap.
- **TokenManagementFacet**: Handles ERC-20 token interactions.
- **PriceAggregatorFacet**: Interfaces with price feed oracles to obtain real-time price data.
- **PriceFeedRegistry**: Maintains mappings of tokens to their price feeds for real-time price retrieval.

## Prerequisites

- Node.js (v14.x or later)
- npm or Yarn
- Hardhat
- Solidity (v0.8.x)
- OpenZeppelin Contracts
- An Ethereum wallet with testnet/mainnet ETH and a Web3 provider (e.g., MetaMask)

## Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
npm install
```

or using Yarn or Bun

```bash
yarn install
# or
bun install --clean
```

## Configuration

Create a .env file at the root of the project directory and populate it with the necessary environment variables:

```plaintext
PRIVATE_KEY=your-wallet-private-key
INFURA_API_KEY=your-infura-api-key
ALCHEMY_API_KEY=your-alchemy-api-key
```

## Compiling Contracts

Compile the smart contracts with Hardhat:

```bash
npx hardhat compile
```

## Deploying Contracts

Deploy the contracts to a local testnet or to a live network:

```bash
npx hardhat run scripts/deploy.js --network rinkeby
```

## Running Tests

Execute the test suite to ensure the contracts function as expected:

```bash

npx hardhat test
```

## Code Formatting

Ensure code consistency using Prettier:

```bash

npx prettier --write "contracts/**/*.sol"
```

## Using Uniswap/Quickswap in DCAFacet

The DCAFacet integrates with Uniswap/Quickswap to perform token swaps during DCA order execution. It uses the Uniswap/Quickswap Router for token-to-token swaps and interacts with liquidity pools.

## Interacting with the Deployed Contracts

- Setting up a DCA Order: Use the setupDCA function to initiate a new DCA order.

```solidity

function setupDCA(
    address _tokenAddress,
    uint256 _totalAmount,
    uint256 _interval,
    uint256 _orderCount
) external;
```

- Executing a DCA Order: Manually or automatically trigger the execution of DCA orders.

```solidity

function executeDCA(uint index) public;
```

- Querying Order Details: Fetch details about specific or all DCA orders for a user.

```solidity

function getOrderDetails(address user, uint index) public view returns (DCAOrder memory);
function getAllOrders(address user) public view returns (DCAOrder[] memory);
```

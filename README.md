# Pineapple Finance: DCA + MultiBatch swap with Diamond Architecture Personal Project

This project implements a Decentralized Finance (DeFi) application using a Diamond architecture to facilitate Dollar Cost Averaging (DCA) strategies across various ERC-20 tokens and MultiBatch Swap Facet to reduce gas using Diamond. The system leverages the Diamond standard (EIP-2535) for flexibility and upgradability, and Uniswap/Quickswap for token swapping and liquidity management.

# Live URL

dApp is hosted on Cloudflare using Static Site Generation
preview: https://pineapple-finance.pages.dev/

## Overview

The project integrates multiple facets in a diamond architecture to manage different aspects of DCA strategies:

- [WIP] **MultiBatchSwapFacet**: Allows for batch token swaps, enabling users to swap multiple tokens in a single trensaction .
- [WIP] **DCAFacet**: Manages the lifecycle of DCA orders, including token swaps via Uniswap/Quickswap.
- **TokenManagementFacet**: Handles ERC-20 token interactions.
- [WIP] **PriceAggregatorFacet**: Interfaces with price feed oracles to obtain real-time price data.
- **PriceFeedRegistry**: Maintains mappings of tokens to their price feeds for real-time price retrieval.

## Project Structure

- core: Contains Hardhat and contract-related code.
- app: Contains frontend code built with Next.js.

## Prerequisites

- Node.js (v14.x or later)
- npm or Yarn or Bun
- Hardhat
- Solidity (v0.8.x)
- OpenZeppelin Contracts
- Next.js (v14 or later)

## Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/RudraSphere/pineapple-finance.git
cd pineapple-finance

# for CORE / HARDHAT / CONTRACTS
cd core
npm install -f

# for dAPP / NextJS
cd app
npm install -f
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
PK=your-wallet-private-key
MNEMONICS=
```

## Run Polygon Forked Node

Run Node in different terminal w/o deploying (this Project uses a Polygon fork):

```bash
npx hardhat node --no-deploy
```

## Compiling Contracts

Compile the smart contracts with Hardhat:

```bash
npx hardhat compile
```

## Deploying Contracts

Deploy the contracts to a local testnet or to a live network:

```bash
npx hardhat deploy --network localhost
```

## Running Tests

Execute the test suite to ensure the contracts function as expected:

```bash

npx hardhat test --grep "" --network localhost
```

## Code Formatting

Ensure code consistency using Prettier:

```bash

npx prettier --write "contracts/**/*.sol"
# OR
npm run prettier
```

## Remove deployed contracts + artifacts + type-chain

```bash
npm run clean
```

## Get USDC / SHIB coins for testing on Polygon Fork via impersonating

```bash
# for USDC
npx hardhat run scripts/getUsdc.ts --network localhost
# for SHIB
npx hardhat run scripts/getShib.ts --network localhost
```

## Using Uniswap/Quickswap in DCAFacet

The DCAFacet integrates with Uniswap/Quickswap to perform token swaps during DCA order execution. It uses the Uniswap/Quickswap Router for token-to-token swaps and interacts with liquidity pools.

## Interacting with the Deployed Contracts

## Using MultiBatchSwapFacet

The MultiBatchSwapFacet enables batch token swaps, providing flexibility in swap routes and allowing for multi-hop swaps. This can be useful when direct swap routes don't exist, enabling a more complex swap logic.

### Setting Up the Swap

Use the `batchSwapsToSingleToken` function to swap multiple tokens in one transaction:
Use the `batchSwapToSingleToken` function to swap single tokens in one transaction with Hop route if it does not exists:

```solidity
function batchSwapsToSingleToken(
    address[] memory inputTokens,
        uint256[] memory inputAmounts,
        address outputToken,
        address recipient,
        uint256 slippageTolerance
) external;

function batchSwapToSingleToken(
        address fromToken,
        address toToken,
        uint256 amount,
        address recipient
    ) external;
```

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

/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  DeployContractOptions,
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomicfoundation/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "AccessControl",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.AccessControl__factory>;
    getContractFactory(
      name: "IAccessControl",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IAccessControl__factory>;
    getContractFactory(
      name: "Ownable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Ownable__factory>;
    getContractFactory(
      name: "IERC20Permit",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Permit__factory>;
    getContractFactory(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20__factory>;
    getContractFactory(
      name: "ERC165",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC165__factory>;
    getContractFactory(
      name: "IERC165",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC165__factory>;
    getContractFactory(
      name: "Diamond",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Diamond__factory>;
    getContractFactory(
      name: "DiamondCutFacet",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DiamondCutFacet__factory>;
    getContractFactory(
      name: "DiamondGovernance",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DiamondGovernance__factory>;
    getContractFactory(
      name: "DCAFacet",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DCAFacet__factory>;
    getContractFactory(
      name: "IAggregatorV3",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IAggregatorV3__factory>;
    getContractFactory(
      name: "MultiBatchSwapFacet",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MultiBatchSwapFacet__factory>;
    getContractFactory(
      name: "TokenManagementFacet",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TokenManagementFacet__factory>;
    getContractFactory(
      name: "IAggregatorV3",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IAggregatorV3__factory>;
    getContractFactory(
      name: "IDCA",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IDCA__factory>;
    getContractFactory(
      name: "IDiamondCut",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IDiamondCut__factory>;
    getContractFactory(
      name: "IUniswapV2Factory",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IUniswapV2Factory__factory>;
    getContractFactory(
      name: "IUniswapV2Router",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IUniswapV2Router__factory>;
    getContractFactory(
      name: "PriceAggregator",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.PriceAggregator__factory>;
    getContractFactory(
      name: "PriceFeedRegistry",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.PriceFeedRegistry__factory>;
    getContractFactory(
      name: "TestFacet",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TestFacet__factory>;

    getContractAt(
      name: "AccessControl",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.AccessControl>;
    getContractAt(
      name: "IAccessControl",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IAccessControl>;
    getContractAt(
      name: "Ownable",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Ownable>;
    getContractAt(
      name: "IERC20Permit",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20Permit>;
    getContractAt(
      name: "IERC20",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20>;
    getContractAt(
      name: "ERC165",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC165>;
    getContractAt(
      name: "IERC165",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC165>;
    getContractAt(
      name: "Diamond",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Diamond>;
    getContractAt(
      name: "DiamondCutFacet",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.DiamondCutFacet>;
    getContractAt(
      name: "DiamondGovernance",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.DiamondGovernance>;
    getContractAt(
      name: "DCAFacet",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.DCAFacet>;
    getContractAt(
      name: "IAggregatorV3",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IAggregatorV3>;
    getContractAt(
      name: "MultiBatchSwapFacet",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.MultiBatchSwapFacet>;
    getContractAt(
      name: "TokenManagementFacet",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.TokenManagementFacet>;
    getContractAt(
      name: "IAggregatorV3",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IAggregatorV3>;
    getContractAt(
      name: "IDCA",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IDCA>;
    getContractAt(
      name: "IDiamondCut",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IDiamondCut>;
    getContractAt(
      name: "IUniswapV2Factory",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IUniswapV2Factory>;
    getContractAt(
      name: "IUniswapV2Router",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IUniswapV2Router>;
    getContractAt(
      name: "PriceAggregator",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.PriceAggregator>;
    getContractAt(
      name: "PriceFeedRegistry",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.PriceFeedRegistry>;
    getContractAt(
      name: "TestFacet",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.TestFacet>;

    deployContract(
      name: "AccessControl",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.AccessControl>;
    deployContract(
      name: "IAccessControl",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IAccessControl>;
    deployContract(
      name: "Ownable",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Ownable>;
    deployContract(
      name: "IERC20Permit",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC20Permit>;
    deployContract(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC20>;
    deployContract(
      name: "ERC165",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC165>;
    deployContract(
      name: "IERC165",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC165>;
    deployContract(
      name: "Diamond",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Diamond>;
    deployContract(
      name: "DiamondCutFacet",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.DiamondCutFacet>;
    deployContract(
      name: "DiamondGovernance",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.DiamondGovernance>;
    deployContract(
      name: "DCAFacet",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.DCAFacet>;
    deployContract(
      name: "IAggregatorV3",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IAggregatorV3>;
    deployContract(
      name: "MultiBatchSwapFacet",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.MultiBatchSwapFacet>;
    deployContract(
      name: "TokenManagementFacet",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.TokenManagementFacet>;
    deployContract(
      name: "IAggregatorV3",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IAggregatorV3>;
    deployContract(
      name: "IDCA",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IDCA>;
    deployContract(
      name: "IDiamondCut",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IDiamondCut>;
    deployContract(
      name: "IUniswapV2Factory",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IUniswapV2Factory>;
    deployContract(
      name: "IUniswapV2Router",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IUniswapV2Router>;
    deployContract(
      name: "PriceAggregator",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.PriceAggregator>;
    deployContract(
      name: "PriceFeedRegistry",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.PriceFeedRegistry>;
    deployContract(
      name: "TestFacet",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.TestFacet>;

    deployContract(
      name: "AccessControl",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.AccessControl>;
    deployContract(
      name: "IAccessControl",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IAccessControl>;
    deployContract(
      name: "Ownable",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Ownable>;
    deployContract(
      name: "IERC20Permit",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC20Permit>;
    deployContract(
      name: "IERC20",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC20>;
    deployContract(
      name: "ERC165",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC165>;
    deployContract(
      name: "IERC165",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC165>;
    deployContract(
      name: "Diamond",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Diamond>;
    deployContract(
      name: "DiamondCutFacet",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.DiamondCutFacet>;
    deployContract(
      name: "DiamondGovernance",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.DiamondGovernance>;
    deployContract(
      name: "DCAFacet",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.DCAFacet>;
    deployContract(
      name: "IAggregatorV3",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IAggregatorV3>;
    deployContract(
      name: "MultiBatchSwapFacet",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.MultiBatchSwapFacet>;
    deployContract(
      name: "TokenManagementFacet",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.TokenManagementFacet>;
    deployContract(
      name: "IAggregatorV3",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IAggregatorV3>;
    deployContract(
      name: "IDCA",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IDCA>;
    deployContract(
      name: "IDiamondCut",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IDiamondCut>;
    deployContract(
      name: "IUniswapV2Factory",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IUniswapV2Factory>;
    deployContract(
      name: "IUniswapV2Router",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IUniswapV2Router>;
    deployContract(
      name: "PriceAggregator",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.PriceAggregator>;
    deployContract(
      name: "PriceFeedRegistry",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.PriceFeedRegistry>;
    deployContract(
      name: "TestFacet",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.TestFacet>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
    deployContract(
      name: string,
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<ethers.Contract>;
    deployContract(
      name: string,
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<ethers.Contract>;
  }
}
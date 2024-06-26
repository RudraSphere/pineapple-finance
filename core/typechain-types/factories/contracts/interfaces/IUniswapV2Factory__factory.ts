/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  IUniswapV2Factory,
  IUniswapV2FactoryInterface,
} from "../../../contracts/interfaces/IUniswapV2Factory";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_inputToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "_outputToken",
        type: "address",
      },
    ],
    name: "getPair",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export class IUniswapV2Factory__factory {
  static readonly abi = _abi;
  static createInterface(): IUniswapV2FactoryInterface {
    return new Interface(_abi) as IUniswapV2FactoryInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): IUniswapV2Factory {
    return new Contract(address, _abi, runner) as unknown as IUniswapV2Factory;
  }
}

/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../../../common";

export declare namespace DCAFacet {
  export type DCAOrderStruct = {
    fromToken: AddressLike;
    toToken: AddressLike;
    totalAmount: BigNumberish;
    amountPerInterval: BigNumberish;
    interval: BigNumberish;
    nextExecutionTime: BigNumberish;
    orderCount: BigNumberish;
    ordersPlaced: BigNumberish;
  };

  export type DCAOrderStructOutput = [
    fromToken: string,
    toToken: string,
    totalAmount: bigint,
    amountPerInterval: bigint,
    interval: bigint,
    nextExecutionTime: bigint,
    orderCount: bigint,
    ordersPlaced: bigint
  ] & {
    fromToken: string;
    toToken: string;
    totalAmount: bigint;
    amountPerInterval: bigint;
    interval: bigint;
    nextExecutionTime: bigint;
    orderCount: bigint;
    ordersPlaced: bigint;
  };

  export type OrderDetailStruct = {
    id: BigNumberish;
    order: DCAFacet.DCAOrderStruct;
    remainingAmount: BigNumberish;
    currentValue: BigNumberish;
    currentPrice: BigNumberish;
  };

  export type OrderDetailStructOutput = [
    id: bigint,
    order: DCAFacet.DCAOrderStructOutput,
    remainingAmount: bigint,
    currentValue: bigint,
    currentPrice: bigint
  ] & {
    id: bigint;
    order: DCAFacet.DCAOrderStructOutput;
    remainingAmount: bigint;
    currentValue: bigint;
    currentPrice: bigint;
  };
}

export interface DCAFacetInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "FEE_DECIMALS"
      | "checkUpkeep"
      | "executeDCA"
      | "feeRate"
      | "getAllActiveOrders"
      | "getAllOrders"
      | "getOrderDetails"
      | "performUpkeep"
      | "priceAggregator"
      | "setFees"
      | "setupDCA"
      | "uniswapRouter"
      | "userOrders"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic: "AllOrdersExecuted" | "DCAExecuted" | "DCASetup"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "FEE_DECIMALS",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "checkUpkeep",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "executeDCA",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "feeRate", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getAllActiveOrders",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getAllOrders",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getOrderDetails",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "performUpkeep",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "priceAggregator",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setFees",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setupDCA",
    values: [AddressLike, AddressLike, BigNumberish, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "uniswapRouter",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "userOrders",
    values: [AddressLike, BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "FEE_DECIMALS",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "checkUpkeep",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "executeDCA", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "feeRate", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getAllActiveOrders",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getAllOrders",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getOrderDetails",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "performUpkeep",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "priceAggregator",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setFees", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setupDCA", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "uniswapRouter",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "userOrders", data: BytesLike): Result;
}

export namespace AllOrdersExecutedEvent {
  export type InputTuple = [user: AddressLike, index: BigNumberish];
  export type OutputTuple = [user: string, index: bigint];
  export interface OutputObject {
    user: string;
    index: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace DCAExecutedEvent {
  export type InputTuple = [
    user: AddressLike,
    fromToken: AddressLike,
    toToken: AddressLike,
    amount: BigNumberish
  ];
  export type OutputTuple = [
    user: string,
    fromToken: string,
    toToken: string,
    amount: bigint
  ];
  export interface OutputObject {
    user: string;
    fromToken: string;
    toToken: string;
    amount: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace DCASetupEvent {
  export type InputTuple = [
    user: AddressLike,
    fromToken: AddressLike,
    toToken: AddressLike,
    amount: BigNumberish,
    interval: BigNumberish,
    orderCount: BigNumberish
  ];
  export type OutputTuple = [
    user: string,
    fromToken: string,
    toToken: string,
    amount: bigint,
    interval: bigint,
    orderCount: bigint
  ];
  export interface OutputObject {
    user: string;
    fromToken: string;
    toToken: string;
    amount: bigint;
    interval: bigint;
    orderCount: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface DCAFacet extends BaseContract {
  connect(runner?: ContractRunner | null): DCAFacet;
  waitForDeployment(): Promise<this>;

  interface: DCAFacetInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  FEE_DECIMALS: TypedContractMethod<[], [bigint], "view">;

  checkUpkeep: TypedContractMethod<
    [arg0: BytesLike],
    [[boolean, string] & { upkeepNeeded: boolean }],
    "view"
  >;

  executeDCA: TypedContractMethod<[index: BigNumberish], [void], "nonpayable">;

  feeRate: TypedContractMethod<[], [bigint], "view">;

  getAllActiveOrders: TypedContractMethod<
    [user: AddressLike],
    [DCAFacet.OrderDetailStructOutput[]],
    "view"
  >;

  getAllOrders: TypedContractMethod<
    [user: AddressLike],
    [DCAFacet.DCAOrderStructOutput[]],
    "view"
  >;

  getOrderDetails: TypedContractMethod<
    [user: AddressLike, index: BigNumberish],
    [DCAFacet.OrderDetailStructOutput],
    "view"
  >;

  performUpkeep: TypedContractMethod<[arg0: BytesLike], [void], "nonpayable">;

  priceAggregator: TypedContractMethod<[], [string], "view">;

  setFees: TypedContractMethod<[_rate: BigNumberish], [void], "nonpayable">;

  setupDCA: TypedContractMethod<
    [
      _fromToken: AddressLike,
      _toToken: AddressLike,
      _totalAmount: BigNumberish,
      _interval: BigNumberish,
      _orderCount: BigNumberish
    ],
    [void],
    "nonpayable"
  >;

  uniswapRouter: TypedContractMethod<[], [string], "view">;

  userOrders: TypedContractMethod<
    [arg0: AddressLike, arg1: BigNumberish],
    [
      [string, string, bigint, bigint, bigint, bigint, bigint, bigint] & {
        fromToken: string;
        toToken: string;
        totalAmount: bigint;
        amountPerInterval: bigint;
        interval: bigint;
        nextExecutionTime: bigint;
        orderCount: bigint;
        ordersPlaced: bigint;
      }
    ],
    "view"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "FEE_DECIMALS"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "checkUpkeep"
  ): TypedContractMethod<
    [arg0: BytesLike],
    [[boolean, string] & { upkeepNeeded: boolean }],
    "view"
  >;
  getFunction(
    nameOrSignature: "executeDCA"
  ): TypedContractMethod<[index: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "feeRate"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "getAllActiveOrders"
  ): TypedContractMethod<
    [user: AddressLike],
    [DCAFacet.OrderDetailStructOutput[]],
    "view"
  >;
  getFunction(
    nameOrSignature: "getAllOrders"
  ): TypedContractMethod<
    [user: AddressLike],
    [DCAFacet.DCAOrderStructOutput[]],
    "view"
  >;
  getFunction(
    nameOrSignature: "getOrderDetails"
  ): TypedContractMethod<
    [user: AddressLike, index: BigNumberish],
    [DCAFacet.OrderDetailStructOutput],
    "view"
  >;
  getFunction(
    nameOrSignature: "performUpkeep"
  ): TypedContractMethod<[arg0: BytesLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "priceAggregator"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "setFees"
  ): TypedContractMethod<[_rate: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setupDCA"
  ): TypedContractMethod<
    [
      _fromToken: AddressLike,
      _toToken: AddressLike,
      _totalAmount: BigNumberish,
      _interval: BigNumberish,
      _orderCount: BigNumberish
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "uniswapRouter"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "userOrders"
  ): TypedContractMethod<
    [arg0: AddressLike, arg1: BigNumberish],
    [
      [string, string, bigint, bigint, bigint, bigint, bigint, bigint] & {
        fromToken: string;
        toToken: string;
        totalAmount: bigint;
        amountPerInterval: bigint;
        interval: bigint;
        nextExecutionTime: bigint;
        orderCount: bigint;
        ordersPlaced: bigint;
      }
    ],
    "view"
  >;

  getEvent(
    key: "AllOrdersExecuted"
  ): TypedContractEvent<
    AllOrdersExecutedEvent.InputTuple,
    AllOrdersExecutedEvent.OutputTuple,
    AllOrdersExecutedEvent.OutputObject
  >;
  getEvent(
    key: "DCAExecuted"
  ): TypedContractEvent<
    DCAExecutedEvent.InputTuple,
    DCAExecutedEvent.OutputTuple,
    DCAExecutedEvent.OutputObject
  >;
  getEvent(
    key: "DCASetup"
  ): TypedContractEvent<
    DCASetupEvent.InputTuple,
    DCASetupEvent.OutputTuple,
    DCASetupEvent.OutputObject
  >;

  filters: {
    "AllOrdersExecuted(address,uint256)": TypedContractEvent<
      AllOrdersExecutedEvent.InputTuple,
      AllOrdersExecutedEvent.OutputTuple,
      AllOrdersExecutedEvent.OutputObject
    >;
    AllOrdersExecuted: TypedContractEvent<
      AllOrdersExecutedEvent.InputTuple,
      AllOrdersExecutedEvent.OutputTuple,
      AllOrdersExecutedEvent.OutputObject
    >;

    "DCAExecuted(address,address,address,uint256)": TypedContractEvent<
      DCAExecutedEvent.InputTuple,
      DCAExecutedEvent.OutputTuple,
      DCAExecutedEvent.OutputObject
    >;
    DCAExecuted: TypedContractEvent<
      DCAExecutedEvent.InputTuple,
      DCAExecutedEvent.OutputTuple,
      DCAExecutedEvent.OutputObject
    >;

    "DCASetup(address,address,address,uint256,uint256,uint256)": TypedContractEvent<
      DCASetupEvent.InputTuple,
      DCASetupEvent.OutputTuple,
      DCASetupEvent.OutputObject
    >;
    DCASetup: TypedContractEvent<
      DCASetupEvent.InputTuple,
      DCASetupEvent.OutputTuple,
      DCASetupEvent.OutputObject
    >;
  };
}

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
} from "../../common";

export interface IDCAInterface extends Interface {
  getFunction(nameOrSignature: "executeDCA" | "setupDCA"): FunctionFragment;

  getEvent(nameOrSignatureOrTopic: "DCAExecuted" | "DCASetup"): EventFragment;

  encodeFunctionData(
    functionFragment: "executeDCA",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setupDCA",
    values: [AddressLike, BigNumberish, BigNumberish, BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "executeDCA", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setupDCA", data: BytesLike): Result;
}

export namespace DCAExecutedEvent {
  export type InputTuple = [
    user: AddressLike,
    token: AddressLike,
    amount: BigNumberish
  ];
  export type OutputTuple = [user: string, token: string, amount: bigint];
  export interface OutputObject {
    user: string;
    token: string;
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
    token: AddressLike,
    amount: BigNumberish,
    interval: BigNumberish,
    orderCount: BigNumberish
  ];
  export type OutputTuple = [
    user: string,
    token: string,
    amount: bigint,
    interval: bigint,
    orderCount: bigint
  ];
  export interface OutputObject {
    user: string;
    token: string;
    amount: bigint;
    interval: bigint;
    orderCount: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface IDCA extends BaseContract {
  connect(runner?: ContractRunner | null): IDCA;
  waitForDeployment(): Promise<this>;

  interface: IDCAInterface;

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

  executeDCA: TypedContractMethod<[index: BigNumberish], [void], "nonpayable">;

  setupDCA: TypedContractMethod<
    [
      _tokenAddress: AddressLike,
      _amount: BigNumberish,
      _interval: BigNumberish,
      _orderCount: BigNumberish
    ],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "executeDCA"
  ): TypedContractMethod<[index: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setupDCA"
  ): TypedContractMethod<
    [
      _tokenAddress: AddressLike,
      _amount: BigNumberish,
      _interval: BigNumberish,
      _orderCount: BigNumberish
    ],
    [void],
    "nonpayable"
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
    "DCAExecuted(address,address,uint256)": TypedContractEvent<
      DCAExecutedEvent.InputTuple,
      DCAExecutedEvent.OutputTuple,
      DCAExecutedEvent.OutputObject
    >;
    DCAExecuted: TypedContractEvent<
      DCAExecutedEvent.InputTuple,
      DCAExecutedEvent.OutputTuple,
      DCAExecutedEvent.OutputObject
    >;

    "DCASetup(address,address,uint256,uint256,uint256)": TypedContractEvent<
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

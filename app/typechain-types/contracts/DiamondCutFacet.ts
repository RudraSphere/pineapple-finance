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
} from "../common";

export declare namespace IDiamondCut {
  export type FacetCutStruct = {
    facetAddress: AddressLike;
    action: BigNumberish;
    functionSelectors: BytesLike[];
  };

  export type FacetCutStructOutput = [
    facetAddress: string,
    action: bigint,
    functionSelectors: string[]
  ] & { facetAddress: string; action: bigint; functionSelectors: string[] };
}

export interface DiamondCutFacetInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "DEFAULT_ADMIN_ROLE"
      | "UPGRADE_ADMIN_ROLE"
      | "addUpgradeAdmin"
      | "diamondCut"
      | "getFacetAddress"
      | "getRoleAdmin"
      | "grantRole"
      | "hasRole"
      | "removeUpgradeAdmin"
      | "renounceRole"
      | "revokeRole"
      | "supportsInterface"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "DiamondCut"
      | "FacetRemoved"
      | "FacetUpdated"
      | "RoleAdminChanged"
      | "RoleGranted"
      | "RoleRevoked"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "DEFAULT_ADMIN_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "UPGRADE_ADMIN_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "addUpgradeAdmin",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "diamondCut",
    values: [IDiamondCut.FacetCutStruct[], AddressLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getFacetAddress",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getRoleAdmin",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "grantRole",
    values: [BytesLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "hasRole",
    values: [BytesLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "removeUpgradeAdmin",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceRole",
    values: [BytesLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "revokeRole",
    values: [BytesLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "DEFAULT_ADMIN_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "UPGRADE_ADMIN_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addUpgradeAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "diamondCut", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getFacetAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRoleAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "grantRole", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "hasRole", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "removeUpgradeAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceRole",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "revokeRole", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
}

export namespace DiamondCutEvent {
  export type InputTuple = [
    _facetCuts: IDiamondCut.FacetCutStruct[],
    _init: AddressLike,
    _calldata: BytesLike
  ];
  export type OutputTuple = [
    _facetCuts: IDiamondCut.FacetCutStructOutput[],
    _init: string,
    _calldata: string
  ];
  export interface OutputObject {
    _facetCuts: IDiamondCut.FacetCutStructOutput[];
    _init: string;
    _calldata: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace FacetRemovedEvent {
  export type InputTuple = [selector: BytesLike];
  export type OutputTuple = [selector: string];
  export interface OutputObject {
    selector: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace FacetUpdatedEvent {
  export type InputTuple = [facetAddress: AddressLike, selector: BytesLike];
  export type OutputTuple = [facetAddress: string, selector: string];
  export interface OutputObject {
    facetAddress: string;
    selector: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace RoleAdminChangedEvent {
  export type InputTuple = [
    role: BytesLike,
    previousAdminRole: BytesLike,
    newAdminRole: BytesLike
  ];
  export type OutputTuple = [
    role: string,
    previousAdminRole: string,
    newAdminRole: string
  ];
  export interface OutputObject {
    role: string;
    previousAdminRole: string;
    newAdminRole: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace RoleGrantedEvent {
  export type InputTuple = [
    role: BytesLike,
    account: AddressLike,
    sender: AddressLike
  ];
  export type OutputTuple = [role: string, account: string, sender: string];
  export interface OutputObject {
    role: string;
    account: string;
    sender: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace RoleRevokedEvent {
  export type InputTuple = [
    role: BytesLike,
    account: AddressLike,
    sender: AddressLike
  ];
  export type OutputTuple = [role: string, account: string, sender: string];
  export interface OutputObject {
    role: string;
    account: string;
    sender: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface DiamondCutFacet extends BaseContract {
  connect(runner?: ContractRunner | null): DiamondCutFacet;
  waitForDeployment(): Promise<this>;

  interface: DiamondCutFacetInterface;

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

  DEFAULT_ADMIN_ROLE: TypedContractMethod<[], [string], "view">;

  UPGRADE_ADMIN_ROLE: TypedContractMethod<[], [string], "view">;

  addUpgradeAdmin: TypedContractMethod<
    [newAdmin: AddressLike],
    [void],
    "nonpayable"
  >;

  diamondCut: TypedContractMethod<
    [
      _facetCuts: IDiamondCut.FacetCutStruct[],
      _init: AddressLike,
      _calldata: BytesLike
    ],
    [void],
    "nonpayable"
  >;

  getFacetAddress: TypedContractMethod<[selector: BytesLike], [string], "view">;

  getRoleAdmin: TypedContractMethod<[role: BytesLike], [string], "view">;

  grantRole: TypedContractMethod<
    [role: BytesLike, account: AddressLike],
    [void],
    "nonpayable"
  >;

  hasRole: TypedContractMethod<
    [role: BytesLike, account: AddressLike],
    [boolean],
    "view"
  >;

  removeUpgradeAdmin: TypedContractMethod<
    [admin: AddressLike],
    [void],
    "nonpayable"
  >;

  renounceRole: TypedContractMethod<
    [role: BytesLike, account: AddressLike],
    [void],
    "nonpayable"
  >;

  revokeRole: TypedContractMethod<
    [role: BytesLike, account: AddressLike],
    [void],
    "nonpayable"
  >;

  supportsInterface: TypedContractMethod<
    [interfaceId: BytesLike],
    [boolean],
    "view"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "DEFAULT_ADMIN_ROLE"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "UPGRADE_ADMIN_ROLE"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "addUpgradeAdmin"
  ): TypedContractMethod<[newAdmin: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "diamondCut"
  ): TypedContractMethod<
    [
      _facetCuts: IDiamondCut.FacetCutStruct[],
      _init: AddressLike,
      _calldata: BytesLike
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "getFacetAddress"
  ): TypedContractMethod<[selector: BytesLike], [string], "view">;
  getFunction(
    nameOrSignature: "getRoleAdmin"
  ): TypedContractMethod<[role: BytesLike], [string], "view">;
  getFunction(
    nameOrSignature: "grantRole"
  ): TypedContractMethod<
    [role: BytesLike, account: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "hasRole"
  ): TypedContractMethod<
    [role: BytesLike, account: AddressLike],
    [boolean],
    "view"
  >;
  getFunction(
    nameOrSignature: "removeUpgradeAdmin"
  ): TypedContractMethod<[admin: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "renounceRole"
  ): TypedContractMethod<
    [role: BytesLike, account: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "revokeRole"
  ): TypedContractMethod<
    [role: BytesLike, account: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "supportsInterface"
  ): TypedContractMethod<[interfaceId: BytesLike], [boolean], "view">;

  getEvent(
    key: "DiamondCut"
  ): TypedContractEvent<
    DiamondCutEvent.InputTuple,
    DiamondCutEvent.OutputTuple,
    DiamondCutEvent.OutputObject
  >;
  getEvent(
    key: "FacetRemoved"
  ): TypedContractEvent<
    FacetRemovedEvent.InputTuple,
    FacetRemovedEvent.OutputTuple,
    FacetRemovedEvent.OutputObject
  >;
  getEvent(
    key: "FacetUpdated"
  ): TypedContractEvent<
    FacetUpdatedEvent.InputTuple,
    FacetUpdatedEvent.OutputTuple,
    FacetUpdatedEvent.OutputObject
  >;
  getEvent(
    key: "RoleAdminChanged"
  ): TypedContractEvent<
    RoleAdminChangedEvent.InputTuple,
    RoleAdminChangedEvent.OutputTuple,
    RoleAdminChangedEvent.OutputObject
  >;
  getEvent(
    key: "RoleGranted"
  ): TypedContractEvent<
    RoleGrantedEvent.InputTuple,
    RoleGrantedEvent.OutputTuple,
    RoleGrantedEvent.OutputObject
  >;
  getEvent(
    key: "RoleRevoked"
  ): TypedContractEvent<
    RoleRevokedEvent.InputTuple,
    RoleRevokedEvent.OutputTuple,
    RoleRevokedEvent.OutputObject
  >;

  filters: {
    "DiamondCut(tuple[],address,bytes)": TypedContractEvent<
      DiamondCutEvent.InputTuple,
      DiamondCutEvent.OutputTuple,
      DiamondCutEvent.OutputObject
    >;
    DiamondCut: TypedContractEvent<
      DiamondCutEvent.InputTuple,
      DiamondCutEvent.OutputTuple,
      DiamondCutEvent.OutputObject
    >;

    "FacetRemoved(bytes4)": TypedContractEvent<
      FacetRemovedEvent.InputTuple,
      FacetRemovedEvent.OutputTuple,
      FacetRemovedEvent.OutputObject
    >;
    FacetRemoved: TypedContractEvent<
      FacetRemovedEvent.InputTuple,
      FacetRemovedEvent.OutputTuple,
      FacetRemovedEvent.OutputObject
    >;

    "FacetUpdated(address,bytes4)": TypedContractEvent<
      FacetUpdatedEvent.InputTuple,
      FacetUpdatedEvent.OutputTuple,
      FacetUpdatedEvent.OutputObject
    >;
    FacetUpdated: TypedContractEvent<
      FacetUpdatedEvent.InputTuple,
      FacetUpdatedEvent.OutputTuple,
      FacetUpdatedEvent.OutputObject
    >;

    "RoleAdminChanged(bytes32,bytes32,bytes32)": TypedContractEvent<
      RoleAdminChangedEvent.InputTuple,
      RoleAdminChangedEvent.OutputTuple,
      RoleAdminChangedEvent.OutputObject
    >;
    RoleAdminChanged: TypedContractEvent<
      RoleAdminChangedEvent.InputTuple,
      RoleAdminChangedEvent.OutputTuple,
      RoleAdminChangedEvent.OutputObject
    >;

    "RoleGranted(bytes32,address,address)": TypedContractEvent<
      RoleGrantedEvent.InputTuple,
      RoleGrantedEvent.OutputTuple,
      RoleGrantedEvent.OutputObject
    >;
    RoleGranted: TypedContractEvent<
      RoleGrantedEvent.InputTuple,
      RoleGrantedEvent.OutputTuple,
      RoleGrantedEvent.OutputObject
    >;

    "RoleRevoked(bytes32,address,address)": TypedContractEvent<
      RoleRevokedEvent.InputTuple,
      RoleRevokedEvent.OutputTuple,
      RoleRevokedEvent.OutputObject
    >;
    RoleRevoked: TypedContractEvent<
      RoleRevokedEvent.InputTuple,
      RoleRevokedEvent.OutputTuple,
      RoleRevokedEvent.OutputObject
    >;
  };
}

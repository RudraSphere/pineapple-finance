/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../common";
import type {
  DiamondCutFacet,
  DiamondCutFacetInterface,
} from "../../contracts/DiamondCutFacet";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_initializationContractAddress",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "_calldata",
        type: "bytes",
      },
    ],
    name: "InitializationFunctionReverted",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "facetAddress",
            type: "address",
          },
          {
            internalType: "enum IDiamondCut.FacetCutAction",
            name: "action",
            type: "uint8",
          },
          {
            internalType: "bytes4[]",
            name: "functionSelectors",
            type: "bytes4[]",
          },
        ],
        indexed: false,
        internalType: "struct IDiamondCut.FacetCut[]",
        name: "_facetCuts",
        type: "tuple[]",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_init",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "_calldata",
        type: "bytes",
      },
    ],
    name: "DiamondCut",
    type: "event",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "facetAddress",
            type: "address",
          },
          {
            internalType: "enum IDiamondCut.FacetCutAction",
            name: "action",
            type: "uint8",
          },
          {
            internalType: "bytes4[]",
            name: "functionSelectors",
            type: "bytes4[]",
          },
        ],
        internalType: "struct IDiamondCut.FacetCut[]",
        name: "_diamondCut",
        type: "tuple[]",
      },
      {
        internalType: "address",
        name: "_init",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "_calldata",
        type: "bytes",
      },
    ],
    name: "diamondCut",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_newSwapper",
        type: "address",
      },
    ],
    name: "updateSwapper",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b5061124e806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80631f931c1c1461003b578063d3033c3914610050575b600080fd5b61004e610049366004610d26565b610063565b005b61004e61005e366004610dd8565b61027d565b61006b61039e565b7fc8fcad8db84d3cc18b4c41d551ea0ee66dd599cde068d998e57d5e09332c131e546000805160206111858339815191529061ffff8116908190600090600716156100c85750600381901c60009081526001840160205260409020545b60005b888110156101b5576101a883838c8c858181106100ea576100ea610dfa565b90506020028101906100fc9190610e10565b61010a906020810190610dd8565b8d8d8681811061011c5761011c610dfa565b905060200281019061012e9190610e10565b61013f906040810190602001610e3f565b8e8e8781811061015157610151610dfa565b90506020028101906101639190610e10565b610171906040810190610e5a565b8080602002602001604051908101604052809392919081815260200183836020028082843760009201919091525061041592505050565b90935091506001016100cb565b508282146101d15760028401805461ffff191661ffff84161790555b60078216156101f357600382901c600090815260018501602052604090208190555b7f8faa70878671ccd212d20771b795c50af8fd3ff6cf27f4bde57e5d4de0aeb673898989898960405161022a959493929190610f33565b60405180910390a16102728787878080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250610bd492505050565b505050505050505050565b61028561039e565b6001600160a01b0381166102e05760405162461bcd60e51b815260206004820152601760248201527f496e76616c69642073776170706572206164647265737300000000000000000060448201526064015b60405180910390fd5b7fc8fcad8db84d3cc18b4c41d551ea0ee66dd599cde068d998e57d5e09332c132154600080516020611185833981519152906001600160a01b038381169116141561037b5760405162461bcd60e51b815260206004820152602560248201527f4e657720737761707065722061646472657373206d7573742062652064696666604482015264195c995b9d60da1b60648201526084016102d7565b60050180546001600160a01b0319166001600160a01b0392909216919091179055565b600080516020611185833981519152600401546001600160a01b031633146104135760405162461bcd60e51b815260206004820152602260248201527f4c69624469616d6f6e643a204d75737420626520636f6e7472616374206f776e60448201526132b960f11b60648201526084016102d7565b565b600080806000805160206111858339815191529050600084511161048f5760405162461bcd60e51b815260206004820152602b60248201527f4c69624469616d6f6e644375743a204e6f2073656c6563746f727320696e206660448201526a1858d95d081d1bc818dd5d60aa1b60648201526084016102d7565b60008560028111156104a3576104a3610ea4565b141561060a576104cb866040518060600160405280602481526020016111a560249139610ca0565b60005b84518110156106045760008582815181106104eb576104eb610dfa565b6020908102919091018101516001600160e01b03198116600090815291859052604090912054909150606081901c156105845760405162461bcd60e51b815260206004820152603560248201527f4c69624469616d6f6e644375743a2043616e2774206164642066756e6374696f6044820152746e207468617420616c72656164792065786973747360581b60648201526084016102d7565b6001600160e01b031980831660008181526020879052604090206001600160601b031960608d901b168e17905560e060058e901b811692831c199c909c1690821c179a8114156105e85760038c901c600090815260018601602052604081209b909b555b8b6105f281611072565b9c5050600190930192506104ce915050565b50610bc8565b600185600281111561061e5761061e610ea4565b141561084657610646866040518060600160405280602881526020016111f160289139610ca0565b60005b845181101561060457600085828151811061066657610666610dfa565b6020908102919091018101516001600160e01b03198116600090815291859052604090912054909150606081901c308114156106fc5760405162461bcd60e51b815260206004820152602f60248201527f4c69624469616d6f6e644375743a2043616e2774207265706c61636520696d6d60448201526e3aba30b1363290333ab731ba34b7b760891b60648201526084016102d7565b896001600160a01b0316816001600160a01b031614156107845760405162461bcd60e51b815260206004820152603860248201527f4c69624469616d6f6e644375743a2043616e2774207265706c6163652066756e60448201527f6374696f6e20776974682073616d652066756e6374696f6e000000000000000060648201526084016102d7565b6001600160a01b0381166108005760405162461bcd60e51b815260206004820152603860248201527f4c69624469616d6f6e644375743a2043616e2774207265706c6163652066756e60448201527f6374696f6e207468617420646f65736e2774206578697374000000000000000060648201526084016102d7565b506001600160e01b031990911660009081526020849052604090206bffffffffffffffffffffffff919091166001600160601b031960608a901b16179055600101610649565b600285600281111561085a5761085a610ea4565b1415610b70576001600160a01b038616156108d65760405162461bcd60e51b815260206004820152603660248201527f4c69624469616d6f6e644375743a2052656d6f76652066616365742061646472604482015275657373206d757374206265206164647265737328302960501b60648201526084016102d7565b600388901c6007891660005b8651811015610b50578961091a57826108fa8161108d565b60008181526001870160205260409020549b509350600792506109289050565b816109248161108d565b9250505b6000806000808a858151811061094057610940610dfa565b6020908102919091018101516001600160e01b031981166000908152918a9052604090912054909150606081901c6109e05760405162461bcd60e51b815260206004820152603760248201527f4c69624469616d6f6e644375743a2043616e27742072656d6f76652066756e6360448201527f74696f6e207468617420646f65736e277420657869737400000000000000000060648201526084016102d7565b606081901c301415610a4b5760405162461bcd60e51b815260206004820152602e60248201527f4c69624469616d6f6e644375743a2043616e27742072656d6f766520696d6d7560448201526d3a30b1363290333ab731ba34b7b760911b60648201526084016102d7565b600587901b8f901b94506001600160e01b031980861690831614610aa1576001600160e01b03198516600090815260208a90526040902080546001600160601b0319166bffffffffffffffffffffffff83161790555b6001600160e01b031991909116600090815260208990526040812055600381901c611fff16925060051b60e0169050858214610b06576000828152600188016020526040902080546001600160e01b031980841c19909116908516831c179055610b2a565b80836001600160e01b031916901c816001600160e01b031960001b901c198e16179c505b84610b4557600086815260018801602052604081208190559c505b5050506001016108e2565b5080610b5d8360086110a4565b610b6791906110c3565b99505050610bc8565b60405162461bcd60e51b815260206004820152602760248201527f4c69624469616d6f6e644375743a20496e636f727265637420466163657443756044820152663a20b1ba34b7b760c91b60648201526084016102d7565b50959694955050505050565b6001600160a01b038216610be6575050565b610c08826040518060600160405280602881526020016111c960289139610ca0565b600080836001600160a01b031683604051610c239190611107565b600060405180830381855af49150503d8060008114610c5e576040519150601f19603f3d011682016040523d82523d6000602084013e610c63565b606091505b509150915081610c9a57805115610c7d5780518082602001fd5b838360405163192105d760e01b81526004016102d7929190611145565b50505050565b813b8181610c9a5760405162461bcd60e51b81526004016102d79190611171565b80356001600160a01b0381168114610cd857600080fd5b919050565b60008083601f840112610cef57600080fd5b50813567ffffffffffffffff811115610d0757600080fd5b602083019150836020828501011115610d1f57600080fd5b9250929050565b600080600080600060608688031215610d3e57600080fd5b853567ffffffffffffffff80821115610d5657600080fd5b818801915088601f830112610d6a57600080fd5b813581811115610d7957600080fd5b8960208260051b8501011115610d8e57600080fd5b60208301975080965050610da460208901610cc1565b94506040880135915080821115610dba57600080fd5b50610dc788828901610cdd565b969995985093965092949392505050565b600060208284031215610dea57600080fd5b610df382610cc1565b9392505050565b634e487b7160e01b600052603260045260246000fd5b60008235605e19833603018112610e2657600080fd5b9190910192915050565b803560038110610cd857600080fd5b600060208284031215610e5157600080fd5b610df382610e30565b6000808335601e19843603018112610e7157600080fd5b83018035915067ffffffffffffffff821115610e8c57600080fd5b6020019150600581901b3603821315610d1f57600080fd5b634e487b7160e01b600052602160045260246000fd5b818352600060208085019450826000805b86811015610efe5782356001600160e01b03198116808214610eeb578384fd5b8952509683019691830191600101610ecb565b50959695505050505050565b81835281816020850137506000828201602090810191909152601f909101601f19169091010190565b6060808252818101869052600090600560808085019089831b8601018a855b8b81101561102957878303607f190184528135368e9003605e19018112610f7857600080fd5b8d016001600160a01b03610f8b82610cc1565b1684526020610f9b818301610e30565b60038110610fb957634e487b7160e01b600052602160045260246000fd5b8582015260408281013536849003601e19018112610fd657600080fd5b8301803567ffffffffffffffff811115610fef57600080fd5b808a1b360385131561100057600080fd5b8a838901526110148b890182868501610eba565b98840198975050509301925050600101610f52565b50506001600160a01b0389166020870152858103604087015261104d81888a610f0a565b9b9a5050505050505050505050565b634e487b7160e01b600052601160045260246000fd5b60006000198214156110865761108661105c565b5060010190565b60008161109c5761109c61105c565b506000190190565b60008160001904831182151516156110be576110be61105c565b500290565b600082198211156110d6576110d661105c565b500190565b60005b838110156110f65781810151838201526020016110de565b83811115610c9a5750506000910152565b60008251610e268184602087016110db565b600081518084526111318160208601602086016110db565b601f01601f19169290920160200192915050565b6001600160a01b038316815260406020820181905260009061116990830184611119565b949350505050565b602081526000610df3602083018461111956fec8fcad8db84d3cc18b4c41d551ea0ee66dd599cde068d998e57d5e09332c131c4c69624469616d6f6e644375743a2041646420666163657420686173206e6f20636f64654c69624469616d6f6e644375743a205f696e6974206164647265737320686173206e6f20636f64654c69624469616d6f6e644375743a205265706c61636520666163657420686173206e6f20636f6465a26469706673582212200e62f372b5578e8aa9aa583b86c879eff4df770f6bfdce348380ea6490c3e21c64736f6c634300080a0033";

type DiamondCutFacetConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: DiamondCutFacetConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class DiamondCutFacet__factory extends ContractFactory {
  constructor(...args: DiamondCutFacetConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      DiamondCutFacet & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): DiamondCutFacet__factory {
    return super.connect(runner) as DiamondCutFacet__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DiamondCutFacetInterface {
    return new Interface(_abi) as DiamondCutFacetInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): DiamondCutFacet {
    return new Contract(address, _abi, runner) as unknown as DiamondCutFacet;
  }
}

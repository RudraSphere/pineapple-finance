/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type {
  Signer,
  AddressLike,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type {
  MultiBatchSwapFacet,
  MultiBatchSwapFacetInterface,
} from "../../../contracts/facets/MultiBatchSwapFacet";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_uniswapRouter",
        type: "address",
      },
      {
        internalType: "address",
        name: "_uniswapFactory",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "collector",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "feeAmount",
        type: "uint256",
      },
    ],
    name: "FeesCollected",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "fromToken",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "toToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "inputAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "outputAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "gasCost",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "slippage",
        type: "uint256",
      },
    ],
    name: "TokensSwapped",
    type: "event",
  },
  {
    inputs: [],
    name: "BPS_DIVISOR",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "fromToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "toToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
    ],
    name: "batchSwapToSingleToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "inputTokens",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "inputAmounts",
        type: "uint256[]",
      },
      {
        internalType: "address",
        name: "outputToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "slippageTolerance",
        type: "uint256",
      },
    ],
    name: "batchSwapsToSingleToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "fromToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "toToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "inputAmount",
        type: "uint256",
      },
    ],
    name: "estimateSwapOutput",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "feeBasisPoints",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
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
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "newFeeBPS",
        type: "uint256",
      },
    ],
    name: "setFeeBasisPoints",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "uniswapFactory",
    outputs: [
      {
        internalType: "contract IUniswapV2Factory",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "uniswapRouter",
    outputs: [
      {
        internalType: "contract IUniswapV2Router",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60c060405260fa6002553480156200001657600080fd5b5060405162001c8538038062001c85833981016040819052620000399162000184565b6001600055620000493362000115565b6001600160a01b038216620000a55760405162461bcd60e51b815260206004820152601960248201527f4552523a3a5a45524f5f414444524553533a3a524f555445520000000000000060448201526064015b60405180910390fd5b6001600160a01b038116620000fd5760405162461bcd60e51b815260206004820152601a60248201527f4552523a3a5a45524f5f414444524553533a3a464143544f525900000000000060448201526064016200009c565b6001600160a01b039182166080521660a052620001bc565b600180546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b80516001600160a01b03811681146200017f57600080fd5b919050565b600080604083850312156200019857600080fd5b620001a38362000167565b9150620001b36020840162000167565b90509250929050565b60805160a051611a72620002136000396000818161015e015281816107b60152610e8401526000818161011f015281816104610152818161055d015281816106b70152818161076701526108ea0152611a726000f3fe608060405234801561001057600080fd5b50600436106100a95760003560e01c8063735de9f711610071578063735de9f71461011a5780638bdb2afa146101595780638da5cb5b14610180578063b8606eef14610191578063c22d02631461019a578063f2fde38b146101ad57600080fd5b80630165dd27146100ae578063191fe1ed146100c357806353c7cdf7146100df578063550fce20146100f2578063715018a614610112575b600080fd5b6100c16100bc366004611425565b6101c0565b005b6100cc61271081565b6040519081526020015b60405180910390f35b6100c16100ed366004611539565b61021b565b610105610100366004611624565b61068f565b6040516100d69190611665565b6100c161073c565b6101417f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b0390911681526020016100d6565b6101417f000000000000000000000000000000000000000000000000000000000000000081565b6001546001600160a01b0316610141565b6100cc60025481565b6100c16101a83660046116a9565b610750565b6100c16101bb3660046116fc565b610a10565b6101c8610a89565b6127108111156102165760405162461bcd60e51b81526020600482015260146024820152734552523a3a494e56414c49445f4645455f42505360601b60448201526064015b60405180910390fd5b600255565b610223610ae3565b835185511461026d5760405162461bcd60e51b8152602060048201526016602482015275092dce0eae840d8cadccee8d0e640dad2e6dac2e8c6d60531b604482015260640161020d565b60005b855181101561067d576102c5604051806040016040528060118152602001705377617070696e6720746f6b656e20257360781b8152508783815181106102b8576102b8611720565b6020026020010151610b3d565b61030960405180604001604052806009815260200168416d6f756e7420257360b81b8152508683815181106102fc576102fc611720565b6020026020010151610b86565b600086828151811061031d5761031d611720565b60200260200101519050600086838151811061033b5761033b611720565b6020908102919091010151905061035d6001600160a01b038316333084610bcb565b61038d6040518060400160405280600e81526020016d5472616e7366657272656420257360901b81525082610b86565b6000612710600254836103a0919061174c565b6103aa919061176b565b905060006103b8828461178d565b90506103e96040518060400160405280600d81526020016c46656520616d6f756e7420257360981b81525083610b86565b6104196040518060400160405280600e81526020016d5377617020616d6f756e7420257360901b81525082610b86565b6104238483610c36565b6104526040518060400160405280600e81526020016d1199595cc818dbdb1b1958dd195960921b815250610cb8565b6104866001600160a01b0385167f000000000000000000000000000000000000000000000000000000000000000083610cfb565b60408051600280825260608201835260009260208301908036833701905050905084816000815181106104bb576104bb611720565b60200260200101906001600160a01b031690816001600160a01b03168152505088816001815181106104ef576104ef611720565b60200260200101906001600160a01b031690816001600160a01b031681525050610543604051806040016040528060118152602001705377617070696e6720257320746f20257360781b815250868b610e10565b6040516338ed173960e01b81526000906001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016906338ed17399061059a908690859087908f9042906004016117e8565b6000604051808303816000875af11580156105b9573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526105e19190810190611824565b9050896001600160a01b0316866001600160a01b0316336001600160a01b03167f9b0a249a3c195624de19de7ff6dee954b9ff72e8503f8e5164c74d462235bcde868560018151811061063657610636611720565b60209081029190910181015160408051938452918301523a90820152606081018d905260800160405180910390a45050505050508080610675906118aa565b915050610270565b506106886001600055565b5050505050565b6060600061069d8585610e57565b60405163d06ca61f60e01b81529091506001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000169063d06ca61f906106ee90869085906004016118c5565b600060405180830381865afa15801561070b573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526107339190810190611824565b95945050505050565b610744610a89565b61074e600061103b565b565b610758610ae3565b61078c6001600160a01b0385167f000000000000000000000000000000000000000000000000000000000000000084610cfb565b60405163e6a4390560e01b81526001600160a01b03858116600483015284811660248301526000917f00000000000000000000000000000000000000000000000000000000000000009091169063e6a4390590604401602060405180830381865afa1580156107ff573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061082391906118de565b905060606001600160a01b038216156108c3576040805160028082526060820183529091602083019080368337019050509050858160008151811061086a5761086a611720565b60200260200101906001600160a01b031690816001600160a01b031681525050848160018151811061089e5761089e611720565b60200260200101906001600160a01b031690816001600160a01b0316815250506108d0565b6108cd868661108d565b90505b6040516338ed173960e01b81526000906001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016906338ed173990610927908890859087908a9042906004016117e8565b6000604051808303816000875af1158015610946573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405261096e9190810190611824565b9050856001600160a01b0316876001600160a01b0316336001600160a01b03167f9b0a249a3c195624de19de7ff6dee954b9ff72e8503f8e5164c74d462235bcde8885600187516109bf919061178d565b815181106109cf576109cf611720565b60209081029190910181015160408051938452918301523a908201526000606082015260800160405180910390a4505050610a0a6001600055565b50505050565b610a18610a89565b6001600160a01b038116610a7d5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b606482015260840161020d565b610a868161103b565b50565b6001546001600160a01b0316331461074e5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015260640161020d565b60026000541415610b365760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c00604482015260640161020d565b6002600055565b610b828282604051602401610b53929190611953565b60408051601f198184030181529190526020810180516001600160e01b031663319af33360e01b179052611169565b5050565b610b828282604051602401610b9c92919061197d565b60408051601f198184030181529190526020810180516001600160e01b0316632d839cb360e21b179052611169565b6040516001600160a01b0380851660248301528316604482015260648101829052610a0a9085906323b872dd60e01b906084015b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b031990931692909217909152611172565b6000610c4a6001546001600160a01b031690565b90506001600160a01b03811615610cb357610c6f6001600160a01b0384168284611247565b806001600160a01b03167f9dc46f23cfb5ddcad0ae7ea2be38d47fec07bb9382ec7e564efc69e036dd66ce83604051610caa91815260200190565b60405180910390a25b505050565b610a8681604051602401610ccc919061199f565b60408051601f198184030181529190526020810180516001600160e01b031663104c13eb60e21b179052611169565b801580610d755750604051636eb1769f60e11b81523060048201526001600160a01b03838116602483015284169063dd62ed3e90604401602060405180830381865afa158015610d4f573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d7391906119b2565b155b610de05760405162461bcd60e51b815260206004820152603660248201527f5361666545524332303a20617070726f76652066726f6d206e6f6e2d7a65726f60448201527520746f206e6f6e2d7a65726f20616c6c6f77616e636560501b606482015260840161020d565b6040516001600160a01b038316602482015260448101829052610cb390849063095ea7b360e01b90606401610bff565b610cb3838383604051602401610e28939291906119cb565b60408051601f198184030181529190526020810180516001600160e01b03166307e763af60e51b179052611169565b60405163e6a4390560e01b81526001600160a01b03838116600483015282811660248301526060916000917f0000000000000000000000000000000000000000000000000000000000000000169063e6a4390590604401602060405180830381865afa158015610ecb573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610eef91906118de565b90506001600160a01b03811615610f8a576040805160028082526060820183526000926020830190803683370190505090508481600081518110610f3557610f35611720565b60200260200101906001600160a01b031690816001600160a01b0316815250508381600181518110610f6957610f69611720565b6001600160a01b039092166020928302919091019091015291506110359050565b60408051600380825260808201909252600091602082016060803683370190505090508481600081518110610fc157610fc1611720565b6001600160a01b0390921660209283029190910190910152733c499c542cef5e3811e1192ce70d8cc03d5c33598160018151811061100157611001611720565b60200260200101906001600160a01b031690816001600160a01b0316815250508381600281518110610f6957610f69611720565b92915050565b600180546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b60408051600380825260808201909252606091600091906020820184803683370190505090506000733c499c542cef5e3811e1192ce70d8cc03d5c3359905084826000815181106110e0576110e0611720565b60200260200101906001600160a01b031690816001600160a01b031681525050808260018151811061111457611114611720565b60200260200101906001600160a01b031690816001600160a01b031681525050838260028151811061114857611148611720565b6001600160a01b039092166020928302919091019091015250905092915050565b610a8681611277565b60006111c7826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b03166112989092919063ffffffff16565b90508051600014806111e85750808060200190518101906111e891906119fe565b610cb35760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b606482015260840161020d565b6040516001600160a01b038316602482015260448101829052610cb390849063a9059cbb60e01b90606401610bff565b60006a636f6e736f6c652e6c6f679050600080835160208501845afa505050565b60606112a784846000856112af565b949350505050565b6060824710156113105760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6044820152651c8818d85b1b60d21b606482015260840161020d565b600080866001600160a01b0316858760405161132c9190611a20565b60006040518083038185875af1925050503d8060008114611369576040519150601f19603f3d011682016040523d82523d6000602084013e61136e565b606091505b509150915061137f8783838761138a565b979650505050505050565b606083156113f65782516113ef576001600160a01b0385163b6113ef5760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e7472616374000000604482015260640161020d565b50816112a7565b6112a7838381511561140b5781518083602001fd5b8060405162461bcd60e51b815260040161020d919061199f565b60006020828403121561143757600080fd5b5035919050565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f1916810167ffffffffffffffff8111828210171561147d5761147d61143e565b604052919050565b600067ffffffffffffffff82111561149f5761149f61143e565b5060051b60200190565b6001600160a01b0381168114610a8657600080fd5b80356114c9816114a9565b919050565b600082601f8301126114df57600080fd5b813560206114f46114ef83611485565b611454565b82815260059290921b8401810191818101908684111561151357600080fd5b8286015b8481101561152e5780358352918301918301611517565b509695505050505050565b600080600080600060a0868803121561155157600080fd5b853567ffffffffffffffff8082111561156957600080fd5b818801915088601f83011261157d57600080fd5b8135602061158d6114ef83611485565b82815260059290921b8401810191818101908c8411156115ac57600080fd5b948201945b838610156115d35785356115c4816114a9565b825294820194908201906115b1565b995050890135925050808211156115e957600080fd5b506115f6888289016114ce565b945050611605604087016114be565b9250611613606087016114be565b949793965091946080013592915050565b60008060006060848603121561163957600080fd5b8335611644816114a9565b92506020840135611654816114a9565b929592945050506040919091013590565b6020808252825182820181905260009190848201906040850190845b8181101561169d57835183529284019291840191600101611681565b50909695505050505050565b600080600080608085870312156116bf57600080fd5b84356116ca816114a9565b935060208501356116da816114a9565b92506040850135915060608501356116f1816114a9565b939692955090935050565b60006020828403121561170e57600080fd5b8135611719816114a9565b9392505050565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b600081600019048311821515161561176657611766611736565b500290565b60008261178857634e487b7160e01b600052601260045260246000fd5b500490565b60008282101561179f5761179f611736565b500390565b600081518084526020808501945080840160005b838110156117dd5781516001600160a01b0316875295820195908201906001016117b8565b509495945050505050565b85815284602082015260a06040820152600061180760a08301866117a4565b6001600160a01b0394909416606083015250608001529392505050565b6000602080838503121561183757600080fd5b825167ffffffffffffffff81111561184e57600080fd5b8301601f8101851361185f57600080fd5b805161186d6114ef82611485565b81815260059190911b8201830190838101908783111561188c57600080fd5b928401925b8284101561137f57835182529284019290840190611891565b60006000198214156118be576118be611736565b5060010190565b8281526040602082015260006112a760408301846117a4565b6000602082840312156118f057600080fd5b8151611719816114a9565b60005b838110156119165781810151838201526020016118fe565b83811115610a0a5750506000910152565b6000815180845261193f8160208601602086016118fb565b601f01601f19169290920160200192915050565b6040815260006119666040830185611927565b905060018060a01b03831660208301529392505050565b6040815260006119906040830185611927565b90508260208301529392505050565b6020815260006117196020830184611927565b6000602082840312156119c457600080fd5b5051919050565b6060815260006119de6060830186611927565b6001600160a01b0394851660208401529290931660409091015292915050565b600060208284031215611a1057600080fd5b8151801515811461171957600080fd5b60008251611a328184602087016118fb565b919091019291505056fea26469706673582212204f1917774243bb5048b4b39315a7f49a7d7ebd46e74c3ca85fc3c48d2080496a64736f6c634300080a0033";

type MultiBatchSwapFacetConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MultiBatchSwapFacetConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MultiBatchSwapFacet__factory extends ContractFactory {
  constructor(...args: MultiBatchSwapFacetConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    _uniswapRouter: AddressLike,
    _uniswapFactory: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(
      _uniswapRouter,
      _uniswapFactory,
      overrides || {}
    );
  }
  override deploy(
    _uniswapRouter: AddressLike,
    _uniswapFactory: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(
      _uniswapRouter,
      _uniswapFactory,
      overrides || {}
    ) as Promise<
      MultiBatchSwapFacet & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(
    runner: ContractRunner | null
  ): MultiBatchSwapFacet__factory {
    return super.connect(runner) as MultiBatchSwapFacet__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MultiBatchSwapFacetInterface {
    return new Interface(_abi) as MultiBatchSwapFacetInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): MultiBatchSwapFacet {
    return new Contract(
      address,
      _abi,
      runner
    ) as unknown as MultiBatchSwapFacet;
  }
}

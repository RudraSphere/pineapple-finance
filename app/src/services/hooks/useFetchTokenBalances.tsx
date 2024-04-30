// tslint:disable
import { useAccount, useReadContracts } from 'wagmi'
import { erc20 } from '../../../typechain-types/factories/@openzeppelin/contracts/token'
import { config } from '../Web3Provider'

const contracts = [
  {
    addressOrName: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
    contractInterface: erc20,
    functionName: 'balanceOf',
  },
]

function useTokenBalances() {
  const account = useAccount()
  const res = useReadContracts({
    config: config,
    batchSize: 20,
    // @ts-expect-error
    contracts: contracts.map(c => {
      return {
        ...c,
        args: [account.address],
      }
    }),
  })

  console.log('@res', res)
  return { res }
}

export default useTokenBalances

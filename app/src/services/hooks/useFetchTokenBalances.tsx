import { useContractReads } from 'wagmi'
import erc20ABI from '../../../abis/erc20.json'

const tokenAddresses = ['0xAddress1', '0xAddress2', '0xAddress3']

export function useTokenBalances(account: string) {
  const { data, isError, isLoading } = useContractReads({
    contracts: tokenAddresses?.map(address => ({
      addressOrName: address,
      contractInterface: erc20ABI,
      functionName: 'balanceOf',
      args: [account],
    })),
  })

  // Assuming data returns an array of balances
  const balances = data ? data.map(balance => balance.toString()) : []

  return {
    balances,
    isError,
    isLoading,
  }
}

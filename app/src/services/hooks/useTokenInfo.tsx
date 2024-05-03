import { tokenList } from '@/utils/tokens'
import { useEffect, useState } from 'react'
import { erc20Abi } from 'viem'
import { polygon } from 'viem/chains'
import { useAccount, useReadContracts } from 'wagmi'

interface TokenInfo {
  balance: string
  status: string
  symbol: string
  address: string
  decimals: number
}

const useTokenInfo = () => {
  const { address: userAddress } = useAccount()
  const [tokensInfo, setTokensInfo] = useState<{ [name: string]: TokenInfo }>({})

  const _contract = tokenList?.map(token => {
    return {
      name: token.symbol,
      address: token.address as any,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [userAddress],
    }
  })

  // @ts-ignore
  const { data, refetch } = useReadContracts({
    contracts: _contract,
    batchSize: 100,
    multicallAddress: polygon.contracts.multicall3.address,
  })

  useEffect(() => {
    if (data?.length) {
      const _tokensInfo = data.reduce((acc, cur, idx) => {
        console.log(cur.result, cur.status)
        acc[tokenList[idx].symbol] = {
          balance: cur.result,
          status: cur.status,
          address: tokenList[idx].address,
          symbol: tokenList[idx].symbol,
          decimals: tokenList[idx].decimals,
        }
        return acc
      }, {})
      console.log(_tokensInfo)

      setTokensInfo(_tokensInfo)
    }
  }, [data])

  return { tokensInfo, refetch }
}

export default useTokenInfo

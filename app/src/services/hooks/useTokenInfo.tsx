import { tokenList } from '@/utils/tokens'
import { useEffect, useState } from 'react'
import { erc20Abi } from 'viem'
import { polygon } from 'viem/chains'
import { useAccount, useReadContracts } from 'wagmi'

interface TokenInfo {
  balance: string
  status: string
  symbol: string
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

  // @ts-expect-error
  const _res = useReadContracts({
    contracts: _contract,
    batchSize: 100,
    multicallAddress: polygon.contracts.multicall3.address,
  })

  useEffect(() => {
    if (_res?.data?.length) {
      const _tokensInfo = _res.data.reduce((acc, cur, idx) => {
        console.log(cur.result, cur.status)
        acc[tokenList[idx].symbol] = {
          balance: cur.result,
          status: cur.status,
          symbol: tokenList[idx].symbol,
          decimals: tokenList[idx].decimals,
        }
        return acc
      }, {})
      console.log(_tokensInfo)

      setTokensInfo(_tokensInfo)
    }
  }, [_res?.data])

  return { tokensInfo }
}

export default useTokenInfo

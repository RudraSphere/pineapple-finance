import { BigNumber } from 'ethers'
import { useCallback, useState } from 'react'
import { erc20Abi } from 'viem'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'

function useManageAllowance(token, spender) {
  const { address: userAddress } = useAccount()
  const { data: allowance } = useReadContract({
    abi: erc20Abi,
    address: token,
    functionName: 'allowance',
    args: [userAddress as any, spender as any],
  })

  const wContract = useWriteContract()
  const [isApproving, setIsApproving] = useState(false)

  const ensureAllowance = useCallback(
    async amountNeeded => {
      console.log('allowance:', allowance.toString())
      if (!allowance || BigNumber.from(allowance).gte(amountNeeded)) return true

      setIsApproving(true)
      try {
        console.log('Approving:', amountNeeded.toString())
        await wContract.writeContractAsync({
          abi: erc20Abi,
          address: token,
          functionName: 'approve',
          args: [spender, amountNeeded],
        })
        setIsApproving(false)
        return true
      } catch (error) {
        console.error('Approval error:', error)
        setIsApproving(false)
        return false
      }
    },
    [allowance, spender, token, wContract]
  )

  return { allowance, ensureAllowance, isApproving }
}

export default useManageAllowance

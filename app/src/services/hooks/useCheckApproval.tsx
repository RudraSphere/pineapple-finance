import { erc20Abi } from 'viem'
import { useReadContract } from 'wagmi'

interface CheckApprovalProps {
  token: string
  from: string
  to: string
}

const useCheckApproval = ({ token, from, to }: CheckApprovalProps) => {
  const { data, isLoading, refetch } = useReadContract({
    abi: erc20Abi,
    address: token as any,
    functionName: 'allowance',
    args: [from as any, to as any],
  })

  return { data, isLoading, refetch }
}

export default useCheckApproval

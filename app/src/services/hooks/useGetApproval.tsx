import { erc20Abi } from 'viem'
import { useWriteContract } from 'wagmi'

interface CheckApprovalProps {
  token: string
  from: string
  to: string
}

const useGetApproval = ({ token, from, to }: CheckApprovalProps) => {
  const wContract = useWriteContract()

  wContract.writeContractAsync({
    abi: erc20Abi,
    address: token as any,
    functionName: 'allowance',
    args: [from as any, to as any],
  })
}

export default useGetApproval

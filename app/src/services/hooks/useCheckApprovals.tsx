import { erc20Abi } from 'viem'
import { useReadContracts } from 'wagmi'

interface CheckApprovalProps {
  token: string
  from: string
  to: string
}

const useCheckApprovals = (args: CheckApprovalProps[]) => {
  const { isLoading, data } = useReadContracts({
    // @ts-ignore
    contracts: args.map(({ token, from, to }) => ({
      address: token,
      abi: erc20Abi,
      functionName: 'allowance',
      args: [from, to],
    })),
  })
  const approvals = data?.map((value, index) => ({
    ...args[index],
    limit: value?.result?.toString() || '0',
  }))

  return { isLoading, approvals }
}

export default useCheckApprovals

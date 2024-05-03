'use client'

import { useEffect, useState } from 'react'
import { useAccount, useWriteContract } from 'wagmi'

import useCheckApproval from '@/services/hooks/useCheckApproval'
import useTokenInfo from '@/services/hooks/useTokenInfo'
import { cn } from '@/utils/common'
import { tokenList } from '@/utils/tokens'
import { BigNumber, ethers } from 'ethers'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { erc20Abi } from 'viem'
import { abi as DCAFacetAbi } from '../../../deployments/internalRPC/DCAFacet.json'
import { address as diamondAddress } from '../../../deployments/internalRPC/Diamond.json'

const DcaPage = () => {
  const { isConnected, address: userAddress } = useAccount()
  const { tokensInfo, refetch: refetchTokens } = useTokenInfo()
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      fromToken: '',
      toToken: '',
      totalAmount: '',
      interval: '',
      orderCount: '',
    },
  })

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const fromToken = watch('fromToken')
  const toTokenOptions = tokenList.filter(token => token.address !== fromToken)

  const selectedTokenInfo = Object.values(tokensInfo).find(token => token.address === fromToken)

  const wContract = useWriteContract()

  const {
    data: approval,
    isLoading: isLoadingApprovals,
    refetch: refetchApprovals,
  } = useCheckApproval({
    token: fromToken,
    from: userAddress,
    to: diamondAddress,
  })

  const handleNewDCA = async data => {
    setLoading(true)

    if (!selectedTokenInfo) {
      toast.error('Invalid token selected', {
        icon: '🚨',
      })
      setLoading(false)
      return
    }

    const { fromToken, toToken, totalAmount, interval, orderCount } = data

    const intervalInSeconds = parseInt(interval, 10) * 60
    const amountInWei = ethers.utils.parseUnits(totalAmount, selectedTokenInfo.decimals)

    console.log('submitting args', {
      fromToken,
      toToken,
      amountInWei,
      orderCount,
      intervalInSeconds,
    })

    try {
      // Approve token
      if (BigNumber.from(approval).lt(amountInWei)) {
        toast.success(`Approving ${selectedTokenInfo.symbol} for DCA`, {
          icon: '⌛️',
        })
        await wContract.writeContractAsync({
          abi: erc20Abi,
          address: fromToken,
          functionName: 'approve',
          args: [diamondAddress as any, amountInWei],
        })
      }

      toast.success(`Setting up DCA for ${selectedTokenInfo.symbol}.`, {
        icon: '💰',
      })
      await wContract.writeContractAsync({
        abi: DCAFacetAbi,
        address: diamondAddress,
        functionName: 'setupDCA',
        args: [fromToken, toToken, amountInWei, intervalInSeconds, orderCount],
      })
      toast.success(`DCA setup for ${selectedTokenInfo.symbol}.`, {
        icon: '✅',
      })
    } catch (error) {
      toast.error(`Failed to setup DCA for ${selectedTokenInfo.symbol}.`, {
        icon: '🚨',
      })
      console.error(error)
    }

    refetchTokens()
    refetchApprovals()
    setLoading(false)
  }

  useEffect(() => {
    if (!isConnected) return
    // Fetch existing orders
    // This might involve a call to a backend service or smart contract read function
    setLoading(true)
    // Simulate fetching data
    setTimeout(() => {
      setOrders([
        {
          id: 1,
          fromToken: 'ETH',
          toToken: 'DAI',
          amountPerInterval: '0.1',
          interval: '604800',
          ordersPlaced: 10,
        },
      ])
      setLoading(false)
    }, 1000)
  }, [isConnected])

  return (
    <div className='mx-auto my-4 max-w-lg rounded-lg bg-slate-800 p-5 text-white shadow-lg'>
      <h1 className='mb-4 text-3xl font-semibold'>Dollar Cost Averaging (DCA)</h1>
      <form onSubmit={handleSubmit(handleNewDCA)} className='space-y-4'>
        <div className='flex flex-row gap-2'>
          <div className='flex-1'>
            <label className='mb-2 block'>From Token:</label>
            <Controller
              name='fromToken'
              control={control}
              rules={{ required: 'From token is required' }}
              render={({ field }) => (
                <select
                  {...field}
                  className='border-1 border:bg-slate-800 mb-2 block w-full max-w-md rounded-lg border bg-slate-800 p-2 text-slate-200 shadow-md duration-200 hover:cursor-pointer hover:shadow-lg hover:shadow-slate-700'
                >
                  <option value=''>Select From Token</option>
                  {tokenList.map(token => (
                    <option key={token.address} value={token.address}>
                      {token.symbol}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.fromToken && (
              <p className='text-right text-red-500'>{errors.fromToken.message}</p>
            )}
          </div>
          <div className='flex-1'>
            <label className='mb-2 block'>To Token:</label>
            <Controller
              name='toToken'
              control={control}
              rules={{ required: 'To token is required' }}
              render={({ field }) => (
                <select
                  {...field}
                  className='border-1 border:bg-slate-800 mb-2 block w-full max-w-md rounded-lg border bg-slate-800 p-2 text-slate-200 shadow-md duration-200 hover:cursor-pointer hover:shadow-lg hover:shadow-slate-700'
                >
                  <option value=''>Select To Token</option>
                  {toTokenOptions.map(token => (
                    <option key={token.address} value={token.address}>
                      {token.symbol}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.toToken && <p className='text-right text-red-500'>{errors.toToken.message}</p>}
          </div>
        </div>
        <div>
          <label className='mb-2 block'>Total Amount:</label>
          <Controller
            name='totalAmount'
            control={control}
            rules={{
              required: 'Total amount is required',
              validate: value => {
                const isValidNumber = /^(\d+(\.\d+)?)$/.test(value)
                console.log('isValidNumber', isValidNumber, value)
                if (!isValidNumber) return 'Invalid amount 😕'

                return (
                  parseUnits(value || '0', selectedTokenInfo?.decimals).lte(
                    selectedTokenInfo?.balance || ethers.constants.Zero
                  ) || 'Amount exceeds balance or invalid'
                )
              },
            }}
            render={({ field }) => {
              return (
                <input
                  {...field}
                  className={cn(
                    `block w-full rounded border-0 bg-transparent p-2 text-right text-2xl outline-none`
                  )}
                  placeholder='Amount'
                />
              )
            }}
          />
          {selectedTokenInfo && (
            <span className='text-right text-slate-500'>
              Balance:{' '}
              {Number(
                formatUnits(BigInt(selectedTokenInfo?.balance || '0'), selectedTokenInfo?.decimals)
              )
                .toFixed(5)
                ?.toString() || 'Fetching...'}{' '}
              {selectedTokenInfo?.symbol || '...'}{' '}
            </span>
          )}
          {/* <span>
            Balance:{' '}
            {Number(
              formatUnits(BigInt(selectedTokenInfo?.balance || '0'), selectedTokenInfo?.decimals)
            )
              .toFixed(2)
              ?.toString() || 'Fetching...'}{' '}
            {selectedTokenInfo?.symbol || '...'}
          </span> */}
          {errors.totalAmount && (
            <p className='text-right text-red-500'>{errors.totalAmount.message}</p>
          )}
        </div>
        <div>
          <label className='mb-2 block'>Interval (seconds):</label>
          <input
            {...register('interval', {
              required: 'Interval is required',
              validate: value => /^\d+$/.test(value) && parseInt(value, 10) > 0,
            })}
            className={cn(
              `block w-full rounded border-0 bg-transparent p-2 text-right text-2xl outline-none`
            )}
            placeholder='Interval in minutes'
          />
          {errors.interval && <p className='text-right text-red-500'>{errors.interval.message}</p>}
        </div>
        <div>
          <label className='mb-2 block'>Order Count:</label>
          <input
            {...register('orderCount', {
              required: 'Order count is required',
              validate: value => /^\d+$/.test(value) && parseInt(value, 10) > 0,
            })}
            className={cn(
              `block w-full rounded border-0 bg-transparent p-2 text-right text-2xl outline-none`
            )}
            placeholder='Number of orders'
          />
          {errors.orderCount && (
            <p className='text-right text-red-500'>{errors.orderCount.message}</p>
          )}
        </div>
        <button
          type='submit'
          disabled={isSubmitting}
          className='mt-4 inline-flex w-full justify-center rounded-lg bg-teal-700 px-4 py-2 align-middle font-bold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50'
        >
          Setup DCA
        </button>
      </form>
    </div>
  )
}

export default DcaPage

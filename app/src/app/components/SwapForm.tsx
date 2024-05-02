'use client'

import Spinner from '@/elements/Spinner'
import useCheckApprovals from '@/services/hooks/useCheckApprovals'
import useTokenInfo from '@/services/hooks/useTokenInfo'
import useTokenPrice from '@/services/hooks/useTokenPrice'
import { cn, getTokenFromAddress } from '@/utils/common'
import { tokenList } from '@/utils/tokens'
import { ArrowsUpDownIcon, XCircleIcon } from '@heroicons/react/16/solid'
import { BigNumber, ethers } from 'ethers'
import { FC, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { erc20Abi, formatUnits } from 'viem'
import { useAccount, useWriteContract } from 'wagmi'
import { address as diamondAddress } from '../../../deployments/internalRPC/Diamond.json'
import { abi as MultiBatchSwapFacetAbi } from '../../../deployments/internalRPC/MultiBatchSwapFacet.json'

interface SwapFormInputs {
  tokens: { address: string; amount: string }[]
  targetToken: string
  recipient: string
}

const SwapForm: FC = () => {
  const { address: userAddress } = useAccount()
  const { tokensInfo, refetch: refetchTokens } = useTokenInfo()
  const [isLoading, setIsLoading] = useState(false)
  const wContract = useWriteContract()
  const [errorMessage, setErrorMessage] = useState('')
  const [currStatus, setCurrStatus] = useState('Batch Swap')
  const { fetchPrices, prices } = useTokenPrice()
  const [showRecipient, setShowRecipient] = useState(false)

  const { register, getValues, handleSubmit, control, reset, watch, setValue } =
    useForm<SwapFormInputs>({
      defaultValues: {
        tokens: [{ address: '', amount: '' }],
        targetToken: 'select',
        recipient: '',
      },
    })

  const {
    approvals,
    isLoading: isLoadingApprovals,
    refetch: refetchApprovals,
  } = useCheckApprovals(
    getValues('tokens')
      .filter(({ address }) => address)
      .map(({ address }) => {
        return {
          token: address,
          from: userAddress,
          to: diamondAddress,
        }
      })
  )

  const onSubmitHandler = async (data: SwapFormInputs) => {
    setIsLoading(true)
    setCurrStatus('Processing...')
    const { tokens, targetToken } = data
    const recipient = (showRecipient && data.recipient) || userAddress

    if (!data.tokens || data.tokens.length === 0) {
      setErrorMessage('At least one Input token is required.')
      return
    }

    if (
      data.tokens.some(
        token => !token.address || !token.amount || ethers.utils.parseUnits(token.amount, 18).lte(0)
      )
    ) {
      setErrorMessage('All tokens must have a valid address and amount greater than zero.')
      return
    }

    if (!data.targetToken || data.targetToken === 'select') {
      setErrorMessage('Target token is required.')
      return
    }

    setErrorMessage('')
    for (let token of tokens) {
      const tokenInfo = getTokenFromAddress(token.address)
      if (!tokenInfo) {
        setErrorMessage('Invalid token address.')
        return
      }

      const amountInWei = ethers.utils.parseUnits(token.amount, tokenInfo.decimals)

      for (let approval of approvals) {
        console.log('approval', approval.limit.toString(), amountInWei.toString())
        if (
          approval.token === token.address &&
          BigNumber.from(approval.limit || '0').lt(amountInWei)
        ) {
          setCurrStatus(`Approving ${tokenInfo.symbol}...`)
          toast.success(`Approving ${tokenInfo.symbol}...`, {
            icon: '⏳',
          })
          console.log(
            'Approval needed for',
            tokenInfo.symbol,
            amountInWei.toString(),
            approval.limit,
            token.amount,
            diamondAddress
          )
          await wContract.writeContractAsync({
            abi: erc20Abi,
            address: token.address as any,
            functionName: 'approve',
            args: [diamondAddress as any, amountInWei],
          })
          console.log('Approval done for', tokenInfo.symbol)
        }
      }
    }

    console.log('Swapping...', wContract)
    setCurrStatus('Swapping...')
    toast.success('Swapping...', {
      icon: '⏳',
    })
    const _tx = await wContract.writeContractAsync({
      abi: MultiBatchSwapFacetAbi,
      address: diamondAddress,
      functionName: 'batchSwapsToSingleToken',
      args: [
        data.tokens.map(token => token.address), // input tokens
        data.tokens.map(token => {
          const tokenInfo = getTokenFromAddress(token.address)
          return ethers.utils.parseUnits(token.amount, tokenInfo?.decimals)
        }), // input tokens amount
        data.targetToken, // to token
        recipient, // recipeint
        0, // slipage
      ],
    })
    if (recipient !== userAddress) {
      toast.success(`Tokens sent to ${recipient}`, {
        icon: '🚀',
      })
    } else {
      toast.success('Batch swap done')
    }
    console.log('_tx', _tx)
    refetchTokens()
    refetchApprovals()
    setIsLoading(false)
    setCurrStatus('Batch Swap')
  }

  const addTokenField = () => {
    const newTokenFields = [...watch('tokens'), { address: '', amount: '' }]
    setValue('tokens', newTokenFields)
  }

  // Function to remove a token input
  const removeToken = (index: number) => {
    const newTokenFields = watch('tokens').filter((_, i) => i !== index)
    setValue('tokens', newTokenFields)
  }

  const _isLoading = isLoading || isLoadingApprovals

  return (
    <form
      onSubmit={handleSubmit(onSubmitHandler)}
      className='mx-auto mb-20 max-w-xl rounded-lg bg-slate-800 p-5 shadow-lg shadow-slate-800 duration-200 hover:shadow-sm hover:shadow-slate-600'
    >
      <h3 className='mb-4 text-xl font-semibold'>Batch Swap Tokens</h3>
      {watch('tokens').map((token, index) => (
        <div key={index} className='mb-3 flex flex-col gap-1 rounded-lg bg-slate-200 p-2 pb-4'>
          <label className='mb-2 block text-sm font-bold text-gray-700'>You Pay:</label>
          <div className='flex gap-2'>
            <Controller
              control={control}
              name={`tokens.${index}.address`}
              render={({ field }) => (
                <select
                  {...field}
                  className='border-1 border:bg-slate-800 mb-2 block max-w-md rounded-lg border bg-slate-800 p-2 text-slate-200 shadow-lg duration-200 hover:cursor-pointer hover:shadow-xl hover:shadow-slate-500'
                >
                  <option value='select'>Select</option>

                  {tokenList.map(token => (
                    <option key={token.address} value={token.address}>
                      {token.symbol}
                    </option>
                  ))}
                </select>
              )}
            />

            {/* Amount input */}
            <Controller
              control={control}
              name={`tokens.${index}.amount`}
              rules={{
                validate: value => {
                  const _token = tokensInfo[getTokenFromAddress(token.address)?.symbol]

                  return ethers.utils
                    .parseUnits(value || '0', _token?.decimals)
                    .lte(_token?.balance || ethers.constants.Zero)
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <input
                    {...field}
                    type='text'
                    className={cn(
                      `block w-full rounded border-0 bg-transparent p-2 text-right text-2xl`,
                      error && 'text-red-600'
                    )}
                    placeholder='Amount'
                  />
                  {error && (
                    <p className='mt-1 text-right text-xs text-red-500'>Amount exceeds balance</p>
                  )}
                </div>
              )}
            />
            <div className='flex justify-center align-middle'>
              <button
                type='button'
                onClick={() => removeToken(index)}
                className='float-right flex justify-center self-center rounded-full bg-red-500 px-1 py-1 text-white hover:bg-red-700 hover:shadow-xl'
              >
                <XCircleIcon className='h-4 w-4 bg-transparent' />
              </button>
            </div>
          </div>
          <div>
            <span>
              Balance:{' '}
              {Number(
                formatUnits(
                  BigInt(
                    tokensInfo[getTokenFromAddress(watch(`tokens.${index}.address`))?.symbol]
                      ?.balance || '0'
                  ),
                  getTokenFromAddress(watch(`tokens.${index}.address`))?.decimals
                )
              )
                .toFixed(2)
                ?.toString() || 'Fetching...'}{' '}
              {getTokenFromAddress(watch(`tokens.${index}.address`))?.symbol}
            </span>
            {/* <span className='float-right mr-16'>{price}</span> */}
          </div>
        </div>
      ))}

      <button
        type='button'
        onClick={addTokenField}
        className='rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700'
      >
        + Add Token
      </button>

      {/* add Convert Icon */}
      <div className='my-4 flex justify-center align-middle'>
        <ArrowsUpDownIcon className='h-10 w-10 text-slate-500' />
      </div>

      {/* output token */}
      <div className='mb-3 mt-4 flex flex-col gap-1 rounded-lg bg-slate-200 p-2 pb-4'>
        <label className='mb-2 block text-sm font-bold text-gray-700'>You Get:</label>
        <div className='flex gap-2'>
          <select
            {...register('targetToken')}
            defaultValue={'select'}
            className='border-1 border:bg-slate-800 mb-2 block max-w-md rounded-lg border bg-slate-800 p-2 text-slate-200 shadow-lg duration-200 hover:cursor-pointer hover:shadow-xl hover:shadow-slate-500'
          >
            <option value='select'>Select</option>
            {tokenList.map(token => (
              <option key={token.address} value={token.address}>
                {token.symbol}
              </option>
            ))}
          </select>

          {/* Amount input */}
          <div>
            <input
              type='text'
              disabled
              className={cn(`block w-full rounded border-0 bg-transparent p-2 text-right text-2xl`)}
              placeholder='0.00'
            />
          </div>
        </div>
      </div>
      <label className='inline-flex cursor-pointer items-center'>
        <input
          onChange={() => setShowRecipient(!showRecipient)}
          type='checkbox'
          value=''
          className='peer sr-only'
        />
        <div className="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
        <span className='ms-3 text-sm font-medium text-gray-900 dark:text-gray-300'>Send to</span>
      </label>

      {showRecipient && (
        <div className='mb-4 mt-2'>
          <input
            {...register('recipient')}
            className='w-full rounded-lg p-2'
            placeholder='recipient address'
          />
        </div>
      )}

      {errorMessage && <p className='mb-1 text-red-500'>{errorMessage}</p>}

      {/* Actions */}

      <button
        type='submit'
        disabled={_isLoading}
        className='spin mt-4 inline-flex w-full justify-center rounded-lg bg-green-500 px-4 py-2 align-middle font-bold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50'
      >
        {_isLoading && <Spinner _className='size-4 mt-1 mr-1' />}
        {currStatus}
      </button>
    </form>
  )
}

export default SwapForm

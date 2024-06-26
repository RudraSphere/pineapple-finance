'use client'

import Spinner from '@/elements/Spinner'
import useCheckApprovals from '@/services/hooks/useCheckApprovals'
import useTokenInfo from '@/services/hooks/useTokenInfo'
import useTokenPrice from '@/services/hooks/useTokenPrice'
import { checkValidNumber, cn, getTokenFromAddress } from '@/utils/common'
import { tokenList } from '@/utils/tokens'
import { ArrowsUpDownIcon, XCircleIcon } from '@heroicons/react/16/solid'
import { BigNumber, ethers } from 'ethers'
import { useEffect, useState } from 'react'
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

const SwapForm: React.FC = () => {
  // State
  const [showRecipient, setShowRecipient] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currStatus, setCurrStatus] = useState('Batch Swap')
  const [errorMessage, setErrorMessage] = useState('')
  const [estimatedValueUSD, setEstimatedValueUSD] = useState(0)

  // Hooks
  const { address: userAddress } = useAccount()
  const { tokensInfo, refetch: refetchTokens } = useTokenInfo()
  const wContract = useWriteContract()
  const { prices: tokenPrices } = useTokenPrice()
  const { register, getValues, handleSubmit, control, reset, watch, setValue, formState } =
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
      .filter(({ address }) => !!address)
      .map(({ address }) => {
        return {
          token: address,
          from: userAddress,
          to: diamondAddress,
        }
      })
  )
  const _tokens = watch('tokens')

  const onSubmitHandler = async (data: SwapFormInputs) => {
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

    if (tokens.some(token => token.address === targetToken)) {
      setErrorMessage('Target token cannot be in input tokens.')
      return
    }

    setIsLoading(true)
    setCurrStatus('Processing...')

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
          approval?.token?.toLowerCase() === token?.address?.toLowerCase() &&
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
    try {
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
    } catch (error) {
      console.error('Error:', error)
      toast.error(`Some error occured`, {
        icon: '😵‍💫',
      })
    }
    refetchTokens()
    refetchApprovals()
    setIsLoading(false)
    setCurrStatus('Batch Swap')
  }

  const addTokenField = (): void => {
    const newTokenFields = [..._tokens, { address: '', amount: '' }]
    setValue('tokens', newTokenFields)
  }

  // Function to remove a token input
  const removeToken = (index: number): void => {
    const newTokenFields = _tokens.filter((_, i) => i !== index)
    setValue('tokens', newTokenFields)
  }

  useEffect(() => {
    console.log('running')
    const inputTokens = _tokens
    const targetToken = watch('targetToken')
    let totalUSD: number = 0
    console.log('tokenPrices in', tokenPrices)

    inputTokens.forEach(token => {
      const isValidNumber = checkValidNumber(token?.amount)
      console.log('isValid', isValidNumber, token?.amount)
      if (isValidNumber && token?.address && userAddress && targetToken) {
        const tokenUSDValue = tokenPrices[token?.address?.toLowerCase()] || 1

        totalUSD += token.amount ? Number(token.amount) * tokenUSDValue : 0
      }
    })

    const estimatedOutputUSD = totalUSD * 0.98 // 2% slippage
    console.log('estimatedOutputUSD', estimatedOutputUSD)
    setEstimatedValueUSD(estimatedOutputUSD)
  }, [_tokens.map(token => token.amount), tokenPrices])

  const inputTokens = _tokens.map(token => token.address)
  const availableOutputTokens = tokenList.filter(token => !inputTokens.includes(token.address))

  const _isLoading = isLoading || isLoadingApprovals

  return (
    <form
      onSubmit={handleSubmit(onSubmitHandler)}
      className='mx-auto mb-20 max-w-xl rounded-lg bg-slate-800 p-5 shadow-sm shadow-slate-800 duration-200 hover:shadow-slate-600'
    >
      <h3 className='mb-4 text-xl font-semibold'>Batch Swap Tokens</h3>
      {_tokens?.map((token, index) => (
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
                  const isValidNumber = checkValidNumber(value)
                  console.log('isValidNumber', isValidNumber, value)
                  if (!isValidNumber) return 'Invalid amount 😕'

                  const _token = tokensInfo[getTokenFromAddress(token.address)?.symbol]

                  return ethers.utils
                    .parseUnits(value || '0', _token?.decimals)
                    .lte(_token?.balance || ethers.constants.Zero)
                    ? true
                    : 'Insufficient balance 🥲'
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <input
                    {...field}
                    type='text'
                    className={cn(
                      `block w-full rounded border-0 bg-transparent p-2 text-right text-2xl outline-none`,
                      error && 'text-red-600'
                    )}
                    placeholder='Amount'
                  />
                  {error && <p className='mt-1 text-right text-xs text-red-500'>{error.message}</p>}
                </div>
              )}
            />
            {getValues('tokens').length > 1 && (
              <div className='flex justify-center align-middle'>
                <button
                  type='button'
                  onClick={() => removeToken(index)}
                  className='float-right flex justify-center self-center rounded-full bg-red-500 px-1 py-1 text-white hover:bg-red-700 hover:shadow-xl'
                >
                  <XCircleIcon className='h-4 w-4 bg-transparent' />
                </button>
              </div>
            )}
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
        className='rounded bg-indigo-600 px-4 py-2 font-bold text-white hover:bg-blue-700 hover:shadow-lg'
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
            {availableOutputTokens?.map(token => (
              <option key={token.address} value={token.address}>
                {token.symbol}
              </option>
            ))}
          </select>

          {/* Amount output */}
          <div>
            <input
              type='text'
              disabled
              value={`~$${estimatedValueUSD.toFixed(2)}`}
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
        <span className='ms-3 text-sm font-medium text-gray-300'>Send to</span>
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
        disabled={_isLoading || !formState.isValid}
        className='mt-4 inline-flex w-full justify-center rounded-lg bg-teal-700 px-4 py-2 align-middle font-bold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50'
      >
        {_isLoading && <Spinner _className='size-4 mt-1 mr-1' />}
        {currStatus}
      </button>
    </form>
  )
}

export default SwapForm

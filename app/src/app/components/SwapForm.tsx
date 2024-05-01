'use client'

import useCheckApproval from '@/services/hooks/useCheckApproval'
import useTokenInfo from '@/services/hooks/useTokenInfo'
import useTokenPrice from '@/services/hooks/useTokenPrice'
import { cn, getTokenFromAddress } from '@/utils/common'
import { Tokens, tokenList } from '@/utils/tokens'
import { ArrowsUpDownIcon, XCircleIcon } from '@heroicons/react/16/solid'
import { ethers } from 'ethers'
import { FC, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { formatUnits } from 'viem'
import { useAccount, useWriteContract } from 'wagmi'
import { address as diamondAddress } from '../../../deployments/internalRPC/Diamond.json'

interface SwapFormInputs {
  tokens: { address: string; amount: string }[]
  targetToken: string
  recipient: string
}

const SwapForm: FC = () => {
  const { address: userAddress } = useAccount()
  const { tokensInfo } = useTokenInfo()
  const wContract = useWriteContract()
  const [errorMessage, setErrorMessage] = useState('')
  const { fetchPrices, prices } = useTokenPrice()
  const [showRecipient, setShowRecipient] = useState(false)

  const { register, handleSubmit, control, reset, watch, setValue } = useForm<SwapFormInputs>({
    defaultValues: {
      tokens: [{ address: '', amount: '' }],
      targetToken: 'select',
      recipient: '',
    },
  })

  const { data: allowance } = useCheckApproval({
    token: Tokens.WMATIC.address,
    from: userAddress,
    to: diamondAddress,
  })

  const onSubmitHandler = async (data: SwapFormInputs) => {
    const recipient = data.recipient || userAddress

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

    // console.log('Allowance already set', allowance)
    // if (Number(allowance) < 1e18) {
    //   console.log('Setting allowance...')
    //   await wContract.writeContractAsync({
    //     abi: erc20Abi,
    //     address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
    //     functionName: 'approve',
    //     args: [diamondAddress, ethers.utils.parseUnits('100', 6)],
    //   })
    //   // await wContract.writeContractAsync({
    //   //   abi: erc20Abi,
    //   //   address: '0x6f8a06447ff6fcf75d803135a7de15ce88c1d4ec',
    //   //   functionName: 'approve',
    //   //   args: [diamondAddress, ethers.utils.parseUnits('100', 18)],
    //   // })
    //   // Call the swap function
    //   console.log('Swapping...', wContract)
    //   const _tx = await wContract.writeContractAsync({
    //     abi: MultiBatchSwapFacetAbi,
    //     address: diamondAddress,
    //     functionName: 'batchSwapsToSingleToken',
    //     args: [
    //       ['0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359'],
    //       [ethers.utils.parseUnits('10', 6)],
    //       '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
    //       userAddress,
    //       10,
    //     ],
    //   })
    //   console.log('_tx', _tx)
    // }
    // console.log('Swapped...', wContract)
    // // console.log(`After swap: ${formatEther(wMaticBalance)}, ${formatUnits(usdcBalance, 6)}}`)
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

  return (
    <form
      onSubmit={handleSubmit(onSubmitHandler)}
      className='mx-auto max-w-xl rounded-lg bg-slate-800 p-5 shadow-lg'
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
        className='w-full rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700'
      >
        Swap
      </button>
    </form>
  )
}

export default SwapForm

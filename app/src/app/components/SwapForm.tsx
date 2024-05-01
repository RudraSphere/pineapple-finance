'use client'

import useCheckApproval from '@/services/hooks/useCheckApproval'
import useTokenInfo from '@/services/hooks/useTokenInfo'
import { cn, getTokenFromAddress } from '@/utils/common'
import { Tokens, tokenList } from '@/utils/tokens'
import { XCircleIcon } from '@heroicons/react/16/solid'
import { ethers } from 'ethers'
import { FC } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { erc20Abi, formatUnits } from 'viem'
import { useAccount, useWriteContract } from 'wagmi'
import { address as diamondAddress } from '../../../deployments/internalRPC/Diamond.json'
import { abi as MultiBatchSwapFacetAbi } from '../../../deployments/internalRPC/MultiBatchSwapFacet.json'

interface SwapFormInputs {
  tokens: { address: string; amount: string }[]
  targetToken: string
}

const SwapForm: FC = () => {
  const { address: userAddress } = useAccount()
  const { tokensInfo } = useTokenInfo()
  const wContract = useWriteContract()

  const { register, handleSubmit, control, reset, watch, setValue } = useForm<SwapFormInputs>({
    defaultValues: {
      tokens: [{ address: '', amount: '' }],
    },
  })

  const { data: allowance } = useCheckApproval({
    token: Tokens.WMATIC.address,
    from: userAddress,
    to: diamondAddress,
  })

  // Function to remove a token input
  const removeToken = (index: number) => {
    const currentTokens = watch('tokens')
    const newTokens = currentTokens.filter((_, i) => i !== index)
    setValue('tokens', newTokens)
  }

  const onSubmitHandler = async e => {
    // console.log(`Before swap: ${wMaticBalance}, ${usdcBalance}`)
    console.log('Allowance already set', allowance)

    if (Number(allowance) < 1e18) {
      console.log('Setting allowance...')
      await wContract.writeContractAsync({
        abi: erc20Abi,
        address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
        functionName: 'approve',
        args: [diamondAddress, ethers.utils.parseUnits('100', 6)],
      })

      // await wContract.writeContractAsync({
      //   abi: erc20Abi,
      //   address: '0x6f8a06447ff6fcf75d803135a7de15ce88c1d4ec',
      //   functionName: 'approve',
      //   args: [diamondAddress, ethers.utils.parseUnits('100', 18)],
      // })

      // Call the swap function
      console.log('Swapping...', wContract)
      const _tx = await wContract.writeContractAsync({
        abi: MultiBatchSwapFacetAbi,
        address: diamondAddress,
        functionName: 'batchSwapsToSingleToken',
        args: [
          ['0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359'],
          [ethers.utils.parseUnits('10', 6)],
          '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
          userAddress,
          10,
        ],
      })
      console.log('_tx', _tx)
    }

    console.log('Swapped...', wContract)
    // console.log(`After swap: ${formatEther(wMaticBalance)}, ${formatUnits(usdcBalance, 6)}}`)
  }

  const onAddToken = () => {
    const tokens = watch('tokens')
    reset({ ...watch(), tokens: [...tokens, { address: '', amount: '' }] })
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmitHandler)}
      className='mx-auto max-w-xl rounded-lg bg-slate-800 p-5 shadow-lg'
    >
      <h3 className='mb-4 text-xl font-semibold'>Batch Swap Tokens</h3>
      {watch('tokens').map((token, index) => (
        <div key={index} className='mb-3 flex flex-col gap-1 rounded-lg bg-slate-200 p-2 pb-4'>
          <label className='mb-2 block text-sm font-bold text-gray-700'>Token:</label>
          <div className='flex gap-2'>
            <Controller
              control={control}
              name={`tokens.${index}.address`}
              render={({ field }) => (
                <select {...field} className='mb-2 block max-w-md rounded border p-2 shadow-inner'>
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
                  console.log(_token?.balance, value, _token?.decimals)
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
            {/* Balance */}
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
          </div>
        </div>
      ))}

      <button
        type='button'
        onClick={onAddToken}
        className='rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700'
      >
        + Select Tokens
      </button>

      <div className='my-4 flex flex-col gap-1'>
        <label htmlFor='outputToken'>You will get:</label>
        <input
          name='outputToken'
          id='outputToken'
          className='rounded-lg border-0 p-2 focus:outline-1'
        />
      </div>

      {/* Actions */}

      <button
        type='submit'
        className='float-right rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700'
      >
        Swap
      </button>
    </form>
  )
}

export default SwapForm

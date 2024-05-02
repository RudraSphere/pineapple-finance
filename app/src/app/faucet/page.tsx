'use client'

import useEnsureNetwork from '@/services/hooks/useEnsureNetwork'
import { useEthersProvider } from '@/services/hooks/useEthersProvider'
import { Tokens } from '@/utils/tokens'
import { ethers } from 'ethers'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useAccount } from 'wagmi'

const FaucetPage = () => {
  const [loading, setLoading] = useState(false)
  const { address: userAddress, isConnected } = useAccount()
  const [transactionHash, setTransactionHash] = useState('')

  const provider = useEthersProvider()
  const { isCorrectNetwork } = useEnsureNetwork()

  const sendUSDC = async () => {
    setLoading(true)
    toast.success(`Sending USDC`, {
      icon: '🚀',
    })
    const wallet = new ethers.Wallet(process.env.NEXT_PUBLIC_PK, provider)
    const usdcAddress = Tokens.USDC.address
    const usdcAbi = ['function transfer(address to, uint amount)']
    const usdcContract = new ethers.Contract(usdcAddress, usdcAbi, wallet)

    try {
      const tx = await usdcContract.transfer(userAddress, ethers.utils.parseUnits('2', 6))
      await tx.wait()
      toast.success(`2 USDC Sent.`, {
        icon: '🎉',
      })
      setTransactionHash(tx.hash)
      setLoading(false)
    } catch (error) {
      console.error('Error:', error)
      toast.error(`Some error occured`, {
        icon: '😵‍💫',
      })
      setLoading(false)
    }
  }

  const sendMatic = async () => {
    toast.success(`Sending Matic`, {
      icon: '🚀',
    })
    setLoading(true)
    const wallet = new ethers.Wallet(process.env.NEXT_PUBLIC_PK, provider)

    try {
      const tx = await wallet.sendTransaction({
        to: userAddress,
        value: ethers.utils.parseEther('10'),
      })
      await tx.wait()
      toast.success(`10 Matic Sent.`, {
        icon: '🎉',
      })
      setTransactionHash(tx.hash)
      setLoading(false)
    } catch (error) {
      console.error('Error:', error)
      toast.error(`Some error occured`, {
        icon: '😵‍💫',
      })
      setLoading(false)
    }
  }

  if (!isConnected || !isCorrectNetwork) {
    return (
      <div className='mx-auto my-4 max-w-4xl text-center'>
        <h1 className='text-pretty text-3xl font-semibold '>Connect to Internal RPC.</h1>
      </div>
    )
  }

  if (!process.env.NEXT_PUBLIC_PK) {
    return (
      <div className='mx-auto my-4 max-w-4xl text-center'>
        <h1 className='text-pretty text-3xl font-semibold '>System Error</h1>
      </div>
    )
  }

  return (
    <div className='mx-auto my-4 max-w-4xl text-center'>
      <p className='mb-2 text-pretty font-mono text-3xl text-teal-500 underline underline-offset-8'>
        Your Funds are Safe.
      </p>

      <div className='mx-auto my-4 max-w-2xl rounded-xl bg-slate-700 p-4 shadow-xl'>
        <h1 className='mb-4 text-4xl text-slate-300'>Faucet</h1>

        <button
          onClick={sendUSDC}
          disabled={loading}
          className='rounded bg-indigo-600 px-4 py-2 font-bold text-white hover:bg-blue-700 hover:shadow-lg'
        >
          {loading ? 'Sending USDC...' : 'Get 4 USDC'}
        </button>
        <button
          onClick={sendMatic}
          disabled={loading}
          className='ml-2 rounded bg-indigo-600 px-4 py-2 font-bold text-white hover:bg-blue-700 hover:shadow-lg'
        >
          {loading ? 'Sending Matic...' : 'Get 10 Matic'}
        </button>

        <p className='mt-2 text-pretty text-slate-400'>Believe me, thats a lot of free money. 😵‍💫</p>
        {transactionHash && <p>Transaction hash: {transactionHash}</p>}
      </div>
    </div>
  )
}

export default FaucetPage

'use client'

import useEnsureNetwork from '@/services/hooks/useEnsureNetwork'
import Link from 'next/link'
import SwapForm from './components/SwapForm'

export default function Home() {
  const { isCorrectNetwork } = useEnsureNetwork()
  console.log('isCorrectNetwork:', isCorrectNetwork ? 'true' : 'false')

  if (!isCorrectNetwork) {
    return (
      <div className='mx-auto my-4 max-w-4xl text-center'>
        <h4 className='font-heading text-3xl font-semibold'>
          Please switch to the Polygon Forked Internal RPC network to use this app.
        </h4>
      </div>
    )
  }

  return (
    <>
      <div className='mx-auto my-4 max-w-4xl text-center'>
        <p className='mb-2 text-pretty font-mono text-3xl text-teal-500 underline underline-offset-8'>
          Your Funds are Safe.
        </p>
        <h4 className='font-heading text-lg font-semibold'>
          Personal Project Deployed on a Forked Version of the Polygon Network on AWS EC2 (Internal
          RPC).
        </h4>
        <p className='font-sans text-2xl'>
          🎉 Get <span className='text-teal-400'>free</span> Tokens + Coin from{' '}
          <Link className='text-3xl underline duration-200 hover:text-teal-600' href='/faucet'>
            here.
          </Link>
        </p>
      </div>

      <SwapForm />
    </>
  )
}

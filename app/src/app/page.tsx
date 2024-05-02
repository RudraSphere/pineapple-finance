'use client'

import Link from 'next/link'
import SwapForm from './components/SwapForm'

export default function Home() {
  return (
    <>
      <div className='mx-auto my-4 max-w-4xl text-center'>
        <h4 className='font-heading text-lg font-semibold'>
          Personal Project Deployed on a Forked Version of the Polygon Network on AWS EC2 (Internal
          RPC).
        </h4>
        <p className='font-sans'>
          Get free Tokens from{' '}
          <Link className='text-xl underline duration-200 hover:text-teal-600' href='/faucet'>
            here.
          </Link>
        </p>
      </div>

      <SwapForm />
    </>
  )
}

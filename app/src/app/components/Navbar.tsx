import { BoltIcon } from '@heroicons/react/16/solid'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'

const Navbar = () => {
  return (
    <nav className='bg-gray-900 p-4 text-white shadow-lg'>
      <div className='container mx-auto flex items-center justify-between'>
        <div className='inline-flex gap-2 text-lg font-semibold'>
          <BoltIcon className='size-6 text-teal-400' />
          Pineapple Finance.
        </div>
        <div className='hidden space-x-4 md:flex'>
          <Link href='/' className='hover:text-gray-300'>
            Batch Swap
          </Link>
          <Link href='/faucet' className='relative hover:text-gray-300'>
            <span className='absolute left-[-5px] top-0 animate-ping rounded-full bg-red-500 p-1'></span>
            Faucet
          </Link>
          <Link href='/dca' className='hover:text-gray-300'>
            DCA
          </Link>
        </div>
        <div className='md:hidden'>
          <button className='text-white focus:outline-none'>
            <svg
              className='h-6 w-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M4 6h16M4 12h16m-7 6h7'
              ></path>
            </svg>
          </button>
        </div>

        <ConnectButton
          showBalance={{
            smallScreen: false,
            largeScreen: true,
          }}
        />
      </div>
    </nav>
  )
}

export default Navbar

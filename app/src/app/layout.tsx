import Web3Provider from '@/services/Web3Provider'
import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pineapple Finance: DCA + Batched Swaps via Diamond on Forked Polygon Network.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className='m-0 h-full min-h-screen bg-slate-900 p-0 text-slate-500'>
        <Web3Provider>
          <Toaster position='top-center' />
          <Navbar />
          <br />
          {children}
        </Web3Provider>
      </body>
    </html>
  )
}

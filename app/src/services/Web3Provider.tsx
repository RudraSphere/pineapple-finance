'use client'

import { Chain, RainbowKitProvider, darkTheme, getDefaultConfig } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { metaMaskWallet } from '@rainbow-me/rainbowkit/wallets'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, createStorage } from 'wagmi'
import { polygon } from 'wagmi/chains'

const polygonForkedInternalRpc = {
  id: 8999,
  name: 'Polygon Forked Internal RPC',
  iconUrl: '',
  iconBackground: '#fff',
  nativeCurrency: { name: 'Matic', symbol: 'MATIC', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://ankit5577.eu.org/'],
    },
  },
  blockExplorers: {
    default: { name: 'SnowTrace', url: 'https://0x0000.com/' },
  },
  contracts: {
    multicall3: {
      address: polygon.contracts.multicall3.address,
      blockCreated: polygon.contracts.multicall3.blockCreated,
    },
  },
} as const satisfies Chain

export const config = getDefaultConfig({
  appName: 'Pineapple Finance',
  storage: createStorage({
    storage: typeof window !== 'undefined' && window.localStorage,
  }),
  batch: { multicall: true },
  wallets: [
    {
      groupName: 'Recommended',
      wallets: [metaMaskWallet],
    },
  ],
  projectId: 'XXXXX',
  chains: [polygonForkedInternalRpc],
  ssr: false,
  pollingInterval: 10_000,
})

const queryClient = new QueryClient()

const Web3Provider = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          showRecentTransactions={true}
          theme={darkTheme({ overlayBlur: 'small' })}
          modalSize='compact'
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default Web3Provider

import { tokenList } from '@/utils/tokens'
import axios from 'axios'
import { useEffect, useState } from 'react'

const useTokenPrices = (network = 'polygon-pos') => {
  const [prices, setPrices] = useState({})

  useEffect(() => {
    const fetchPrices = async () => {
      const tokenAddresses = tokenList?.map(token => token.address)
      if (process.env.NODE_ENV == 'development') {
        const devPrices = tokenList.reduce((acc, token) => {
          acc[token.address.toLowerCase()] = Math.random()
          return acc
        }, {})
        setPrices(devPrices)
        return
      }

      if (tokenAddresses.length === 0) return

      const addresses = tokenAddresses.join(',')
      const url = `https://api.coingecko.com/api/v3/simple/token_price/${network}?contract_addresses=${addresses}&vs_currencies=usd`

      try {
        const response = await axios.get(url, {
          headers: {
            'Content-Type': 'application/json',
            'x-cg-demo-api-key': 'CG-e6YjxdMeyfXS36HeJ9Ttej5g',
          },
        })
        const newPrices = response.data

        setPrices(currentPrices => ({
          ...currentPrices,
          ...Object.keys(newPrices).reduce((acc, key) => {
            acc[key.toLowerCase()] = newPrices[key].usd
            return acc
          }, {}),
        }))
      } catch (error) {
        console.error('Failed to fetch token prices:', error)
      }
    }

    fetchPrices()
  }, [])

  return { prices }
}

export default useTokenPrices

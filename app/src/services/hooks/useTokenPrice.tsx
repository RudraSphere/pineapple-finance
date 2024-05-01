import axios from 'axios'
import { useState } from 'react'

const useTokenPrices = (network = 'polygon-pos') => {
  const [prices, setPrices] = useState({})

  const fetchPrices = async tokenAddresses => {
    if (tokenAddresses.length === 0) return

    const addresses = tokenAddresses.join(',')
    const url = `https://api.coingecko.com/api/v3/simple/token_price/${network}?contract_addresses=${addresses}&vs_currencies=usd`

    try {
      const response = await axios.get(url)
      const newPrices = response.data

      setPrices(currentPrices => ({
        ...currentPrices,
        ...Object.keys(newPrices).reduce((acc, key) => {
          acc[key.toLowerCase()] = newPrices[key].usd
          return acc
        }, {}),
      }))
    } catch (error) {
      // console.error('Failed to fetch token prices:', error)
    }
  }
  return { prices, fetchPrices }
}

export default useTokenPrices

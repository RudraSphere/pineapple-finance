import axios from 'axios'
import { useEffect, useState } from 'react'

const useTokenPrice = (tokenAddress, network = 'polygon-pos') => {
  const [price, setPrice] = useState(null)

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const url = `https://api.coingecko.com/api/v3/simple/token_price/${network}?contract_addresses=${tokenAddress}&vs_currencies=usd`

        const response = await axios.get(url, {
          headers: { accept: 'application/json', 'x-cg-demo-api-key': 'CG-e6YjxdMeyfXS36HeJ9Ttej5g' }
        })

        const priceData = response.data[tokenAddress.toLowerCase()].usd
        setPrice(priceData)
      } catch (error) {
        console.error('Failed to fetch token price:', error)
      }
    }

    fetchPrice()
  }, [tokenAddress, network])

  return price
}

export default useTokenPrice

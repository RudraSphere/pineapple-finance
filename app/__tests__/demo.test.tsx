import Navbar from '@/app/components/Navbar'
import Web3Provider from '@/services/Web3Provider'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

describe('Page', () => {
  it('renders a heading', () => {
    render(
      <Web3Provider>
        <Navbar />
      </Web3Provider>
    )

    const heading = screen.getByText(/Pineapple Finance/i)

    expect(heading).toBeInTheDocument()
  })
})

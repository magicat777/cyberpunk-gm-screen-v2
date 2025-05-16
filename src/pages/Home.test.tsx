import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from './Home'

describe('Home', () => {
  it('renders the title', () => {
    render(<Home />)
    expect(screen.getByText('Cyberpunk Red GM Screen')).toBeInTheDocument()
  })

  it('renders the welcome message', () => {
    render(<Home />)
    expect(screen.getByText(/Welcome to the interactive Game Master Screen/)).toBeInTheDocument()
  })
})
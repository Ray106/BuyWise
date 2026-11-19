import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from '../App'

describe('BuyWise core journey', () => {
  beforeEach(() => {
    localStorage.clear()
    window.location.hash = '#/home'
  })

  it('searches, compares, watches, updates a target, and simulates an alert', async () => {
    const user = userEvent.setup()
    render(<App />)

    const search = screen.getByLabelText('Search sample products')
    await user.type(search, 'headphones')
    await user.click(screen.getByRole('button', { name: /compare sample prices/i }))

    await waitFor(() => expect(screen.getByText(/1 sample product/i)).toBeTruthy())
    await user.click(screen.getByRole('button', { name: /compare all offers/i }))

    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText('Amazon')).toBeTruthy()
    expect(within(dialog).getByText('Lowest total')).toBeTruthy()
    const retailerLinks = within(dialog).getAllByRole('link', { name: /search store/i })
    expect(retailerLinks).toHaveLength(4)
    expect(retailerLinks.map((link) => new URL(link.getAttribute('href')!).hostname)).toEqual([
      'www.amazon.com',
      'www.walmart.com',
      'www.target.com',
      'www.bestbuy.com',
    ])
    await user.click(within(dialog).getByRole('button', { name: /watch this product/i }))
    await user.click(within(dialog).getByRole('button', { name: /close comparison/i }))

    const mainNavigation = screen.getByRole('navigation', { name: 'Main navigation' })
    await user.click(within(mainNavigation).getByRole('button', { name: /watchlist/i }))
    const target = await screen.findByLabelText(/target price for sony/i)
    fireEvent.change(target, { target: { value: '72' } })
    expect((target as HTMLInputElement).value).toBe('72')

    await user.click(screen.getByRole('button', { name: /simulate price drop/i }))
    expect((await screen.findByRole('status')).textContent).toMatch(/this is a simulation/i)
  })
})

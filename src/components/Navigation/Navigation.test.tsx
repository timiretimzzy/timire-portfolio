import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { Navigation } from './Navigation'

describe('Navigation', () => {
  it('names every section plainly and marks the current one', () => {
    render(
      <MemoryRouter initialEntries={['/projects']}>
        <Navigation />
      </MemoryRouter>,
    )
    for (const n of ['About', 'Projects', 'Writing', 'Experiments', 'Contact']) {
      expect(screen.getByRole('link', { name: new RegExp(`^${n} \\(`) })).toBeInTheDocument()
    }
    expect(screen.getByRole('link', { name: /^Projects/ })).toHaveAttribute('aria-current', 'page')
  })

  it('opens and closes the index with the button and Escape', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>,
    )
    const btn = screen.getByRole('button', { name: /index/i })
    expect(btn).toHaveAttribute('aria-expanded', 'false')
    await user.click(btn)
    expect(btn).toHaveAttribute('aria-expanded', 'true')
    await user.keyboard('{Escape}')
    expect(btn).toHaveAttribute('aria-expanded', 'false')
    expect(btn).toHaveFocus()
  })
})

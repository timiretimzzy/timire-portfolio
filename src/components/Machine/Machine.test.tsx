import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { Machine } from './Machine'

function Where() {
  const l = useLocation()
  return <output data-testid="where">{l.search}</output>
}

function setup(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Machine />
              <Where />
            </>
          }
        />
      </Routes>
    </MemoryRouter>,
  )
}

describe('Machine', () => {
  it('starts on software architecture and lists its projects on the tape', () => {
    setup()
    const group = screen.getByRole('radiogroup', { name: /select a mechanism/i })
    expect(within(group).getByRole('radio', { checked: true })).toHaveTextContent('B')
    expect(screen.getByRole('link', { name: /FiscalStack Integrations/ })).toHaveAttribute('href', '/projects/fiscalstack-integrations')
  })

  it('reads the selection from the URL', () => {
    setup('/?m=C')
    expect(screen.getByRole('radio', { checked: true })).toHaveTextContent('C')
    expect(screen.getByRole('link', { name: /Real-time ODI outcome prediction/ })).toBeInTheDocument()
  })

  it('moves with arrow keys, wraps around, and writes the choice to the URL', async () => {
    const user = userEvent.setup()
    setup('/?m=F')
    screen.getByRole('radio', { checked: true }).focus()
    await user.keyboard('{ArrowRight}')
    const checked = screen.getByRole('radio', { checked: true })
    expect(checked).toHaveTextContent('A')
    expect(checked).toHaveFocus()
    expect(screen.getByTestId('where')).toHaveTextContent('?m=A')
    await user.keyboard('{End}')
    expect(screen.getByRole('radio', { checked: true })).toHaveTextContent('F')
  })

  it('has one tab stop for the whole key group (roving tabindex)', () => {
    setup()
    const radios = screen.getAllByRole('radio')
    expect(radios.filter((r) => r.getAttribute('tabindex') === '0')).toHaveLength(1)
  })

  it('selects by click and announces the change in the readout', async () => {
    const user = userEvent.setup()
    setup()
    await user.click(screen.getByRole('radio', { name: /Testing/ }))
    expect(screen.getByText('Testing and verification', { selector: 'p' })).toBeInTheDocument()
  })

  it('switches between elevation and schematic and shows the part legend', async () => {
    const user = userEvent.setup()
    setup()
    expect(screen.queryByRole('list', { name: /part callouts/i })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Schematic' }))
    expect(screen.getByRole('button', { name: 'Schematic' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('list', { name: /part callouts/i })).toBeInTheDocument()
  })
})

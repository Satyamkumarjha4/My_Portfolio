import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import ErrorBoundary from './ErrorBoundary'

const Boom = ({ explode }: { explode: boolean }) => {
  if (explode) throw new Error('boom')
  return <p>fine</p>
}

describe('ErrorBoundary', () => {
  it('renders children when nothing throws', () => {
    render(
      <ErrorBoundary>
        <Boom explode={false} />
      </ErrorBoundary>
    )
    expect(screen.getByText('fine')).toBeInTheDocument()
  })

  it('shows a fallback when a child throws and recovers when resetKey changes', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const { rerender } = render(
      <ErrorBoundary resetKey="/a">
        <Boom explode />
      </ErrorBoundary>
    )
    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong')

    rerender(
      <ErrorBoundary resetKey="/b">
        <Boom explode={false} />
      </ErrorBoundary>
    )
    expect(screen.getByText('fine')).toBeInTheDocument()
    spy.mockRestore()
  })
})

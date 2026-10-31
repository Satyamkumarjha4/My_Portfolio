import { act, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import AdminNoticeBanner from './AdminNoticeBanner'

afterEach(() => vi.useRealTimers())

describe('AdminNoticeBanner', () => {
  it('renders nothing without a message', () => {
    const { container } = render(<AdminNoticeBanner message={null} onDismiss={() => {}} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('shows the message as a status and dismisses itself after a while', () => {
    vi.useFakeTimers()
    const onDismiss = vi.fn()
    render(<AdminNoticeBanner message="Saved — the public site updates in about a minute." onDismiss={onDismiss} />)
    expect(screen.getByRole('status')).toHaveTextContent('Saved — the public site updates in about a minute.')
    act(() => vi.advanceTimersByTime(8000))
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })
})

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Plain function (not vi.fn): vitest tracks rejected mock results as unhandled errors
let impl: (...a: unknown[]) => Promise<unknown> = async () => ({})
const calls: unknown[][] = []
const post = (...a: unknown[]) => {
  calls.push(a)
  return impl(...a)
}
vi.mock('../utils/axios', () => ({ axiosInstance: { post: (...a: unknown[]) => post(...a) } }))

import FeedbackForm from './Feedback'

const fillAndSubmit = async () => {
  const user = userEvent.setup()
  await user.type(screen.getByPlaceholderText(/email/i), 'ann@example.com')
  await user.type(screen.getByPlaceholderText(/your name/i), 'Ann')
  await user.click(screen.getByRole('button', { name: 'Rate 4 out of 5' }))
  await user.click(screen.getByRole('button', { name: /submit feedback/i }))
}

const failWith = (status: number) => {
  impl = async () => {
    throw { response: { status } }
  }
}

beforeEach(() => {
  calls.length = 0
  impl = async () => ({ status: 201 })
})

describe('FeedbackForm', () => {
  it('does not call the API when required fields are missing', async () => {
    const user = userEvent.setup()
    render(<FeedbackForm />)
    await user.click(screen.getByRole('button', { name: /submit feedback/i }))
    expect(calls).toHaveLength(0)
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument()
  })

  it('posts the form and only then shows success', async () => {
        render(<FeedbackForm />)
    await fillAndSubmit()
    await waitFor(() => expect(screen.getByText(/submitted successfully/i)).toBeInTheDocument())
    expect(calls[0][0]).toBe('/feedback')
    expect(calls[0][1]).toMatchObject({ email: 'ann@example.com', name: 'Ann', rating: 4 })
  })

  it('shows an error and never shows success when the API fails', async () => {
    failWith(500)
    render(<FeedbackForm />)
    await fillAndSubmit()
    expect(await screen.findByText(/failed to submit/i)).toBeInTheDocument()
    expect(screen.queryByText(/submitted successfully/i)).not.toBeInTheDocument()
  })

  it('tells the user when they are rate limited', async () => {
    failWith(429)
    render(<FeedbackForm />)
    await fillAndSubmit()
    expect(await screen.findByText(/too many submissions/i)).toBeInTheDocument()
  })
})

import { describe, expect, it } from 'vitest'
import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DeleteConfirmModal from '../../admin/components/DeleteConfirmModal'

// Exercises the real admin dialog: open from a button, keyboard-only.
const Harness = () => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button>before</button>
      <button onClick={() => setOpen(true)}>Delete selected</button>
      <button>after</button>
      {open && <DeleteConfirmModal count={2} onCancel={() => setOpen(false)} onConfirm={() => setOpen(false)} />}
    </>
  )
}

const openDialog = async () => {
  const user = userEvent.setup()
  render(<Harness />)
  const opener = screen.getByRole('button', { name: 'Delete selected' })
  await user.click(opener)
  const dialog = screen.getByRole('dialog')
  return { user, opener, dialog }
}

describe('modal focus management', () => {
  it('moves focus into the dialog on open', async () => {
    const { dialog } = await openDialog()
    expect(dialog).toContainElement(document.activeElement as HTMLElement)
  })

  it('keeps Tab and Shift+Tab inside the dialog', async () => {
    const { user, dialog } = await openDialog()
    for (let i = 0; i < 8; i++) {
      await user.tab()
      expect(dialog).toContainElement(document.activeElement as HTMLElement)
    }
    for (let i = 0; i < 8; i++) {
      await user.tab({ shift: true })
      expect(dialog).toContainElement(document.activeElement as HTMLElement)
    }
  })

  it('closes on Escape and returns focus to the opener', async () => {
    const { user, opener } = await openDialog()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(opener).toHaveFocus()
  })
})

// Regression: closing a modal triggers a re-fetch in the admin tables; the table
// must stay mounted or focus cannot return to the opener.
import { vi } from 'vitest'
import { waitFor } from '@testing-library/react'
vi.mock('../utils/axios', () => ({ adminApi: { get: async () => ({ data: [] }), delete: async () => ({}) } }))
import { useAdminResource } from '../../admin/hooks'

const TableHarness = () => {
  const { loading, fetchItems } = useAdminResource<{ id: string }>('/projects')
  const [open, setOpen] = useState(false)
  if (loading) return <p>loading</p>
  return (
    <>
      <button onClick={() => setOpen(true)}>Add Project</button>
      {open && <DeleteConfirmModal count={1} onCancel={() => { setOpen(false); fetchItems() }} onConfirm={() => setOpen(false)} />}
    </>
  )
}

describe('focus return with re-fetch on close', () => {
  it('returns focus to the opener even though closing re-fetches data', async () => {
    const user = userEvent.setup()
    render(<TableHarness />)
    const opener = await screen.findByRole('button', { name: 'Add Project' })
    await user.click(opener)
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.getByRole('button', { name: 'Add Project' })).toHaveFocus())
  })
})

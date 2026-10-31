import { describe, expect, it, vi } from 'vitest'
import { act, renderHook, waitFor } from '@testing-library/react'

let rows = [{ id: 'a' }, { id: 'b' }, { id: 'c' }]
const failing = new Set<string>()
vi.mock('../ui/utils/http', () => ({
  adminApi: {
    get: async () => ({ data: rows }),
    delete: async (url: string) => {
      const id = url.split('/').pop()!
      if (failing.has(id)) throw { response: { status: 500, data: { error: 'Internal server error' } } }
      rows = rows.filter(r => r.id !== id)
      return { status: 204 }
    },
  },
}))

import { PUBLISH_NOTICE, useAdminResource } from './hooks'

describe('useAdminResource delete', () => {
  it('shows a visible error on partial failure, keeps failed rows selected and re-syncs the list', async () => {
    failing.add('b')
    const { result } = renderHook(() => useAdminResource<{ id: string }>('/projects'))
    await waitFor(() => expect(result.current.items).toHaveLength(3))

    act(() => result.current.toggleAll(['a', 'b']))
    await act(() => result.current.handleDelete())

    expect(result.current.error).toMatch(/1 of 2 item\(s\) could not be deleted: Internal server error/)
    expect(result.current.selected).toEqual(['b'])
    expect(result.current.items.map(r => r.id)).toEqual(['b', 'c'])
  })

  it('clears the error and selection when every delete succeeds', async () => {
    failing.clear()
    rows = [{ id: 'x' }]
    const { result } = renderHook(() => useAdminResource<{ id: string }>('/projects'))
    await waitFor(() => expect(result.current.items).toHaveLength(1))
    act(() => result.current.toggleAll(['x']))
    await act(() => result.current.handleDelete())
    expect(result.current.error).toBeNull()
    expect(result.current.selected).toEqual([])
    expect(result.current.items).toEqual([])
  })
})

describe('useAdminResource publish notice', () => {
  it('announces that the public site will update after a successful delete or save', async () => {
    failing.clear()
    rows = [{ id: 'x' }, { id: 'y' }]
    const { result } = renderHook(() => useAdminResource<{ id: string }>('/projects'))
    await waitFor(() => expect(result.current.items).toHaveLength(2))
    expect(result.current.notice).toBeNull()

    act(() => result.current.toggleAll(['x']))
    await act(() => result.current.handleDelete())
    expect(result.current.notice).toBe(PUBLISH_NOTICE)
    expect(PUBLISH_NOTICE).toBe('Saved — the public site updates in about a minute.')

    act(() => result.current.clearNotice())
    expect(result.current.notice).toBeNull()
    act(() => result.current.announceSaved())
    expect(result.current.notice).toBe(PUBLISH_NOTICE)
  })

  it('does not announce when every delete failed', async () => {
    failing.add('x')
    rows = [{ id: 'x' }]
    const { result } = renderHook(() => useAdminResource<{ id: string }>('/projects'))
    await waitFor(() => expect(result.current.items).toHaveLength(1))
    act(() => result.current.toggleAll(['x']))
    await act(() => result.current.handleDelete())
    expect(result.current.notice).toBeNull()
    failing.clear()
  })

  it('never announces for data that is not on the public site (feedback)', async () => {
    failing.clear()
    rows = [{ id: 'f' }]
    const { result } = renderHook(() => useAdminResource<{ id: string }>('/feedback', { publishesToSite: false }))
    await waitFor(() => expect(result.current.items).toHaveLength(1))
    act(() => result.current.toggleAll(['f']))
    await act(() => result.current.handleDelete())
    act(() => result.current.announceSaved())
    expect(result.current.notice).toBeNull()
  })
})

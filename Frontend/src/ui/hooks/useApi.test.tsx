import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'

const get = vi.fn()
vi.mock('../utils/axios', () => ({ axiosInstance: { get: (...a: unknown[]) => get(...a) } }))

const load = async () => (await import('./useApi')).useApi

beforeEach(() => {
  get.mockReset()
  vi.resetModules()
})

describe('useApi', () => {
  it('fetches once for concurrent consumers and then serves from cache', async () => {
    get.mockResolvedValue({ data: [{ id: 1 }] })
    const useApi = await load()

    const a = renderHook(() => useApi<{ id: number }[]>('/projects'))
    const b = renderHook(() => useApi<{ id: number }[]>('/projects'))
    await waitFor(() => expect(a.result.current.data).toEqual([{ id: 1 }]))
    await waitFor(() => expect(b.result.current.data).toEqual([{ id: 1 }]))
    expect(get).toHaveBeenCalledTimes(1)

    const c = renderHook(() => useApi<{ id: number }[]>('/projects'))
    expect(c.result.current.loading).toBe(false)
    expect(c.result.current.data).toEqual([{ id: 1 }])
    expect(get).toHaveBeenCalledTimes(1)
  })

  it('reports errors and recovers on refetch', async () => {
    get.mockRejectedValueOnce(new Error('network'))
    const useApi = await load()
    const { result } = renderHook(() => useApi<string[]>('/tech-stacks'))

    await waitFor(() => expect(result.current.error).toBe(true))
    expect(result.current.loading).toBe(false)

    get.mockResolvedValueOnce({ data: ['ok'] })
    result.current.refetch()
    await waitFor(() => expect(result.current.data).toEqual(['ok']))
    expect(result.current.error).toBe(false)
  })
})

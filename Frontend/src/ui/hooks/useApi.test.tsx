import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'

const get = vi.fn()
vi.mock('../utils/http', () => ({ publicApi: { get: (...a: unknown[]) => get(...a) } }))

const load = async () => (await import('./useApi')).useApi

beforeEach(() => {
  get.mockReset()
  vi.resetModules()
})

describe('useApi', () => {
  it('fetches once for concurrent consumers and then serves from cache', async () => {
    get.mockResolvedValue({ data: [{ id: 1 }] })
    const useApi = await load()

    const a = renderHook(() => useApi<{ id: number }[]>('/extra'))
    const b = renderHook(() => useApi<{ id: number }[]>('/extra'))
    await waitFor(() => expect(a.result.current.data).toEqual([{ id: 1 }]))
    await waitFor(() => expect(b.result.current.data).toEqual([{ id: 1 }]))
    expect(get).toHaveBeenCalledTimes(1)

    const c = renderHook(() => useApi<{ id: number }[]>('/extra'))
    expect(c.result.current.loading).toBe(false)
    expect(c.result.current.data).toEqual([{ id: 1 }])
    expect(get).toHaveBeenCalledTimes(1)
  })

  it('reports errors and recovers on refetch', async () => {
    get.mockRejectedValueOnce(new Error('network'))
    const useApi = await load()
    const { result } = renderHook(() => useApi<string[]>('/extra-2'))

    await waitFor(() => expect(result.current.error).toBe(true))
    expect(result.current.loading).toBe(false)

    get.mockResolvedValueOnce({ data: ['ok'] })
    result.current.refetch()
    await waitFor(() => expect(result.current.data).toEqual(['ok']))
    expect(result.current.error).toBe(false)
  })

  describe('build-time snapshot', () => {
    const seed = [{ id: 'snap' }]
    const loadSeeded = async () => {
      vi.doMock('../../data/snapshot.json', () => ({
        default: { projects: seed, techStacks: [], timeline: [], achievements: [] },
      }))
      return load()
    }

    it('renders snapshot data immediately with no loading state, then revalidates', async () => {
      get.mockResolvedValue({ data: [{ id: 'fresh' }] })
      const useApi = await loadSeeded()
      const { result } = renderHook(() => useApi<{ id: string }[]>('/projects'))

      expect(result.current.data).toEqual(seed)
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe(false)

      await waitFor(() => expect(result.current.data).toEqual([{ id: 'fresh' }]))
      expect(get).toHaveBeenCalledTimes(1)
    })

    it('keeps showing the snapshot when the API is unreachable', async () => {
      get.mockRejectedValue(new Error('network'))
      const useApi = await loadSeeded()
      const { result } = renderHook(() => useApi<{ id: string }[]>('/projects'))

      await waitFor(() => expect(get).toHaveBeenCalled())
      await waitFor(() => expect(result.current.error).toBe(true))
      // Consumers only render error UI when there is no data at all.
      expect(result.current.data).toEqual(seed)
      expect(result.current.loading).toBe(false)
    })

    it('has no seed for other paths: they still load normally', async () => {
      get.mockResolvedValue({ data: ['x'] })
      const useApi = await loadSeeded()
      const { result } = renderHook(() => useApi<string[]>('/not-seeded'))
      expect(result.current.loading).toBe(true)
      expect(result.current.data).toBeUndefined()
      await waitFor(() => expect(result.current.data).toEqual(['x']))
    })
  })
})

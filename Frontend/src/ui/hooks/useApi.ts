import { useCallback, useEffect, useState } from "react"
import { publicApi } from "../utils/http"

// Tiny stale-while-revalidate cache for public GET endpoints.
// - Fresh data (< TTL) is served without a request
// - Stale data is rendered immediately and revalidated in the background
// - Concurrent callers share one in-flight request (Home + Projects both need /projects)
const TTL_MS = 60_000

interface Entry {
  data: unknown
  at: number
}

const cache = new Map<string, Entry>()
const inflight = new Map<string, Promise<unknown>>()

const request = (path: string): Promise<unknown> => {
  const existing = inflight.get(path)
  if (existing) return existing
  const p = publicApi
    .get(path)
    .then((res) => {
      cache.set(path, { data: res.data, at: Date.now() })
      return res.data
    })
    .finally(() => inflight.delete(path))
  inflight.set(path, p)
  return p
}

export interface ApiState<T> {
  data: T | undefined
  loading: boolean
  error: boolean
  refetch: () => void
}

export function useApi<T>(path: string): ApiState<T> {
  const cached = cache.get(path)
  const [data, setData] = useState<T | undefined>(cached?.data as T | undefined)
  const [loading, setLoading] = useState(!cached)
  const [error, setError] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const entry = cache.get(path)
    if (entry && Date.now() - entry.at < TTL_MS && attempt === 0) return

    let cancelled = false
    if (!entry) setLoading(true)
    setError(false)
    request(path)
      .then((d) => {
        if (!cancelled) setData(d as T)
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [path, attempt])

  const refetch = useCallback(() => {
    cache.delete(path)
    setAttempt((n) => n + 1)
  }, [path])

  return { data, loading, error, refetch }
}

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const fetchMock = vi.fn()

const reply = (status: number, body?: unknown) =>
  new Response(body === undefined ? null : JSON.stringify(body), { status })

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock)
  vi.stubEnv('VITE_API_URL', 'http://api.test/api/')
  vi.resetModules()
  sessionStorage.clear()
})

afterEach(() => {
  fetchMock.mockReset()
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

describe('http client', () => {
  it('returns { data } and builds the URL from the base without a double slash', async () => {
    fetchMock.mockResolvedValue(reply(200, [{ id: '1' }]))
    const { publicApi } = await import('./http')
    const res = await publicApi.get<{ id: string }[]>('/projects')
    expect(res.data).toEqual([{ id: '1' }])
    expect(fetchMock.mock.calls[0][0]).toBe('http://api.test/api/projects')
  })

  it('sends JSON bodies and the admin bearer token', async () => {
    sessionStorage.setItem('admin_token', 'tok')
    fetchMock.mockResolvedValue(reply(201, { id: '2' }))
    const { adminApi } = await import('./http')
    await adminApi.post('/projects', { title: 'x' })
    const [, init] = fetchMock.mock.calls[0]
    expect(init.method).toBe('POST')
    expect(init.body).toBe('{"title":"x"}')
    expect(init.headers).toMatchObject({ Authorization: 'Bearer tok', 'Content-Type': 'application/json' })
  })

  it('throws an error that exposes response.status and response.data for non-2xx replies', async () => {
    fetchMock.mockResolvedValue(reply(400, { error: 'Validation failed' }))
    const { publicApi } = await import('./http')
    await expect(publicApi.post('/feedback', {})).rejects.toMatchObject({
      response: { status: 400, data: { error: 'Validation failed' } },
    })
  })

  it('handles 204 with no body', async () => {
    fetchMock.mockResolvedValue(reply(204))
    const { adminApi } = await import('./http')
    const res = await adminApi.delete('/projects/1')
    expect(res.status).toBe(204)
    expect(res.data).toBeUndefined()
  })

  it('clears the token and redirects to the login page on 401 from admin calls', async () => {
    sessionStorage.setItem('admin_token', 'tok')
    const assign = vi.fn()
    vi.stubGlobal('location', { pathname: '/admin', assign })
    fetchMock.mockResolvedValue(reply(401, { error: 'Unauthorized' }))
    const { adminApi } = await import('./http')
    await expect(adminApi.get('/auth/me')).rejects.toMatchObject({ response: { status: 401 } })
    expect(sessionStorage.getItem('admin_token')).toBeNull()
    expect(assign).toHaveBeenCalledWith('/admin/login')
  })

  it('does not redirect on 401 from the public client (login failure)', async () => {
    const assign = vi.fn()
    vi.stubGlobal('location', { pathname: '/admin/login', assign })
    fetchMock.mockResolvedValue(reply(401, { error: 'Invalid credentials' }))
    const { publicApi } = await import('./http')
    await expect(publicApi.post('/auth/login', {})).rejects.toMatchObject({ response: { status: 401 } })
    expect(assign).not.toHaveBeenCalled()
  })

  it('aborts after the timeout', async () => {
    vi.useFakeTimers()
    fetchMock.mockImplementation(
      (_url: string, init: RequestInit) =>
        new Promise((_res, rej) => init.signal!.addEventListener('abort', () => rej(new DOMException('aborted', 'AbortError'))))
    )
    const { publicApi } = await import('./http')
    const p = publicApi.get('/slow')
    const assertion = expect(p).rejects.toMatchObject({ code: 'TIMEOUT' })
    await vi.advanceTimersByTimeAsync(75_000)
    await assertion
    vi.useRealTimers()
  })
})

import type React from "react"
import { useState } from "react"
import { apiBase } from "../utils/api"

const ENDPOINTS = ["/projects", "/tech-stacks", "/timeline", "/achievements"] as const

interface Result {
  path: string
  status: number
  ms: number
  bytes: number
  cacheControl: string | null
  etag: string | null
  body: string
}

const PREVIEW_CHARS = 1500

const ApiExplorer: React.FC = () => {
  const [result, setResult] = useState<Result | null>(null)
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const run = async (path: string) => {
    setLoading(path)
    setError(null)
    const started = performance.now()
    try {
      const res = await fetch(`${apiBase}${path}`)
      const text = await res.text()
      let pretty = text
      try {
        pretty = JSON.stringify(JSON.parse(text), null, 2)
      } catch {
        /* not JSON, show as-is */
      }
      setResult({
        path,
        status: res.status,
        ms: Math.round(performance.now() - started),
        bytes: new Blob([text]).size,
        cacheControl: res.headers.get("cache-control"),
        etag: res.headers.get("etag"),
        body: pretty.length > PREVIEW_CHARS ? `${pretty.slice(0, PREVIEW_CHARS)}\n... (${pretty.length - PREVIEW_CHARS} more characters)` : pretty,
      })
    } catch {
      setError("Request failed. The API may be waking up; try again.")
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="rounded-xl border border-gray-700 bg-gray-800/60 p-5">
      <p className="mb-4 text-sm text-gray-400">
        These are the same public endpoints this site uses. Run one and inspect the real response, timing and
        caching headers.
      </p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Endpoints">
        {ENDPOINTS.map((p) => (
          <button
            key={p}
            onClick={() => run(p)}
            disabled={loading !== null}
            className="rounded-lg bg-gray-700 px-3 py-1.5 font-mono text-sm text-indigo-300 hover:bg-gray-600 disabled:opacity-50"
          >
            GET {p}
          </button>
        ))}
      </div>

      <div aria-live="polite" className="mt-4">
        {loading && <p className="text-sm text-gray-400">Requesting {loading}...</p>}
        {error && <p className="text-sm text-red-400">{error}</p>}
        {result && !loading && (
          <>
            <dl className="mb-3 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
              <div>
                <dt className="text-gray-400">Status</dt>
                <dd className={result.status < 400 ? "text-emerald-400" : "text-red-400"}>{result.status}</dd>
              </div>
              <div>
                <dt className="text-gray-400">Time</dt>
                <dd className="text-white">{result.ms} ms</dd>
              </div>
              <div>
                <dt className="text-gray-400">Size</dt>
                <dd className="text-white">{(result.bytes / 1024).toFixed(1)} kB</dd>
              </div>
              <div>
                <dt className="text-gray-400">Cache-Control</dt>
                <dd className="break-words text-white">{result.cacheControl ?? "none"}</dd>
              </div>
              {result.etag && (
                <div className="col-span-2">
                  <dt className="text-gray-400">ETag</dt>
                  <dd className="break-all font-mono text-xs text-white">{result.etag}</dd>
                </div>
              )}
            </dl>
            <pre className="max-h-80 overflow-auto rounded-lg bg-gray-900 p-4 text-xs text-gray-300" tabIndex={0}>
              {result.body}
            </pre>
          </>
        )}
      </div>
    </div>
  )
}

export default ApiExplorer

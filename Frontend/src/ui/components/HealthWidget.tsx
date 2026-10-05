import type React from "react"
import { useCallback, useEffect, useState } from "react"
import { apiOrigin } from "../utils/api"

interface Health {
  status: string
  db?: string
  dbLatencyMs?: number
  uptimeSeconds?: number
}

type State =
  | { kind: "loading" }
  | { kind: "ok" | "degraded"; health: Health; roundTripMs: number; at: Date }
  | { kind: "down"; at: Date }

const formatUptime = (s: number) => {
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  return h > 0 ? `${h}h ${m}m` : `${m}m ${s % 60}s`
}

const HealthWidget: React.FC = () => {
  const [state, setState] = useState<State>({ kind: "loading" })

  const check = useCallback(async () => {
    const started = performance.now()
    try {
      const res = await fetch(`${apiOrigin}/health`, { cache: "no-store" })
      const health: Health = await res.json()
      setState({
        kind: res.ok ? "ok" : "degraded",
        health,
        roundTripMs: Math.round(performance.now() - started),
        at: new Date(),
      })
    } catch {
      setState({ kind: "down", at: new Date() })
    }
  }, [])

  useEffect(() => {
    check()
    const id = setInterval(() => document.visibilityState === "visible" && check(), 30_000)
    return () => clearInterval(id)
  }, [check])

  const color =
    state.kind === "ok" ? "bg-emerald-400" : state.kind === "loading" ? "bg-gray-500 animate-pulse" : "bg-red-400"
  const label =
    state.kind === "ok" ? "Operational" : state.kind === "loading" ? "Checking..." : state.kind === "degraded" ? "Degraded" : "Unreachable"

  return (
    <div className="rounded-xl border border-gray-700 bg-gray-800/60 p-5" aria-live="polite">
      <div className="flex items-center gap-3">
        <span className={`h-3 w-3 rounded-full ${color}`} aria-hidden="true" />
        <h3 className="text-lg font-semibold text-white">API status: {label}</h3>
        <button onClick={check} className="ml-auto text-sm text-indigo-400 hover:text-indigo-300">
          Re-check
        </button>
      </div>
      {(state.kind === "ok" || state.kind === "degraded") && (
        <dl className="mt-4 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
          <div>
            <dt className="text-gray-400">Database</dt>
            <dd className="text-white">{state.health.db ?? "n/a"}</dd>
          </div>
          <div>
            <dt className="text-gray-400">DB query</dt>
            <dd className="text-white">{state.health.dbLatencyMs ?? "n/a"} ms</dd>
          </div>
          <div>
            <dt className="text-gray-400">Round trip (from your browser)</dt>
            <dd className="text-white">{state.roundTripMs} ms</dd>
          </div>
          <div>
            <dt className="text-gray-400">Process uptime</dt>
            <dd className="text-white">{state.health.uptimeSeconds != null ? formatUptime(state.health.uptimeSeconds) : "n/a"}</dd>
          </div>
        </dl>
      )}
      {state.kind === "down" && (
        <p className="mt-3 text-sm text-gray-400">
          The API did not respond. If it is hosted on a free tier it may be waking up; try again in a few seconds.
        </p>
      )}
    </div>
  )
}

export default HealthWidget

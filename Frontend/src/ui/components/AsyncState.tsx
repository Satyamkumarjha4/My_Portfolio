import type React from "react"
import { useEffect, useState } from "react"

export const Skeleton: React.FC<{ className?: string }> = ({ className = "h-40" }) => (
  <div className={`animate-pulse rounded-lg bg-gray-800 ${className}`} aria-hidden="true" />
)

// After a few seconds, explain the likely cause (sleeping free-tier API) instead of
// leaving the visitor looking at an unexplained spinner.
const SLOW_AFTER_MS = 4000

export const LoadingBlock: React.FC<{ label?: string }> = ({ label = "Loading..." }) => {
  const [slow, setSlow] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setSlow(true), SLOW_AFTER_MS)
    return () => clearTimeout(t)
  }, [])
  return (
    <div className="py-16 text-center text-gray-400" role="status" aria-live="polite">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500 mx-auto mb-3" />
      {label}
      {slow && (
        <p className="mt-2 text-sm text-gray-500">
          The API is waking up from sleep on free hosting. This can take up to a minute on the first visit.
        </p>
      )}
    </div>
  )
}

export const ErrorBlock: React.FC<{ message?: string; onRetry?: () => void }> = ({
  message = "Something went wrong while loading this section.",
  onRetry,
}) => (
  <div className="py-12 text-center text-gray-300" role="alert">
    <p className="mb-4">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2 rounded-full transition-colors"
      >
        Try again
      </button>
    )}
  </div>
)

export const EmptyBlock: React.FC<{ message: string }> = ({ message }) => (
  <div className="py-12 text-center text-gray-400">{message}</div>
)

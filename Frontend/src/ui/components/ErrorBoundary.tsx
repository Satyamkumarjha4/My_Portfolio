import { Component, type ErrorInfo, type ReactNode } from "react"

interface Props {
  children: ReactNode
  // When this value changes (e.g. the route), a previously caught error is cleared.
  resetKey?: string
}

interface State {
  failed: boolean
}

// Catches render errors below it so one broken component shows a message
// instead of a blank page.
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Render error:", error, info.componentStack)
  }

  componentDidUpdate(prev: Props) {
    if (this.state.failed && prev.resetKey !== this.props.resetKey) {
      this.setState({ failed: false })
    }
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div
        role="alert"
        className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white gap-4 px-6 text-center"
      >
        <h1 className="text-3xl font-bold">Something went wrong</h1>
        <p className="text-gray-400">An unexpected error occurred while showing this page.</p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="bg-indigo-500 hover:bg-indigo-600 px-5 py-2 rounded-full"
          >
            Reload
          </button>
          <a href="/" className="bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded-full">
            Back home
          </a>
        </div>
      </div>
    )
  }
}

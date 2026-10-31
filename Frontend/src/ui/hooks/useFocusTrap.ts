import { useEffect, useRef } from "react"

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])'

// Modal focus management:
// - moves focus into the dialog when it opens
// - keeps Tab / Shift+Tab inside it
// - returns focus to the element that opened it when it closes
// Attach the returned ref to the dialog container (give it tabIndex={-1}).
export function useFocusTrap<T extends HTMLElement>(active = true) {
  const ref = useRef<T>(null)

  useEffect(() => {
    if (!active) return
    const node = ref.current
    if (!node) return

    const opener = document.activeElement as HTMLElement | null
    const focusables = () => Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE))

    ;(focusables()[0] ?? node).focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return
      const els = focusables()
      if (els.length === 0) {
        e.preventDefault()
        node.focus()
        return
      }
      const first = els[0]
      const last = els[els.length - 1]
      const current = document.activeElement
      const outside = !node.contains(current)
      if (e.shiftKey && (current === first || outside)) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && (current === last || outside)) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      if (opener && document.contains(opener)) opener.focus()
    }
  }, [active])

  return ref
}

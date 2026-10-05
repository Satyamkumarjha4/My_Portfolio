import { useEffect } from "react"

const SITE = "Satyam Kumar Jha"

// Per-route <title> and description for a client-rendered SPA.
export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE}` : `${SITE} - Full-Stack & AI/ML Developer`
    if (description) {
      document.querySelector('meta[name="description"]')?.setAttribute("content", description)
    }
  }, [title, description])
}

import { useEffect } from "react"
import { site } from "../../config/site"
import pages from "../../config/pages.json"

// Title/description/canonical/OG for a route come from src/config/pages.json, the
// same file the build uses to write each route's static HTML head
// (scripts/route-pages.mjs). The static head covers the first load; this keeps
// the tags in step when the user navigates inside the SPA.
const setAttr = (selector: string, attr: string, value: string) =>
  document.querySelector(selector)?.setAttribute(attr, value)

export function usePageMeta(path: string) {
  useEffect(() => {
    const page = pages.find((p) => p.path === path)
    if (!page) return
    const url = `${site.url}${page.path}`
    document.title = page.title
    setAttr('meta[name="description"]', "content", page.description)
    setAttr('link[rel="canonical"]', "href", url)
    setAttr('meta[property="og:title"]', "content", page.title)
    setAttr('meta[property="og:description"]', "content", page.description)
    setAttr('meta[property="og:url"]', "content", url)
    setAttr('meta[name="twitter:title"]', "content", page.title)
    setAttr('meta[name="twitter:description"]', "content", page.description)
  }, [path])
}

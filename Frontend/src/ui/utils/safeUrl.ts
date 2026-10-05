// Only http(s) links and same-site paths may be rendered as href/src.
// Guards against javascript:/data: URLs coming from CMS content.
export const safeUrl = (value: string | null | undefined): string => {
  if (!value) return "#"
  if (value.startsWith("/") && !value.startsWith("//")) return value
  try {
    const { protocol } = new URL(value)
    return protocol === "http:" || protocol === "https:" ? value : "#"
  } catch {
    return "#"
  }
}

// The API root without the trailing /api, used for /health.
const base = (import.meta.env.VITE_API_URL as string | undefined) ?? ""

export const apiBase = base.replace(/\/+$/, "")
export const apiOrigin = apiBase.replace(/\/api$/, "")

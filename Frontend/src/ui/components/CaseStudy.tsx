import type React from "react"

// Renders a plain-text case study safely (no HTML injection):
// blank line = paragraph, a line starting with "## " = heading.
const blocks = (text: string) =>
  text
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean)
    .map((b) => (b.startsWith("## ") ? { heading: true, text: b.slice(3) } : { heading: false, text: b }))

export const CaseStudy: React.FC<{ text: string; title: string }> = ({ text, title }) => (
  <details className="group border-t border-gray-700 px-6 py-4">
    <summary className="cursor-pointer select-none text-sm font-semibold text-indigo-400 hover:text-indigo-300 focus-visible:outline-2">
      Read the case study: how and why {title} was built
    </summary>
    <div className="mt-4 max-w-3xl space-y-3">
      {blocks(text).map((b, i) =>
        b.heading ? (
          <h4 key={i} className="pt-2 text-lg font-semibold text-white">
            {b.text}
          </h4>
        ) : (
          <p key={i} className="whitespace-pre-line leading-relaxed text-gray-300">
            {b.text}
          </p>
        ),
      )}
    </div>
  </details>
)

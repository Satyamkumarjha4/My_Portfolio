import type React from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import ArchitectureDiagram from "../components/ArchitectureDiagram"
import HealthWidget from "../components/HealthWidget"
import ApiExplorer from "../components/ApiExplorer"
import { usePageMeta } from "../hooks/usePageMeta"
import { site } from "../../config/site"

const REPO = site.github.repoUrl

const decisions = [
  {
    title: "Authentication",
    body: "Admin login is verified on the server (bcrypt + short-lived JWT). An earlier version shipped the admin token in the client bundle; it was found in an audit and replaced. No secret reaches the browser.",
    doc: "docs/decisions/0001-jwt-in-session-storage.md",
  },
  {
    title: "Validation and errors",
    body: "Every write goes through a zod schema that whitelists fields, caps lengths and only accepts http(s) URLs. One error handler turns Prisma/zod errors into stable responses and never leaks internals.",
    doc: "docs/security.md",
  },
  {
    title: "Caching, without Redis",
    body: "Content endpoints send Cache-Control with stale-while-revalidate and ETags; the client shares one in-flight request per resource. The data is tiny, so a cache server would add cost without a measurable win.",
    doc: "docs/decisions/0003-no-redis.md",
  },
  {
    title: "Tested and automated",
    body: "API tests cover auth on every write route, validation and error mapping; UI tests cover the data hook and the feedback form. CI runs lint, tests and a production build on every push.",
    doc: "docs/testing.md",
  },
]

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="mb-14">
    <h2 className="mb-5 text-2xl font-bold text-white md:text-3xl">{title}</h2>
    {children}
  </section>
)

const Status: React.FC = () => {
  usePageMeta("/status")

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <main id="main-content" tabIndex={-1} className="mx-auto max-w-5xl px-6 pb-20 pt-28 focus:outline-none">
        <header className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            Under the <span className="text-indigo-500">hood</span>
          </h1>
          <p className="mx-auto max-w-2xl text-gray-300">
            This portfolio is a small production system, not just a page. Here is the live backend, the request path,
            and the decisions behind it.
          </p>
        </header>

        <Section title="Live status">
          <HealthWidget />
        </Section>

        <Section title="Architecture">
          <div className="rounded-xl border border-gray-700 bg-gray-800/40 p-4">
            <ArchitectureDiagram />
          </div>
        </Section>

        <Section title="Try the API">
          <ApiExplorer />
        </Section>

        <Section title="Engineering decisions">
          <div className="grid gap-4 md:grid-cols-2">
            {decisions.map((d) => (
              <article key={d.title} className="rounded-xl border border-gray-700 bg-gray-800/60 p-5">
                <h3 className="mb-2 text-lg font-semibold text-white">{d.title}</h3>
                <p className="mb-3 text-sm leading-relaxed text-gray-300">{d.body}</p>
                <a
                  href={`${REPO}/blob/main/${d.doc}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-indigo-400 hover:text-indigo-300"
                >
                  Read more in the docs
                </a>
              </article>
            ))}
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  )
}

export default Status

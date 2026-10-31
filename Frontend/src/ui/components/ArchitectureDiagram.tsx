import type React from "react"

// Static diagram of the real request path (see docs/architecture.md).
const Box: React.FC<{ x: number; y: number; w: number; h: number; title: string; lines: string[] }> = ({
  x,
  y,
  w,
  h,
  title,
  lines,
}) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={12} className="fill-gray-800 stroke-indigo-500/50" strokeWidth={1.5} />
    <text x={x + w / 2} y={y + 28} textAnchor="middle" className="fill-white text-[15px] font-semibold">
      {title}
    </text>
    {lines.map((l, i) => (
      <text key={l} x={x + w / 2} y={y + 52 + i * 18} textAnchor="middle" className="fill-gray-400 text-[12px]">
        {l}
      </text>
    ))}
  </g>
)

const Arrow: React.FC<{ x1: number; x2: number; y: number; label: string }> = ({ x1, x2, y, label }) => (
  <g>
    <line x1={x1} y1={y} x2={x2} y2={y} className="stroke-indigo-400" strokeWidth={2} markerEnd="url(#arrow)" />
    <text x={(x1 + x2) / 2} y={y - 8} textAnchor="middle" className="fill-indigo-300 text-[11px]">
      {label}
    </text>
  </g>
)

const ArchitectureDiagram: React.FC = () => (
  <svg
    viewBox="0 0 900 230"
    role="img"
    aria-labelledby="arch-title arch-desc"
    className="w-full h-auto"
  >
    <title id="arch-title">System architecture</title>
    <desc id="arch-desc">
      A React single page app on Vercel calls an Express API, which uses Prisma to query PostgreSQL. The API applies
      security headers, CORS, rate limiting, JWT authentication and schema validation before each handler.
    </desc>
    <defs>
      <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
        <path d="M0,0 L8,4 L0,8 z" className="fill-indigo-400" />
      </marker>
    </defs>
    <Box x={10} y={50} w={220} h={120} title="React SPA" lines={["Vite + TypeScript", "route-level code splitting", "SWR-style data cache"]} />
    <Arrow x1={232} x2={338} y={96} label="HTTPS + JSON" />
    <Arrow x1={338} x2={232} y={140} label="cached 60s" />
    <Box
      x={340}
      y={20}
      w={220}
      h={180}
      title="Express 5 API"
      lines={["helmet, CORS allowlist", "rate limiting", "JWT auth (admin writes)", "zod validation", "central error handler", "pino logs"]}
    />
    <Arrow x1={562} x2={668} y={110} label="Prisma" />
    <Box x={670} y={50} w={220} h={120} title="PostgreSQL" lines={["parameterised queries", "CHECK constraints", "migrations in git"]} />
  </svg>
)

export default ArchitectureDiagram

import { NavLink } from 'react-router-dom'
import { cn } from '../lib/cn'

const links = [
  { to: '/', label: 'Specimen', end: true },
  { to: '/components', label: 'Components' },
  { to: '/pipeline', label: 'Pipeline' },
]

export function SiteHeader() {
  return (
    <header className="border-b border-[var(--shell-ecru)]/25 bg-[var(--shell-ink)]">
      <div className="mx-auto flex max-w-6xl flex-col-reverse items-start gap-2 px-6 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-6 sm:gap-y-2">
        <NavLink to="/" className="min-w-0 font-display leading-tight tracking-wide text-[var(--shell-paper)]">
          <span className="text-lg sm:text-xl">Neja</span>
          <span className="text-[var(--shell-seal)]"> / </span>
          <span className="text-sm text-[var(--shell-ecru)] sm:text-xl sm:text-[var(--shell-paper)]">
            a dictionary of color combinations
          </span>
        </NavLink>
        <nav className="flex shrink-0 flex-wrap gap-x-5 gap-y-1 font-mono text-[11px] uppercase tracking-wider sm:gap-6 sm:text-xs sm:tracking-widest">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                cn(
                  'text-[var(--shell-ecru)] transition-colors hover:text-[var(--shell-paper)]',
                  isActive && 'text-[var(--shell-seal)]',
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}

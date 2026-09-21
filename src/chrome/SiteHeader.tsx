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
        <NavLink to="/" className="min-w-0 font-display text-xl tracking-wide text-[var(--shell-paper)]">
          Neja <span className="text-[var(--shell-seal)]">/</span> a dictionary of color combinations
        </NavLink>
        <nav className="flex shrink-0 gap-6 font-mono text-xs uppercase tracking-widest">
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

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
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <NavLink to="/" className="font-display text-xl tracking-wide text-[var(--shell-paper)]">
          Neja <span className="text-[var(--shell-seal)]">/</span> a dictionary of color combinations
        </NavLink>
        <nav className="flex gap-6 font-mono text-xs uppercase tracking-widest">
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

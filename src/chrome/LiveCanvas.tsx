const ROLES: { role: string; var: string }[] = [
  { role: 'background', var: '--color-background' },
  { role: 'surface', var: '--color-surface' },
  { role: 'text', var: '--color-text' },
  { role: 'primary', var: '--color-primary' },
  { role: 'secondary', var: '--color-secondary' },
  { role: 'accent', var: '--color-accent' },
  { role: 'border', var: '--color-border' },
]

/**
 * The specimen-sheet panel: renders the live semantic token roles as
 * labeled chips, styled like a real dictionary page. This is what proves
 * the palette switcher is actually rewriting CSS vars, not just decoration —
 * every chip here reads var(--color-*) directly, nothing hardcoded.
 */
export function LiveCanvas() {
  return (
    <div
      className="rounded-[var(--radius-lg)] border border-[var(--shell-ecru)]/30 p-6"
      style={{ background: 'var(--color-background)' }}
    >
      <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--color-text)' }}>
        Live token canvas
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {ROLES.map((r) => (
          <div key={r.role} className="flex flex-col overflow-hidden rounded-[var(--radius-md)]">
            <div className="h-16" style={{ background: `var(${r.var})` }} />
            <div
              className="px-2 py-1.5 font-mono text-[10px]"
              style={{ background: 'var(--color-surface)', color: 'var(--color-text)' }}
            >
              {r.role}
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="mt-6 rounded-[var(--radius-md)] px-4 py-2 font-sans text-sm font-medium transition-transform hover:-translate-y-0.5"
        style={{ background: 'var(--color-primary)', color: 'var(--color-primary-foreground)' }}
      >
        Primary action
      </button>
    </div>
  )
}

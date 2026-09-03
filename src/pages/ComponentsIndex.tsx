import { Link } from 'react-router-dom'

const COMPONENTS = [
  { name: 'Button', status: 'documented', link: '/components/button' },
  { name: 'Card', status: 'documented', link: '/components/card' },
  { name: 'Badge', status: 'documented', link: '/components/badge' },
  { name: 'Input', status: 'documented', link: '/components/input' },
  { name: 'Callout', status: 'documented', link: '/components/callout' },
]

export function ComponentsIndex() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-display text-3xl text-[var(--shell-paper)]">Components</h1>
      <p className="mt-2 max-w-xl font-sans text-sm text-[var(--shell-ecru)]">
        Every component below is built by the pipeline described in{' '}
        <Link to="/pipeline" className="underline decoration-[var(--shell-seal)] underline-offset-2">
          /pipeline
        </Link>
        , not written by hand. Status mirrors <code className="font-mono text-xs">IMPLEMENTATION_STATUS.md</code>.
      </p>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {COMPONENTS.map((component) =>
          component.link ? (
            <Link key={component.name} to={component.link}>
              <li className="rounded-[var(--radius-lg)] border border-[var(--shell-ecru)]/25 bg-[var(--shell-ink)] p-5 hover:border-[var(--shell-ecru)]/50 transition-colors">
                <p className="font-display text-xl text-[var(--shell-paper)]">{component.name}</p>
                <p className="mt-1 font-mono text-xs text-[var(--shell-ecru)]">{component.status}</p>
              </li>
            </Link>
          ) : (
            <li
              key={component.name}
              className="rounded-[var(--radius-lg)] border border-[var(--shell-ecru)]/25 bg-[var(--shell-ink)] p-5"
            >
              <p className="font-display text-xl text-[var(--shell-paper)]">{component.name}</p>
              <p className="mt-1 font-mono text-xs text-[var(--shell-ecru)]">{component.status}</p>
            </li>
          ),
        )}
      </ul>
    </div>
  )
}

const STAGES = [
  { n: '01', name: 'palette-curator', model: 'haiku', does: 'Selects a Wada combination, resolves semantic tokens.' },
  { n: '02', name: 'component-builder', model: 'sonnet', does: 'Builds the TSX + variant meta from the palette handoff.' },
  { n: '03', name: 'doc-writer', model: 'haiku', does: 'Generates the style-guide page from the component meta.' },
  { n: '04', name: 'visual-reviewer', model: 'opus', does: 'Re-checks contrast, palette, states — approves or rejects.' },
]

export function PipelinePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-display text-3xl text-[var(--shell-paper)]">The pipeline</h1>
      <p className="mt-2 max-w-2xl font-sans text-sm leading-relaxed text-[var(--shell-ecru)]">
        Four native Claude Code subagents, chained by explicit JSON handoffs, each pinned to a model chosen for what
        the stage actually needs — not the strongest model everywhere. Full rationale in{' '}
        <code className="font-mono text-xs">docs/agents/model-selection.md</code>.
      </p>

      <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAGES.map((s) => (
          <li
            key={s.n}
            className="flex flex-col rounded-[var(--radius-lg)] border border-[var(--shell-ecru)]/25 bg-[var(--shell-ink)] p-5"
          >
            <span className="font-mono text-xs text-[var(--shell-seal)]">{s.n}</span>
            <span className="mt-2 font-display text-lg text-[var(--shell-paper)]">{s.name}</span>
            <span className="mt-1 inline-block w-fit rounded-full border border-[var(--shell-jade)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[var(--shell-jade)]">
              {s.model}
            </span>
            <p className="mt-3 font-sans text-xs leading-relaxed text-[var(--shell-ecru)]">{s.does}</p>
          </li>
        ))}
      </ol>

      <p className="mt-6 font-mono text-xs text-[var(--shell-ecru)]">
        A rejection from 04 routes back to 02, capped at 3 loops — see docs/agents/pipeline.md.
      </p>

      <h2 className="mt-16 font-display text-2xl text-[var(--shell-paper)]">Guardrails enforced in code</h2>
      <ul className="mt-4 space-y-2 font-sans text-sm text-[var(--shell-ecru)]">
        <li>
          <code className="font-mono text-xs text-[var(--shell-paper)]">scripts/validate-palette.ts</code> — fails
          the commit if any hex outside Wada's 159 colors appears in <code>src/tokens</code> or{' '}
          <code>src/components</code>.
        </li>
        <li>
          <code className="font-mono text-xs text-[var(--shell-paper)]">scripts/hooks/guard-commit.mjs</code> —
          Claude Code pre-commit hook rejecting oversized commit messages and re-running the palette validator.
        </li>
      </ul>
    </div>
  )
}

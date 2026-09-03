import { useState } from 'react'

/**
 * Shared Preview/Code panel used on every component doc page. Extracted
 * from five near-identical local copies (Button/Card/Badge/Input/Callout
 * doc pages each had their own) — see IMPLEMENTATION_STATUS.md and
 * docs/agents/pipeline.md for why doc-writer built the local stand-in
 * first and this extraction happened as a follow-up, not inline.
 *
 * The panel owns only its own chrome (tabs, code block, copy button) —
 * the actual live preview content is the caller's `children`, since that's
 * always component-specific.
 */
export function PreviewCodePanel({ code, children }: { code: string; children: React.ReactNode }) {
  const [view, setView] = useState<'preview' | 'code'>('preview')
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--shell-ecru)]/25 bg-[var(--shell-ink)]">
      <div className="flex gap-1 border-b border-[var(--shell-ecru)]/25 p-3">
        <button
          type="button"
          onClick={() => setView('preview')}
          className={`rounded px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${
            view === 'preview'
              ? 'bg-[var(--color-surface)] text-[var(--color-text)]'
              : 'text-[var(--shell-ecru)] hover:text-[var(--shell-paper)]'
          }`}
        >
          Preview
        </button>
        <button
          type="button"
          onClick={() => setView('code')}
          className={`rounded px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${
            view === 'code'
              ? 'bg-[var(--color-surface)] text-[var(--color-text)]'
              : 'text-[var(--shell-ecru)] hover:text-[var(--shell-paper)]'
          }`}
        >
          Code
        </button>
      </div>

      <div className="p-6">
        {view === 'preview' ? (
          <div className="flex min-h-[120px] items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-background)]">
            {children}
          </div>
        ) : (
          <div className="space-y-3">
            <pre className="overflow-x-auto rounded-[var(--radius-md)] bg-[var(--color-background)] p-4">
              <code className="font-mono text-xs text-[var(--color-text)]">{code}</code>
            </pre>
            <button
              type="button"
              onClick={handleCopy}
              className="rounded bg-[var(--color-primary)] px-3 py-1.5 text-xs font-medium text-[var(--color-primary-foreground)] transition-colors hover:bg-[var(--color-primary)]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
            >
              {copied ? 'Copied' : 'Copy to clipboard'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

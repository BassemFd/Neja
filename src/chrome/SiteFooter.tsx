export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--shell-ecru)]/25 bg-[var(--shell-ink)] py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-1 px-6 font-mono text-xs text-[var(--shell-ecru)]">
        <p>
          Colors: Sanzo Wada, <em>A Dictionary of Color Combinations</em> (c. 1933) — dataset by{' '}
          <a
            href="https://github.com/mattdesl/dictionary-of-colour-combinations"
            className="text-[var(--shell-paper)] underline decoration-[var(--shell-seal)] underline-offset-2"
          >
            mattdesl
          </a>
          .
        </p>
        <p>Built by a four-stage Claude Code agent pipeline. See /pipeline.</p>
        <p className="mt-2 text-[var(--shell-paper)]">
          Created by{' '}
          <a
            href="https://career-log.bassem-fayed.workers.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-[var(--shell-seal)] underline-offset-2"
          >
            Bassem Fayed
          </a>{' '}
          with <span aria-hidden="true">♥</span>
          <span className="sr-only">love</span>
        </p>
      </div>
    </footer>
  )
}

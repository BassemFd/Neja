import { FONT_THEMES } from '../lib/fonts'
import { useFontTheme } from '../lib/FontProvider'
import { cn } from '../lib/cn'

/**
 * Type specimen shelf — same interaction shape as SwatchShelf, applied to
 * typography: pick a card, every --font-* CSS var rewrites live. Each card
 * renders its OWN trio regardless of the currently active theme, so you're
 * always comparing real rendered specimens, not a description of one.
 */
export function FontShelf() {
  const { fontTheme, setFontThemeId } = useFontTheme()

  return (
    <div className="w-full">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="font-display text-lg text-[var(--shell-paper)]">Type play</h2>
        <p className="font-mono text-xs text-[var(--shell-ecru)]">{FONT_THEMES.length} pairings</p>
      </div>
      <div role="radiogroup" aria-label="Font pairing" className="grid gap-3 sm:grid-cols-2">
        {FONT_THEMES.map((theme) => {
          const isActive = theme.id === fontTheme.id
          return (
            <button
              key={theme.id}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => setFontThemeId(theme.id)}
              className={cn(
                'flex flex-col items-start rounded-[var(--radius-lg)] border p-5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shell-seal)]',
                isActive
                  ? 'border-[var(--shell-seal)] bg-[var(--shell-ink)]'
                  : 'border-[var(--shell-ecru)]/25 bg-[var(--shell-ink)] hover:border-[var(--shell-ecru)]/50',
              )}
            >
              <span
                className="text-3xl leading-tight text-[var(--shell-paper)]"
                style={{ fontFamily: theme.display }}
              >
                Aa Bb — {theme.name}
              </span>
              <span className="mt-2 text-sm text-[var(--shell-ecru)]" style={{ fontFamily: theme.sans }}>
                {theme.mood}
              </span>
              <span className="mt-3 text-xs text-[var(--shell-ecru)]" style={{ fontFamily: theme.mono }}>
                const combo = &quot;{theme.id}&quot;
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

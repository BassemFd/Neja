import { usePalette } from '../lib/PaletteProvider'
import { resolvePalette } from '../lib/palette'
import { cn } from '../lib/cn'

/**
 * Persistent bottom bar, visible on every page (mounted once in App's
 * Shell) — a compact, always-reachable version of the swatch shelf so the
 * palette can be changed without scrolling back to the home page.
 *
 * The dock's own chrome (background/border/label) reads the *active*
 * --color-* tokens, not the fixed --shell-* brand colors — so the bar
 * itself re-themes the instant a new combination is picked, the same way
 * the Live Canvas does. Each pip still previews its *own* candidate
 * combination's colors (background/primary/accent), since that's what
 * makes picking one meaningful — only the dock's surrounding chrome
 * follows the currently active theme.
 */
export function PaletteDock() {
  const { comboId, accessibleCombinations, setComboId } = usePalette()

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t backdrop-blur transition-colors"
      style={{
        background: 'color-mix(in srgb, var(--color-background) 95%, transparent)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="flex items-center gap-2 overflow-x-auto px-4 py-2">
        <span
          className="shrink-0 font-mono text-[10px] uppercase tracking-[0.2em]"
          style={{ color: 'var(--color-text)' }}
        >
          Palette
        </span>
        {accessibleCombinations.map((id) => {
          const isActive = id === comboId
          const combo = resolvePalette(id)
          return (
            <button
              key={id}
              type="button"
              aria-label={`Switch to Wada combination No. ${id}`}
              aria-pressed={isActive}
              onClick={() => setComboId(id)}
              className={cn(
                'flex h-7 w-7 shrink-0 overflow-hidden rounded-full border-2 transition-transform focus-visible:outline-2 focus-visible:outline-offset-2',
                isActive ? 'scale-110' : 'border-transparent hover:scale-105',
              )}
              style={{
                borderColor: isActive ? 'var(--color-primary)' : undefined,
                outlineColor: 'var(--color-accent)',
              }}
              title={`No. ${id}`}
            >
              <span className="flex-1" style={{ background: combo.tokens.background }} />
              <span className="flex-1" style={{ background: combo.tokens.primary }} />
              <span className="flex-1" style={{ background: combo.tokens.accent }} />
            </button>
          )
        })}
      </div>
    </div>
  )
}

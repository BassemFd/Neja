import { usePalette } from '../lib/PaletteProvider'
import { useFontTheme } from '../lib/FontProvider'
import { resolvePalette } from '../lib/palette'
import { FONT_THEMES } from '../lib/fonts'
import { cn } from '../lib/cn'

/**
 * The two persistent theme switchers, mounted once in App's Shell and visible
 * on every page. Both read the *active* --color-* tokens for their own chrome
 * (background/border/ring), not the fixed --shell-* brand colors, so they
 * re-theme the instant a new combination is picked. Each palette pip previews
 * its OWN candidate combination's colors, which is what makes picking one
 * meaningful.
 *
 * Layout is responsive because the desktop bottom bar was already fine — only
 * mobile was cramped:
 *  - Desktop (sm+): one bottom bar — palette scrolls on the left, type chips
 *    pinned on the right. The left rail is hidden.
 *  - Mobile (<sm): palette moves to a vertical rail pinned LEFT that scrolls
 *    on its own, so it stops competing with type for the narrow bottom strip;
 *    the bottom bar then carries type chips only.
 */
export function PaletteDock() {
  const { comboId, accessibleCombinations, setComboId } = usePalette()
  const { fontTheme, setFontThemeId } = useFontTheme()

  const chrome = {
    background: 'color-mix(in srgb, var(--color-background) 95%, transparent)',
    borderColor: 'var(--color-border)',
  }

  // Same pip elements reused in both the mobile left rail and the desktop
  // bottom bar — only their container's flex direction differs.
  const pips = accessibleCombinations.map((id) => {
    const isActive = id === comboId
    const combo = resolvePalette(id)
    return (
      <button
        key={id}
        type="button"
        role="radio"
        aria-checked={isActive}
        aria-label={`Wada combination No. ${id}`}
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
  })

  const typeChips = FONT_THEMES.map((theme) => {
    const isActive = theme.id === fontTheme.id
    return (
      <button
        key={theme.id}
        type="button"
        role="radio"
        aria-checked={isActive}
        onClick={() => setFontThemeId(theme.id)}
        title={theme.name}
        className="shrink-0 whitespace-nowrap rounded-full border px-3 py-1 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{
          fontFamily: theme.display,
          color: 'var(--color-text)',
          borderColor: isActive ? 'var(--color-primary)' : 'var(--color-border)',
          background: isActive
            ? 'color-mix(in srgb, var(--color-primary) 15%, transparent)'
            : 'transparent',
          outlineColor: 'var(--color-accent)',
        }}
      >
        {theme.short}
      </button>
    )
  })

  return (
    <>
      {/* MOBILE ONLY: full-height left palette column, bottom-to-top, scrolls
          on its own. Square (no rounded corners); the Shell pads its content
          left by the same width (see App.tsx) so this pushes everything right
          instead of overlaying it. */}
      <div
        role="radiogroup"
        aria-label="Palette"
        className="fixed inset-y-0 left-0 z-40 flex w-12 flex-col items-center gap-2 overflow-y-auto border-r py-2 backdrop-blur transition-colors sm:hidden"
        style={chrome}
      >
        {pips}
      </div>

      {/* Bottom bar. Desktop: palette (scroll) + type. Mobile: type only,
          starting after the left column (left-12) so they don't overlap. */}
      <div
        className="fixed bottom-0 left-12 right-0 z-40 border-t backdrop-blur transition-colors sm:left-0"
        style={chrome}
      >
        <div className="flex items-center gap-3 px-4 py-2">
          {/* Palette region — desktop only (mobile uses the left rail). */}
          <div className="hidden min-w-0 flex-1 items-center gap-2 overflow-x-auto sm:flex">
            <div role="radiogroup" aria-label="Palette" className="flex items-center gap-2">
              {pips}
            </div>
          </div>
          <span
            className="hidden h-5 w-px shrink-0 sm:block"
            style={{ background: 'var(--color-border)' }}
            aria-hidden="true"
          />

          <span
            className="hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] sm:inline-block"
            style={{ color: 'var(--color-text)' }}
          >
            Type
          </span>
          {/* Mobile: chips fill the bar, spread with justify-between so the row
              reads balanced. Desktop: pinned right next to the palette. */}
          <div
            role="radiogroup"
            aria-label="Type pairing"
            className="flex flex-1 items-center justify-between gap-1.5 sm:flex-none sm:shrink-0 sm:justify-start sm:overflow-x-auto"
          >
            {typeChips}
          </div>
        </div>
      </div>
    </>
  )
}

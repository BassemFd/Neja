import { useEffect, useState } from 'react'
import { usePalette } from '../lib/PaletteProvider'
import { useFontTheme } from '../lib/FontProvider'
import { resolvePalette } from '../lib/palette'
import { FONT_THEMES } from '../lib/fonts'
import { cn } from '../lib/cn'

/**
 * The two persistent theme switchers, mounted once in App's Shell and visible
 * on every page. Both read the *active* --color-* tokens for their own chrome
 * (background/border/ring), not the fixed --shell-* brand colors, so they
 * re-theme the instant a new combination is picked.
 *
 *  - Desktop (sm+): unchanged — one bottom bar, palette scrolls on the left,
 *    type chips pinned on the right.
 *  - Mobile (<sm): a single soft floating pill in the thumb zone shows the
 *    *current* palette + type and opens a rounded bottom sheet with the full,
 *    labeled lists. The page re-themes live behind the translucent sheet, so
 *    the magic stays visible while the long list stops competing with content.
 */
export function PaletteDock() {
  const { comboId, palette, accessibleCombinations, setComboId } = usePalette()
  const { fontTheme, setFontThemeId } = useFontTheme()
  // Which drawer is open on mobile — palette and type are separate sheets,
  // opened by tapping their own half of the pill. null = closed.
  const [sheet, setSheet] = useState<null | 'palette' | 'type'>(null)

  // While a sheet is open: close on Escape, and lock body scroll so the
  // page behind doesn't scroll under it.
  useEffect(() => {
    if (!sheet) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSheet(null)
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [sheet])

  const chrome = {
    background: 'color-mix(in srgb, var(--color-background) 95%, transparent)',
    borderColor: 'var(--color-border)',
  }

  // A single palette pip — reused in the desktop bar and the mobile sheet.
  // `size` lets the sheet render larger, thumb-friendly targets.
  const pip = (id: number, size: 'sm' | 'lg' = 'sm') => {
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
          'flex shrink-0 overflow-hidden rounded-full border-2 transition-transform focus-visible:outline-2 focus-visible:outline-offset-2',
          size === 'lg' ? 'h-10 w-10' : 'h-7 w-7',
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
  }

  const typeChip = (theme: (typeof FONT_THEMES)[number], full = false) => {
    const isActive = theme.id === fontTheme.id
    return (
      <button
        key={theme.id}
        type="button"
        role="radio"
        aria-checked={isActive}
        onClick={() => setFontThemeId(theme.id)}
        title={theme.name}
        className={cn(
          'shrink-0 whitespace-nowrap rounded-full border px-3 py-1 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2',
          full && 'w-full py-2.5 text-sm',
        )}
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
        {full ? theme.name : theme.short}
      </button>
    )
  }

  return (
    <>
      {/* ----------------------------- MOBILE ----------------------------- */}
      {/* One floating pill in the thumb zone, split into two tappable zones:
          the palette half opens the colours drawer, the type half opens the
          fonts drawer. Each shows its own current selection. */}
      <div
        className="fixed inset-x-4 bottom-4 z-40 flex items-stretch rounded-full border shadow-lg backdrop-blur transition-colors sm:hidden"
        style={chrome}
      >
        <button
          type="button"
          onClick={() => setSheet('palette')}
          aria-haspopup="dialog"
          aria-expanded={sheet === 'palette'}
          aria-label="Choose a colour combination"
          className="flex flex-1 items-center gap-2.5 rounded-l-full py-2.5 pl-4 pr-3 focus-visible:outline-2 focus-visible:-outline-offset-2"
          style={{ outlineColor: 'var(--color-accent)' }}
        >
          <span
            className="flex h-6 w-6 shrink-0 overflow-hidden rounded-full border"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <span className="flex-1" style={{ background: palette.tokens.background }} />
            <span className="flex-1" style={{ background: palette.tokens.primary }} />
            <span className="flex-1" style={{ background: palette.tokens.accent }} />
          </span>
          <span className="font-mono text-xs" style={{ color: 'var(--color-text)' }}>
            No. {comboId}
          </span>
        </button>
        <span className="my-2 w-px shrink-0" style={{ background: 'var(--color-border)' }} aria-hidden />
        <button
          type="button"
          onClick={() => setSheet('type')}
          aria-haspopup="dialog"
          aria-expanded={sheet === 'type'}
          aria-label="Choose a type pairing"
          className="flex flex-1 items-center gap-2 rounded-r-full py-2.5 pl-3 pr-4 focus-visible:outline-2 focus-visible:-outline-offset-2"
          style={{ outlineColor: 'var(--color-accent)' }}
        >
          <span className="truncate text-sm" style={{ fontFamily: fontTheme.display, color: 'var(--color-text)' }}>
            {fontTheme.name}
          </span>
          <span
            className="ml-auto font-mono text-[10px] uppercase tracking-widest opacity-60"
            style={{ color: 'var(--color-text)' }}
          >
            Aa
          </span>
        </button>
      </div>

      {/* Backdrop + bottom sheet. One sheet, content switches on which drawer
          was opened. */}
      {sheet && (
        <div
          className="fixed inset-0 z-50 sm:hidden"
          role="dialog"
          aria-modal="true"
          aria-label={sheet === 'palette' ? 'Colour combination' : 'Type pairing'}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setSheet(null)}
            className="absolute inset-0 bg-[var(--shell-ink)]/50 backdrop-blur-[2px] motion-safe:animate-[fadeIn_150ms_ease-out]"
          />
          <div
            className="absolute inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto overscroll-contain rounded-t-[1.75rem] border-t px-5 pb-8 pt-3 shadow-2xl motion-safe:animate-[sheetUp_220ms_cubic-bezier(0.22,1,0.36,1)]"
            style={{
              background: 'var(--color-background)',
              borderColor: 'var(--color-border)',
            }}
          >
            {/* grab handle */}
            <div
              className="mx-auto mb-5 h-1 w-10 rounded-full"
              style={{ background: 'var(--color-border)' }}
              aria-hidden
            />

            {sheet === 'palette' ? (
              <>
                <div className="mb-2 flex items-baseline justify-between">
                  <h2 className="text-base" style={{ fontFamily: fontTheme.display, color: 'var(--color-text)' }}>
                    Palette
                  </h2>
                  <span className="font-mono text-[10px]" style={{ color: 'var(--color-text)', opacity: 0.6 }}>
                    No. {comboId}
                  </span>
                </div>
                <div
                  role="radiogroup"
                  aria-label="Palette"
                  className="grid grid-cols-[repeat(auto-fill,minmax(2.75rem,1fr))] justify-items-center gap-y-3"
                >
                  {accessibleCombinations.map((id) => pip(id, 'lg'))}
                </div>
              </>
            ) : (
              <>
                <h2 className="mb-3 text-base" style={{ fontFamily: fontTheme.display, color: 'var(--color-text)' }}>
                  Type
                </h2>
                <div role="radiogroup" aria-label="Type pairing" className="grid grid-cols-2 gap-2">
                  {FONT_THEMES.map((theme) => typeChip(theme, true))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ----------------------------- DESKTOP ---------------------------- */}
      {/* Bottom bar: palette (scroll) + type. Unchanged from before. */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 hidden border-t backdrop-blur transition-colors sm:block"
        style={chrome}
      >
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto">
            <div role="radiogroup" aria-label="Palette" className="flex items-center gap-2">
              {accessibleCombinations.map((id) => pip(id))}
            </div>
          </div>
          <span className="h-5 w-px shrink-0" style={{ background: 'var(--color-border)' }} aria-hidden="true" />
          <span
            className="shrink-0 font-mono text-[10px] uppercase tracking-[0.2em]"
            style={{ color: 'var(--color-text)' }}
          >
            Type
          </span>
          <div
            role="radiogroup"
            aria-label="Type pairing"
            className="flex shrink-0 items-center gap-1.5 overflow-x-auto"
          >
            {FONT_THEMES.map((theme) => typeChip(theme))}
          </div>
        </div>
      </div>
    </>
  )
}

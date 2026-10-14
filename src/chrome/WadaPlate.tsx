import { usePalette } from '../lib/PaletteProvider'
import type { WadaColor } from '../lib/wada'

// Paper grain for the plate: SVG turbulence, no color of its own (the page
// color shows through), so it can't introduce a hex outside the dictionary.
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

// Block layout per combination size (2–4 colors): the first color takes the
// top of the plate, the rest share the row beneath, like a page of the book.
const LAYOUT: Record<number, { grid: string; first: string }> = {
  2: { grid: 'grid-cols-1 grid-rows-[3fr_2fr]', first: '' },
  3: { grid: 'grid-cols-2 grid-rows-[3fr_2fr]', first: 'col-span-2' },
  4: { grid: 'grid-cols-3 grid-rows-[3fr_2fr]', first: 'col-span-3' },
}

/** Labels sit on the color itself (top-left, clear of the overlapping card): ink on light blocks, paper on dark ones. */
const labelColor = (c: WadaColor) => (c.lab[0] > 58 ? 'var(--shell-ink)' : 'var(--shell-paper)')

// Outline for controls on the card: some combinations resolve primary/accent
// to a different hue of the same lightness as the background (No. 155 is
// 1:1), so the edge comes from the text color, which always contrasts.
const EDGE = '1px solid color-mix(in srgb, var(--color-text) 45%, transparent)'

/**
 * Hero specimen: the current combination printed as a plate of Wada's book
 * (big named color blocks with their hex and CMYK), plus a small "in use"
 * card styled only from the live --color-* tokens, which proves the same
 * colors work as a UI theme. Everything re-colors when the palette changes.
 */
export function WadaPlate() {
  const { comboId, palette } = usePalette()
  const colors = palette.sourceColors
  const layout = LAYOUT[colors.length] ?? LAYOUT[4]

  return (
    <figure className="relative pb-0 sm:pb-20 sm:pl-8">
      <div className="relative overflow-hidden rounded-[var(--radius-md)] bg-[var(--shell-paper)] p-4 shadow-2xl sm:p-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-25 mix-blend-multiply"
          style={{ backgroundImage: GRAIN }}
        />
        <header className="relative flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--shell-ink)]/70">
          <span>Plate No. {comboId}</span>
          <span>Sanzo Wada · 1933</span>
        </header>

        <div className={`relative mt-4 grid aspect-[5/4] gap-1.5 ${layout.grid}`}>
          {colors.map((c, i) => (
            <div
              key={`${comboId}-${c.name}`}
              className={`flex flex-col justify-start rounded-[var(--radius-sm)] p-3 transition-colors duration-500 ${i === 0 ? layout.first : ''}`}
              style={{ background: c.hex, color: labelColor(c) }}
            >
              <span className={`font-display leading-tight ${i === 0 ? 'text-xl sm:text-2xl' : 'text-sm sm:text-base'}`}>
                {c.name}
              </span>
              <span className="mt-0.5 font-mono text-[10px] uppercase tracking-wider opacity-80">
                {c.hex} · {c.cmyk.join('/')}
              </span>
            </div>
          ))}
        </div>

      </div>

      {/* "In use": the same combination as a UI theme, read from the live tokens.
          On --color-background, not --color-surface: resolvePalette guarantees
          primary/accent/text differ from background, but primary can equal
          surface (e.g. No. 253), which would make the button vanish. */}
      <div
        className="relative mt-4 w-full rounded-[var(--radius-lg)] border p-4 shadow-xl transition-colors duration-500 sm:absolute sm:bottom-0 sm:left-0 sm:mt-0 sm:w-64"
        style={{ background: 'var(--color-background)', color: 'var(--color-text)', borderColor: 'var(--color-border)' }}
      >
        <span
          className="inline-block rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider transition-colors duration-500"
          style={{ color: 'var(--color-text)', border: EDGE }}
        >
          In use
        </span>
        <p className="mt-2 font-display text-lg leading-snug">Kimono, stage, screen.</p>
        <p className="mt-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
          The same plate, applied as a theme.
        </p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            className="rounded-[var(--radius-md)] px-3 py-1.5 text-xs font-medium transition-colors duration-500"
            style={{ background: 'var(--color-primary)', color: 'var(--color-primary-foreground)', border: EDGE }}
          >
            Primary
          </button>
          <button
            type="button"
            className="rounded-[var(--radius-md)] px-3 py-1.5 text-xs font-medium transition-colors duration-500"
            style={{ background: 'var(--color-secondary)', color: 'var(--color-secondary-foreground)', border: EDGE }}
          >
            Secondary
          </button>
        </div>
      </div>
    </figure>
  )
}

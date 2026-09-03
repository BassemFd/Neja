import { useRef } from 'react'
import { usePalette } from '../lib/PaletteProvider'
import { resolvePalette } from '../lib/palette'
import { cn } from '../lib/cn'

/**
 * The flagship interaction: a shelf of pull-tab swatch cards, one per
 * WCAG-AA-passing Wada combination. Picking one rewrites every --color-*
 * CSS var live — nothing here computes a color itself, it only selects
 * a combination id and hands it to PaletteProvider.
 */
export function SwatchShelf() {
  const { comboId, accessibleCombinations, setComboId } = usePalette()
  const listRef = useRef<HTMLDivElement>(null)

  function onKeyDown(e: React.KeyboardEvent) {
    const idx = accessibleCombinations.indexOf(comboId)
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      setComboId(accessibleCombinations[Math.min(idx + 1, accessibleCombinations.length - 1)])
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      setComboId(accessibleCombinations[Math.max(idx - 1, 0)])
    }
  }

  return (
    <div className="w-full">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="font-display text-lg text-[var(--shell-paper)]">The swatch shelf</h2>
        <p className="font-mono text-xs text-[var(--shell-ecru)]">
          {accessibleCombinations.length} of 348 combinations clear WCAG AA
        </p>
      </div>
      <div
        ref={listRef}
        role="radiogroup"
        aria-label="Wada color combination"
        onKeyDown={onKeyDown}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4"
      >
        {accessibleCombinations.map((id) => {
          const isActive = id === comboId
          const combo = resolvePalette(id)
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setComboId(id)}
              className={cn(
                'group flex shrink-0 snap-start flex-col items-stretch overflow-hidden rounded-[var(--radius-md)] border transition-transform duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shell-seal)]',
                isActive
                  ? 'border-[var(--shell-seal)] -translate-y-1.5 shadow-[0_6px_0_0_var(--shell-seal)]'
                  : 'border-[var(--shell-ecru)]/40 hover:-translate-y-1',
              )}
              style={{ width: 76 }}
            >
              <span className="flex h-24 flex-col">
                {combo.sourceColors.map((c) => (
                  <span key={c.hex} style={{ background: c.hex, flex: 1 }} />
                ))}
              </span>
              <span className="bg-[var(--shell-ink)] px-1.5 py-1 text-center font-mono text-[10px] tracking-wide text-[var(--shell-paper)]">
                No. {id}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

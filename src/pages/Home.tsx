import { usePalette } from '../lib/PaletteProvider'
import { SwatchShelf } from '../chrome/SwatchShelf'
import { FontShelf } from '../chrome/FontShelf'
import { WadaPlate } from '../chrome/WadaPlate'

export function Home() {
  const { comboId, accessibleCombinations, setComboId } = usePalette()
  const shuffle = () => {
    const others = accessibleCombinations.filter((id) => id !== comboId)
    setComboId(others[Math.floor(Math.random() * others.length)])
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:py-16">
      <section className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-12">
        <div className="flex flex-col justify-center">
          <p className="mb-4 font-mono text-xs uppercase tracking-wider text-[var(--shell-seal)] sm:tracking-[0.2em]">
            Plate No. {comboId} of 348
          </p>
          <h1 className="font-display text-4xl leading-[1.08] text-[var(--shell-paper)] sm:text-6xl sm:leading-[1.05]">
            Every color in this system was chosen in 1933.
          </h1>
          <p className="mt-6 max-w-md font-sans text-base leading-relaxed text-[var(--shell-ecru)]">
            Sanzo Wada catalogued 348 color combinations for kimono and stage design. This library never picks a
            color outside his book. Pick a plate, or shuffle, and the whole site re-themes live, inside a hard
            guardrail rather than a good intention.
          </p>
          <div className="mt-8">
            <button
              type="button"
              onClick={shuffle}
              className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--shell-paper)]/40 px-5 font-mono text-sm uppercase tracking-wider text-[var(--shell-paper)] transition-colors hover:border-[var(--shell-paper)] hover:bg-[var(--shell-paper)]/10"
            >
              Shuffle <span aria-hidden="true">↻</span>
            </button>
          </div>
        </div>
        <WadaPlate />
      </section>

      <section className="mt-20">
        <SwatchShelf />
      </section>

      <section className="mt-20">
        <FontShelf />
      </section>
    </div>
  )
}

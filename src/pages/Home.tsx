import { usePalette } from '../lib/PaletteProvider'
import { SwatchShelf } from '../chrome/SwatchShelf'
import { FontShelf } from '../chrome/FontShelf'
import { LiveCanvas } from '../chrome/LiveCanvas'

export function Home() {
  const { comboId, palette } = usePalette()
  const names = palette.sourceColors.map((c) => c.name).join(' · ')

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:py-16">
      <section className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-12">
        <div className="flex flex-col justify-center">
          <p className="mb-4 font-mono text-xs uppercase tracking-wider text-[var(--shell-seal)] sm:tracking-[0.2em]">
            No. {comboId} — {names}
          </p>
          <h1 className="font-display text-4xl leading-[1.08] text-[var(--shell-paper)] sm:text-6xl sm:leading-[1.05]">
            Every color in this system was chosen in 1933.
          </h1>
          <p className="mt-6 max-w-md font-sans text-base leading-relaxed text-[var(--shell-ecru)]">
            Sanzo Wada catalogued 348 color combinations for kimono and stage design. This library never picks a
            color outside his book — pull a swatch below and the whole page below re-themes, live, from a hard
            guardrail, not a good intention.
          </p>
        </div>
        <LiveCanvas />
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

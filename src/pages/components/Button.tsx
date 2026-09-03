import Button from '../../components/Button'
import buttonMeta from '../../components/Button.meta'
import { PreviewCodePanel } from '../../chrome/PreviewCodePanel'

function ExamplePreview({ name }: { name: string }) {
  switch (name) {
    case 'Primary action':
      return <Button variant="primary">Primary action</Button>
    case 'Secondary action':
      return <Button variant="secondary">Secondary action</Button>
    case 'Ghost action':
      return <Button variant="ghost">Ghost action</Button>
    case 'Small size':
      return (
        <Button variant="primary" size="sm">
          Small
        </Button>
      )
    case 'Disabled':
      return (
        <Button variant="primary" disabled>
          Disabled
        </Button>
      )
    default:
      return null
  }
}

export function ButtonPage() {
  const variants = buttonMeta.variants.options.map((o) => o.value)
  const sizes = buttonMeta.sizes.options.map((o) => o.value)

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      {/* Header */}
      <div className="mb-12">
        <h1 className="font-display text-4xl text-[var(--shell-paper)]">{buttonMeta.name}</h1>
        <p className="mt-3 max-w-2xl font-sans text-sm text-[var(--shell-ecru)]">{buttonMeta.description}</p>
      </div>

      {/* Variant Matrix */}
      <section className="mb-16">
        <h2 className="mb-6 font-display text-2xl text-[var(--shell-paper)]">Variants & Sizes</h2>
        <div className="space-y-8">
          {variants.map((variant) => (
            <div key={variant}>
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--shell-ecru)]">{variant}</p>
              <div className="rounded-[var(--radius-lg)] border border-[var(--shell-ecru)]/25 bg-[var(--color-background)] p-6">
                <div className="flex flex-wrap gap-4">
                  {sizes.map((size) => (
                    <div key={`${variant}-${size}`} className="flex items-center gap-2">
                      <Button variant={variant as any} size={size as any}>
                        Button
                      </Button>
                      <span className="font-mono text-xs text-[var(--shell-ecru)]">{size}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Disabled State */}
      <section className="mb-16">
        <h2 className="mb-6 font-display text-2xl text-[var(--shell-paper)]">Disabled State</h2>
        <div className="rounded-[var(--radius-lg)] border border-[var(--shell-ecru)]/25 bg-[var(--color-background)] p-6">
          <div className="flex flex-wrap gap-4">
            {variants.map((variant) => (
              <Button key={`disabled-${variant}`} variant={variant as any} disabled>
                Button
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Props Table */}
      <section className="mb-16">
        <h2 className="mb-6 font-display text-2xl text-[var(--shell-paper)]">Props</h2>
        <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--shell-ecru)]/25">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--shell-ecru)]/25 bg-[var(--shell-ink)]/50">
                <th className="px-6 py-3 text-left font-mono text-xs font-medium uppercase text-[var(--shell-ecru)]">
                  Prop
                </th>
                <th className="px-6 py-3 text-left font-mono text-xs font-medium uppercase text-[var(--shell-ecru)]">
                  Type
                </th>
                <th className="px-6 py-3 text-left font-mono text-xs font-medium uppercase text-[var(--shell-ecru)]">
                  Default
                </th>
                <th className="px-6 py-3 text-left font-mono text-xs font-medium uppercase text-[var(--shell-ecru)]">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {buttonMeta.props.map((prop) => (
                <tr key={prop.name} className="border-b border-[var(--shell-ecru)]/25 hover:bg-[var(--shell-ink)]/50">
                  <td className="px-6 py-4 font-mono text-sm text-[var(--shell-paper)]">{prop.name}</td>
                  <td className="px-6 py-4 font-mono text-sm text-[var(--shell-ecru)]">{prop.type}</td>
                  <td className="px-6 py-4 font-mono text-sm text-[var(--shell-ecru)]">{prop.default}</td>
                  <td className="px-6 py-4 font-sans text-sm text-[var(--shell-ecru)]">{prop.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Examples with Preview/Code Panels */}
      <section>
        <h2 className="mb-6 font-display text-2xl text-[var(--shell-paper)]">Examples</h2>
        <div className="grid gap-8 lg:grid-cols-2">
          {buttonMeta.examples.map((example) => (
            <div key={example.name}>
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--shell-ecru)]">
                {example.name}
              </p>
              <PreviewCodePanel code={example.code}>
                <ExamplePreview name={example.name} />
              </PreviewCodePanel>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

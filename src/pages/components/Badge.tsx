import Badge from '../../components/Badge'
import badgeMeta from '../../components/Badge.meta'
import { PreviewCodePanel } from '../../chrome/PreviewCodePanel'

function ExamplePreview({ name }: { name: string }) {
  switch (name) {
    case 'Neutral':
      return <Badge>Default</Badge>
    case 'Primary':
      return <Badge variant="primary">New</Badge>
    case 'Success':
      return (
        <Badge variant="success" dot>
          Success
        </Badge>
      )
    case 'Warning':
      return (
        <Badge variant="warning" dot>
          Beta
        </Badge>
      )
    case 'Danger':
      return (
        <Badge variant="danger" dot>
          Error
        </Badge>
      )
    default:
      return null
  }
}

export function BadgePage() {
  const variants = badgeMeta.variants.options.map((o) => o.value)

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      {/* Header */}
      <div className="mb-12">
        <h1 className="font-display text-4xl text-[var(--shell-paper)]">{badgeMeta.name}</h1>
        <p className="mt-3 max-w-2xl font-sans text-sm text-[var(--shell-ecru)]">{badgeMeta.description}</p>
      </div>

      {/* Variant Matrix */}
      <section className="mb-16">
        <h2 className="mb-6 font-display text-2xl text-[var(--shell-paper)]">Variants</h2>
        <div className="space-y-8">
          {variants.map((variant) => (
            <div key={variant}>
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--shell-ecru)]">{variant}</p>
              <div className="rounded-[var(--radius-lg)] border border-[var(--shell-ecru)]/25 bg-[var(--color-background)] p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-6">
                    <Badge variant={variant as any}>Label</Badge>
                    <span className="font-mono text-xs text-[var(--shell-ecru)]">{'dot={false}'}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <Badge variant={variant as any} dot>Label</Badge>
                    <span className="font-mono text-xs text-[var(--shell-ecru)]">{'dot={true}'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Token Gap Limitation Note */}
      <section className="mb-16 rounded-[var(--radius-lg)] border border-[var(--shell-ecru)]/25 bg-[var(--shell-ink)]/50 p-6">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--shell-ecru)] mb-3">Documented Limitation</p>
        <p className="font-sans text-sm text-[var(--shell-ecru)] max-w-3xl">
          Token gap: <code className="bg-[var(--color-background)] rounded px-1 py-0.5 font-mono text-xs">token-conventions.md</code> defines no dedicated success/warning/danger token roles, only background/surface/text/primary/secondary/accent/border. This component maps 5 variants onto that smaller set using only contrast pairs already guaranteed or precedented. Consequence: in 50 of the 71 WCAG-AA-accessible combinations (~70%), accent/secondary/border resolve to the same source color, so "success" and "danger" render visually identical there (differing only by which token name is used, not by hue) — combo 261, shown here, is one of those 50. Recommend <code className="bg-[var(--color-background)] rounded px-1 py-0.5 font-mono text-xs">token-conventions.md</code> add explicit status roles (e.g. success/warning/danger + matching -foreground) if guaranteed per-status hue distinction is required.
        </p>
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
              {badgeMeta.props.map((prop) => (
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
          {badgeMeta.examples.map((example) => (
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

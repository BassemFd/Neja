import Callout from '../../components/Callout'
import calloutMeta from '../../components/Callout.meta'
import { PreviewCodePanel } from '../../chrome/PreviewCodePanel'

function ExamplePreview({ name }: { name: string }) {
  switch (name) {
    case 'Info':
      return (
        <Callout variant="info" title="Heads up">
          Some contextual information.
        </Callout>
      )
    case 'Success':
      return (
        <Callout variant="success" title="Saved">
          Your changes were saved successfully.
        </Callout>
      )
    case 'Warning':
      return (
        <Callout variant="warning" title="Careful">
          This action affects other users.
        </Callout>
      )
    case 'Danger':
      return (
        <Callout variant="danger" title="Failed">
          Something went wrong processing your request.
        </Callout>
      )
    default:
      return null
  }
}

export function CalloutPage() {
  const variants = calloutMeta.variants.options.map((o) => o.value) as Array<'info' | 'success' | 'warning' | 'danger'>

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      {/* Header */}
      <div className="mb-12">
        <h1 className="font-display text-4xl text-[var(--shell-paper)]">{calloutMeta.name}</h1>
        <p className="mt-3 max-w-2xl font-sans text-sm text-[var(--shell-ecru)]">{calloutMeta.description}</p>
      </div>

      {/* Variants Matrix */}
      <section className="mb-16">
        <h2 className="mb-6 font-display text-2xl text-[var(--shell-paper)]">Variants</h2>
        <div className="space-y-8">
          {variants.map((variant) => (
            <div key={variant}>
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--shell-ecru)]">{variant}</p>
              <div className="rounded-[var(--radius-lg)] border border-[var(--shell-ecru)]/25 bg-[var(--color-background)] p-6">
                <Callout variant={variant} title={`${variant.charAt(0).toUpperCase() + variant.slice(1)} message`}>
                  This is an example {variant} callout with a leading glyph, title, and body text.
                </Callout>
              </div>
            </div>
          ))}
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
              {calloutMeta.props.map((prop) => (
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

      {/* Notes */}
      <section className="mb-16">
        <h2 className="mb-6 font-display text-2xl text-[var(--shell-paper)]">Notes</h2>
        <div className="space-y-4">
          {calloutMeta.notes.map((note, idx) => (
            <div key={idx} className="rounded-[var(--radius-lg)] border border-[var(--shell-ecru)]/25 bg-[var(--shell-ink)]/50 p-6">
              <p className="font-sans text-sm text-[var(--shell-ecru)] leading-relaxed">{note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Examples with Preview/Code Panels */}
      <section>
        <h2 className="mb-6 font-display text-2xl text-[var(--shell-paper)]">Examples</h2>
        <div className="grid gap-8 lg:grid-cols-2">
          {calloutMeta.examples.map((example) => (
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

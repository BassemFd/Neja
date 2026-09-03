import Card from '../../components/Card'
import cardMeta from '../../components/Card.meta'
import { PreviewCodePanel } from '../../chrome/PreviewCodePanel'

function ExamplePreview({ name }: { name: string }) {
  switch (name) {
    case 'Default panel':
      return (
        <Card>
          <h3 className="font-semibold text-[var(--color-text)]">Title</h3>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">Body text describing the card contents.</p>
        </Card>
      )
    case 'Outlined panel':
      return (
        <Card variant="outlined">
          <h3 className="font-semibold text-[var(--color-text)]">Title</h3>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">Body text describing the card contents.</p>
        </Card>
      )
    case 'Interactive card as link':
      return (
        <Card interactive href="/details" className="p-4">
          <h3 className="font-semibold text-[var(--color-text)]">Clickable card</h3>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Acts as a link; hover lift and focus ring included.
          </p>
        </Card>
      )
    case 'Interactive card as button':
      return (
        <Card interactive onClick={() => {}} className="p-4">
          <h3 className="font-semibold text-[var(--color-text)]">Clickable card</h3>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Acts as a button; hover lift and focus ring included.
          </p>
        </Card>
      )
    case 'Disabled interactive card':
      return (
        <Card interactive disabled className="p-4">
          <h3 className="font-semibold text-[var(--color-text)]">Disabled</h3>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">Not clickable; hover lift suppressed.</p>
        </Card>
      )
    default:
      return null
  }
}

export function CardPage() {
  const variants = cardMeta.variants.options.map((o) => o.value)

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      {/* Header */}
      <div className="mb-12">
        <h1 className="font-display text-4xl text-[var(--shell-paper)]">{cardMeta.name}</h1>
        <p className="mt-3 max-w-2xl font-sans text-sm text-[var(--shell-ecru)]">{cardMeta.description}</p>
      </div>

      {/* Variant Matrix */}
      <section className="mb-16">
        <h2 className="mb-6 font-display text-2xl text-[var(--shell-paper)]">Variants</h2>
        <div className="space-y-8">
          {variants.map((variant) => (
            <div key={variant}>
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--shell-ecru)]">{variant}</p>
              <div className="rounded-[var(--radius-lg)] border border-[var(--shell-ecru)]/25 bg-[var(--color-background)] p-6">
                <Card variant={variant as 'default' | 'outlined'} className="p-4">
                  <h3 className="font-semibold text-[var(--color-text)]">Card Title</h3>
                  <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                    Sample content for the {variant} variant.
                  </p>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive States */}
      <section className="mb-16">
        <h2 className="mb-6 font-display text-2xl text-[var(--shell-paper)]">Interactive States</h2>
        <div className="space-y-8">
          {/* Default (non-interactive) */}
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--shell-ecru)]">Default (non-interactive)</p>
            <div className="rounded-[var(--radius-lg)] border border-[var(--shell-ecru)]/25 bg-[var(--color-background)] p-6">
              <Card className="p-4">
                <h3 className="font-semibold text-[var(--color-text)]">Plain card</h3>
                <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                  Renders as a regular &lt;div&gt; with no interactive affordances.
                </p>
              </Card>
            </div>
          </div>

          {/* Interactive as link */}
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--shell-ecru)]">Interactive as link</p>
            <div className="rounded-[var(--radius-lg)] border border-[var(--shell-ecru)]/25 bg-[var(--color-background)] p-6">
              <Card interactive href="/details" className="p-4 max-w-xs">
                <h3 className="font-semibold text-[var(--color-text)]">Clickable card</h3>
                <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                  Renders as an &lt;a&gt; with hover lift and focus ring.
                </p>
              </Card>
            </div>
          </div>

          {/* Interactive as button */}
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--shell-ecru)]">Interactive as button</p>
            <div className="rounded-[var(--radius-lg)] border border-[var(--shell-ecru)]/25 bg-[var(--color-background)] p-6">
              <Card interactive onClick={() => {}} className="p-4 max-w-xs">
                <h3 className="font-semibold text-[var(--color-text)]">Clickable card</h3>
                <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                  Renders as a &lt;button&gt; with hover lift and focus ring.
                </p>
              </Card>
            </div>
          </div>

          {/* Disabled interactive button */}
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--shell-ecru)]">Disabled (interactive button)</p>
            <div className="rounded-[var(--radius-lg)] border border-[var(--shell-ecru)]/25 bg-[var(--color-background)] p-6">
              <Card interactive disabled className="p-4 max-w-xs">
                <h3 className="font-semibold text-[var(--color-text)]">Disabled</h3>
                <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                  Not clickable; hover lift suppressed and opacity reduced.
                </p>
              </Card>
            </div>
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
              {cardMeta.props.map((prop) => (
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
          {cardMeta.examples.map((example) => (
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

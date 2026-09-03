import Input from '../../components/Input'
import inputMeta from '../../components/Input.meta'
import { PreviewCodePanel } from '../../chrome/PreviewCodePanel'

function ExamplePreview({ name }: { name: string }) {
  switch (name) {
    case 'Default':
      return <Input placeholder="Enter text" />
    case 'Small size':
      return <Input size="sm" placeholder="Small input" />
    case 'Disabled':
      return <Input disabled placeholder="Disabled" />
    case 'Invalid, paired with a visible error message':
      return (
        <div className="w-full max-w-xs">
          <Input invalid aria-describedby="email-error" defaultValue="not-an-email" />
          <p id="email-error" className="mt-2 text-sm text-[var(--color-primary)]">
            Enter a valid email address.
          </p>
        </div>
      )
    default:
      return null
  }
}

export function InputPage() {
  const sizes = inputMeta.sizes.options.map((o) => o.value)

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      {/* Header */}
      <div className="mb-12">
        <h1 className="font-display text-4xl text-[var(--shell-paper)]">{inputMeta.name}</h1>
        <p className="mt-3 max-w-2xl font-sans text-sm text-[var(--shell-ecru)]">{inputMeta.description}</p>
      </div>

      {/* Sizes Matrix */}
      <section className="mb-16">
        <h2 className="mb-6 font-display text-2xl text-[var(--shell-paper)]">Sizes</h2>
        <div className="space-y-8">
          {sizes.map((size) => (
            <div key={size}>
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--shell-ecru)]">{size}</p>
              <div className="rounded-[var(--radius-lg)] border border-[var(--shell-ecru)]/25 bg-[var(--color-background)] p-6">
                <Input size={size as 'sm' | 'md'} placeholder={`Enter text (${size})`} className="w-full max-w-sm" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* States */}
      <section className="mb-16">
        <h2 className="mb-6 font-display text-2xl text-[var(--shell-paper)]">States</h2>
        <div className="space-y-8">
          {/* Default */}
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--shell-ecru)]">default</p>
            <div className="rounded-[var(--radius-lg)] border border-[var(--shell-ecru)]/25 bg-[var(--color-background)] p-6">
              <Input placeholder="Enter text" className="w-full max-w-sm" />
            </div>
          </div>

          {/* Disabled */}
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--shell-ecru)]">disabled</p>
            <div className="rounded-[var(--radius-lg)] border border-[var(--shell-ecru)]/25 bg-[var(--color-background)] p-6">
              <Input disabled placeholder="Disabled input" className="w-full max-w-sm" />
            </div>
          </div>

          {/* Invalid */}
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--shell-ecru)]">invalid</p>
            <div className="rounded-[var(--radius-lg)] border border-[var(--shell-ecru)]/25 bg-[var(--color-background)] p-6">
              <div className="w-full max-w-sm">
                <Input invalid aria-describedby="example-error" defaultValue="not-an-email" placeholder="Enter email" />
                <p id="example-error" className="mt-2 text-sm text-[var(--color-primary)]">
                  Enter a valid email address.
                </p>
              </div>
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
              {inputMeta.props.map((prop) => (
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
          {inputMeta.notes.map((note, idx) => (
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
          {inputMeta.examples.map((example) => (
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

/**
 * Consumed by `doc-writer` to build the style-guide page and copy-pasteable
 * code panel — the concrete artifact of this stage, not prose.
 */

export interface InputMeta {
  name: string
  description: string
  import: string
  props: {
    name: string
    type: string
    default: string
    description: string
  }[]
  sizes: {
    prop: 'size'
    options: { value: string; description: string }[]
  }
  states: string[]
  notes: string[]
  examples: {
    name: string
    code: string
  }[]
}

const inputMeta: InputMeta = {
  name: 'Input',
  description: 'Single-line text input field. Renders a plain <input> — does not render a label or error message itself.',
  import: "import Input from '@/components/Input'",
  props: [
    {
      name: 'size',
      type: "'sm' | 'md'",
      default: 'md',
      description: 'Control height, padding, and font size.',
    },
    {
      name: 'invalid',
      type: 'boolean',
      default: 'false',
      description:
        'Marks the input as invalid: swaps the border/focus-ring to var(--color-primary) and sets aria-invalid. Must be paired by the consumer with a visible error message (see notes below) — Input does not render one itself.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disables the input; conveyed via reduced opacity and the native disabled attribute.',
    },
    {
      name: '...props',
      type: 'InputHTMLAttributes<HTMLInputElement>',
      default: '—',
      description:
        "All standard <input> attributes pass through (value, onChange, placeholder, aria-*, etc.), except `size` (the native numeric HTML attribute), which is shadowed by this component's size variant.",
    },
  ],
  sizes: {
    prop: 'size',
    options: [
      { value: 'sm', description: 'h-8, compact padding, text-xs.' },
      { value: 'md', description: 'h-10, standard padding, text-sm.' },
    ],
  },
  states: ['default', 'hover', 'focus-visible', 'disabled', 'invalid'],
  notes: [
    'Token gap: token-conventions.md has no dedicated error/danger role. This component uses `--color-primary` (not `--color-accent`, despite Badge\'s "danger" variant precedent using accent) for the invalid border/ring. Reason: Input\'s own focus-visible ring already uses `--color-accent` (matching Button/Card); reusing accent for invalid too would make a focused+invalid input render the identical ring color as a focused-but-valid one, destroying the one visual signal meant to distinguish those states. Primary is otherwise unused by Input, so it unambiguously carries "invalid" without colliding with focus.',
    'Accessibility: per docs/agents/accessibility.md, the invalid state must NOT rely on color alone. `invalid` sets `aria-invalid="true"` and swaps the border/ring color, but Input itself renders no error text. Consumers are required to pair `invalid` with a visible text message rendered alongside the input (e.g. a <p> or <span> with the error copy), and should connect it via `aria-describedby={errorId}` on the Input for assistive-tech users. Example: `<Input invalid aria-describedby="email-error" /><p id="email-error">Enter a valid email address.</p>`.',
    'Hover state is intentionally subtle (border shifts from --color-border to --color-text-muted) rather than a fill/background change, per the "subtle border change" spec — it should read as a discoverability cue, not a state change.',
  ],
  examples: [
    {
      name: 'Default',
      code: '<Input placeholder="Enter text" />',
    },
    {
      name: 'Small size',
      code: '<Input size="sm" placeholder="Small input" />',
    },
    {
      name: 'Disabled',
      code: '<Input disabled placeholder="Disabled" />',
    },
    {
      name: 'Invalid, paired with a visible error message',
      code: '<Input invalid aria-describedby="email-error" defaultValue="not-an-email" />\n<p id="email-error">Enter a valid email address.</p>',
    },
  ],
}

export default inputMeta

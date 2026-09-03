/**
 * Consumed by `doc-writer` to build the style-guide page and copy-pasteable
 * code panel — the concrete artifact of this stage, not prose.
 */

export interface BadgeMeta {
  name: string
  description: string
  import: string
  props: {
    name: string
    type: string
    default: string
    description: string
  }[]
  variants: {
    prop: 'variant'
    options: { value: string; description: string }[]
  }
  states: string[]
  notes: string[]
  examples: {
    name: string
    code: string
  }[]
}

const badgeMeta: BadgeMeta = {
  name: 'Badge',
  description:
    'Small status/label pill (e.g. "New", "Beta", "Error", "Success"). Non-interactive by default — renders a plain <span>.',
  import: "import Badge from '@/components/Badge'",
  props: [
    {
      name: 'variant',
      type: "'neutral' | 'primary' | 'success' | 'warning' | 'danger'",
      default: 'neutral',
      description: 'Visual style, mapped to semantic color-token roles.',
    },
    {
      name: 'dot',
      type: 'boolean',
      default: 'false',
      description:
        'Renders a small decorative leading dot in the badge\'s own text color. aria-hidden — reinforces status, never the sole conveyor of it.',
    },
    {
      name: '...props',
      type: 'HTMLAttributes<HTMLSpanElement>',
      default: '—',
      description: 'All standard <span> attributes (aria-*, etc.) pass through.',
    },
  ],
  variants: {
    prop: 'variant',
    options: [
      { value: 'neutral', description: 'bg-[var(--color-surface)] fill with a var(--color-border) outline, for a default/generic label.' },
      { value: 'primary', description: 'bg-[var(--color-primary)] fill, for a highlighted/featured label (e.g. "New").' },
      { value: 'success', description: 'Transparent fill with a var(--color-secondary) outline, for a positive status (e.g. "Success").' },
      { value: 'warning', description: 'bg-[var(--color-secondary)] fill, for a cautionary status (e.g. "Beta").' },
      { value: 'danger', description: 'Transparent fill with a var(--color-accent) outline, for a negative status (e.g. "Error").' },
    ],
  },
  states: ['default (no hover/focus/disabled states — non-interactive by design)'],
  notes: [
    'Accessibility: status is conveyed primarily by the label text (children), never by color alone — per docs/agents/accessibility.md. The optional `dot` prop adds a small aria-hidden leading dot as a reinforcing visual cue only; it is not required for meaning and is off by default.',
    'Token gap: token-conventions.md defines no dedicated success/warning/danger token roles, only background/surface/text/primary/secondary/accent/border. This component maps 5 variants onto that smaller set using only contrast pairs already guaranteed (text/background, text/surface, primary/primaryForeground via resolvePalette\'s passesWcagAA) or precedented elsewhere (secondary/secondaryForeground, as in Button). Consequence: in 50 of the 71 WCAG-AA-accessible Wada combinations (~70%, verified via resolvePalette across the full accessible set), accent/secondary/border resolve to the same source color, so "success" and "danger" render visually identical there (differing only by which token name is used, not by hue) — combo 261 in this handoff is one of those 50. Recommend token-conventions.md add explicit status roles (e.g. success/warning/danger + matching -foreground) if guaranteed per-status hue distinction is required; this component intentionally did not invent a hardcoded color to work around the gap.',
    'Non-interactive by default: plain <span>, no role/tabIndex/focus-visible ring. A clickable badge (e.g. a removable filter chip) should be a distinct component composing Badge inside a real <button>, not this one extended with click handlers.',
  ],
  examples: [
    {
      name: 'Neutral',
      code: '<Badge>Default</Badge>',
    },
    {
      name: 'Primary',
      code: '<Badge variant="primary">New</Badge>',
    },
    {
      name: 'Success',
      code: '<Badge variant="success" dot>Success</Badge>',
    },
    {
      name: 'Warning',
      code: '<Badge variant="warning" dot>Beta</Badge>',
    },
    {
      name: 'Danger',
      code: '<Badge variant="danger" dot>Error</Badge>',
    },
  ],
}

export default badgeMeta

/**
 * Consumed by `doc-writer` to build the style-guide page and copy-pasteable
 * code panel — the concrete artifact of this stage, not prose.
 */

export interface CalloutMeta {
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

const calloutMeta: CalloutMeta = {
  name: 'Callout',
  description:
    'Inline admonition/message box (info/warning/success/danger) with a leading glyph, a title, and body text. Non-interactive — renders a plain <div role="note">.',
  import: "import Callout from '@/components/Callout'",
  props: [
    {
      name: 'variant',
      type: "'info' | 'success' | 'warning' | 'danger'",
      default: 'info',
      description: 'Visual style and glyph, mapped to a semantic color-token role.',
    },
    {
      name: 'title',
      type: 'ReactNode',
      default: "variant's default label (e.g. 'Warning')",
      description: 'Heading rendered above the body text (children).',
    },
    {
      name: 'icon',
      type: 'ReactNode',
      default: "variant's built-in glyph",
      description:
        'Overrides the default unicode glyph for the variant. Rarely needed — the built-in glyphs already give each variant a shape distinct from color alone.',
    },
    {
      name: 'children',
      type: 'ReactNode',
      default: '—',
      description: 'Body text/content of the callout.',
    },
    {
      name: '...props',
      type: 'HTMLAttributes<HTMLDivElement>',
      default: '—',
      description: 'All standard <div> attributes (aria-*, etc.) pass through.',
    },
  ],
  variants: {
    prop: 'variant',
    options: [
      { value: 'info', description: "border-l-4 + glyph 'ⓘ' in var(--color-primary), on a var(--color-surface) fill." },
      { value: 'success', description: "border-l-4 + glyph '✓' in var(--color-secondary), on a var(--color-surface) fill." },
      { value: 'warning', description: "border-l-4 + glyph '▲' in var(--color-accent), on a var(--color-surface) fill." },
      { value: 'danger', description: "border-l-4 + glyph '✕' in var(--color-border), on a var(--color-surface) fill." },
    ],
  },
  states: ['default (no hover/focus/disabled states — non-interactive by design)'],
  notes: [
    'Accessibility: per docs/agents/accessibility.md, color is never the sole conveyor of meaning. Every variant renders a distinct leading unicode glyph (info: ⓘ, success: ✓, warning: ▲, danger: ✕) in addition to its distinct border/icon color, so the variant is still identifiable under grayscale or any color-vision deficiency. Uses role="note" (static, supplementary content) rather than role="alert" (reserved for assertive live updates, which a static Callout is not).',
    'Token gap: token-conventions.md defines no dedicated info/warning/success/danger roles, only background/surface/text/textMuted/primary/primaryForeground/secondary/secondaryForeground/accent/border. With exactly 4 non-text/surface roles available and 4 variants needed, this component maps one role per variant 1:1 — info->primary, success->secondary, warning->accent, danger->border — rather than reusing a role across two variants the way Badge (5 variants, 3 usable roles) had to. This 1:1 mapping avoids Badge\'s *guaranteed* same-role collisions, but does not guarantee four visually distinct hues: two of the four roles can still resolve to the same source color under some Wada combinations, the same general finding already documented in Badge.tsx/Badge.meta.ts. Concretely, under the combo handed off for this build (comboId 284): secondary === accent === surface (#00b49b) and border === primary (#e2625e). That means, in this specific combo, "success" and "warning" borders/glyphs render the same hue as each other (and blend into the surface fill), and "info" and "danger" borders/glyphs render the same hue as each other. The glyph shapes remain distinct in all cases, so meaning is never lost, only the extra color redundancy. Recommend token-conventions.md add explicit status roles (e.g. info/success/warning/danger + matching -foreground) if guaranteed per-status hue distinction is required; this component intentionally did not invent a hardcoded color to work around the gap.',
    'Non-interactive by design: plain <div role="note">, no tabIndex/focus-visible ring/disabled state — accessibility.md\'s interactive-state requirements don\'t apply to static content.',
  ],
  examples: [
    {
      name: 'Info',
      code: "<Callout variant=\"info\" title=\"Heads up\">Some contextual information.</Callout>",
    },
    {
      name: 'Success',
      code: "<Callout variant=\"success\" title=\"Saved\">Your changes were saved successfully.</Callout>",
    },
    {
      name: 'Warning',
      code: "<Callout variant=\"warning\" title=\"Careful\">This action affects other users.</Callout>",
    },
    {
      name: 'Danger',
      code: "<Callout variant=\"danger\" title=\"Failed\">Something went wrong processing your request.</Callout>",
    },
  ],
}

export default calloutMeta

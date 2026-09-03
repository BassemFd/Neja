/**
 * Consumed by `doc-writer` to build the style-guide page and copy-pasteable
 * code panel — the concrete artifact of this stage, not prose.
 */

export interface CardMeta {
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
  examples: {
    name: string
    code: string
  }[]
}

const cardMeta: CardMeta = {
  name: 'Card',
  description:
    'Content container/panel used to group related information (title + body + optional footer actions). Renders as a plain <div> by default, or as a link/button when interactive is true.',
  import: "import Card from '@/components/Card'",
  props: [
    {
      name: 'variant',
      type: "'default' | 'outlined'",
      default: 'default',
      description: 'Visual style: surface-filled panel, or transparent background with a border.',
    },
    {
      name: 'interactive',
      type: 'boolean',
      default: 'false',
      description:
        'Marks the card as a clickable link/button — adds a hover lift and a focus-visible ring. Renders as <a> when href is supplied, otherwise as <button>. When false/omitted, renders as a plain <div> with no interactive affordances.',
    },
    {
      name: 'href',
      type: 'string',
      default: '—',
      description: 'Only used when interactive is true; renders the card as an <a> instead of a <button>.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description:
        'Only applies to the interactive <button> form; disables it via the native disabled attribute plus reduced opacity, and suppresses the hover lift/shadow.',
    },
    {
      name: '...props',
      type: 'HTMLAttributes<HTMLDivElement> | AnchorHTMLAttributes<HTMLAnchorElement> | ButtonHTMLAttributes<HTMLButtonElement>',
      default: '—',
      description: 'All standard attributes for the rendered element (onClick, aria-*, etc.) pass through.',
    },
  ],
  variants: {
    prop: 'variant',
    options: [
      { value: 'default', description: 'bg-[var(--color-surface)] fill, for a raised panel.' },
      { value: 'outlined', description: 'Transparent fill with a var(--color-border) outline.' },
    ],
  },
  states: ['default', 'hover (interactive only)', 'focus-visible (interactive only)', 'disabled (interactive button only)'],
  examples: [
    {
      name: 'Default panel',
      code: '<Card>\n  <h3>Title</h3>\n  <p>Body text describing the card contents.</p>\n</Card>',
    },
    {
      name: 'Outlined panel',
      code: '<Card variant="outlined">\n  <h3>Title</h3>\n  <p>Body text describing the card contents.</p>\n</Card>',
    },
    {
      name: 'Interactive card as link',
      code: '<Card interactive href="/details">\n  <h3>Clickable card</h3>\n  <p>Acts as a link; hover lift and focus ring included.</p>\n</Card>',
    },
    {
      name: 'Interactive card as button',
      code: '<Card interactive onClick={() => {}}>\n  <h3>Clickable card</h3>\n  <p>Acts as a button; hover lift and focus ring included.</p>\n</Card>',
    },
    {
      name: 'Disabled interactive card',
      code: '<Card interactive disabled>\n  <h3>Disabled</h3>\n  <p>Not clickable; hover lift suppressed.</p>\n</Card>',
    },
  ],
}

export default cardMeta

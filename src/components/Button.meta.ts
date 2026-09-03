/**
 * Consumed by `doc-writer` to build the style-guide page and copy-pasteable
 * code panel — the concrete artifact of this stage, not prose.
 */

export interface ButtonMeta {
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
  sizes: {
    prop: 'size'
    options: { value: string; description: string }[]
  }
  states: string[]
  examples: {
    name: string
    code: string
  }[]
}

const buttonMeta: ButtonMeta = {
  name: 'Button',
  description: 'The primary interactive control used throughout the style guide.',
  import: "import Button from '@/components/Button'",
  props: [
    {
      name: 'variant',
      type: "'primary' | 'secondary' | 'ghost'",
      default: 'primary',
      description: 'Visual style, mapped to semantic color-token roles.',
    },
    {
      name: 'size',
      type: "'sm' | 'md'",
      default: 'md',
      description: 'Control height, padding, and font size.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disables the button; conveyed via reduced opacity and the native disabled attribute.',
    },
    {
      name: '...props',
      type: 'ButtonHTMLAttributes<HTMLButtonElement>',
      default: '—',
      description: 'All standard <button> attributes (onClick, type, aria-*, etc.) pass through.',
    },
  ],
  variants: {
    prop: 'variant',
    options: [
      { value: 'primary', description: 'bg-[var(--color-primary)] fill, for the main call to action.' },
      { value: 'secondary', description: 'bg-[var(--color-secondary)] fill, for secondary actions.' },
      { value: 'ghost', description: 'Transparent fill with a var(--color-border) outline, for tertiary actions.' },
    ],
  },
  sizes: {
    prop: 'size',
    options: [
      { value: 'sm', description: 'h-8, compact padding, text-xs.' },
      { value: 'md', description: 'h-10, standard padding, text-sm.' },
    ],
  },
  states: ['default', 'hover', 'focus-visible', 'disabled'],
  examples: [
    {
      name: 'Primary action',
      code: '<Button variant="primary">Primary action</Button>',
    },
    {
      name: 'Secondary action',
      code: '<Button variant="secondary">Secondary action</Button>',
    },
    {
      name: 'Ghost action',
      code: '<Button variant="ghost">Ghost action</Button>',
    },
    {
      name: 'Small size',
      code: '<Button variant="primary" size="sm">Small</Button>',
    },
    {
      name: 'Disabled',
      code: '<Button variant="primary" disabled>Disabled</Button>',
    },
  ],
}

export default buttonMeta

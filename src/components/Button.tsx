import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/cn'

/**
 * Primary interactive control used throughout the style guide. Colors are
 * sourced exclusively from the semantic --color-* CSS vars (see
 * docs/agents/token-conventions.md) so the palette switcher can re-theme
 * every instance at runtime without a code change.
 */
export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-[var(--radius-md)] font-sans font-medium ' +
    'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
    'disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-[var(--color-primary)] text-[var(--color-primary-foreground)] ' +
          'border border-transparent ' +
          'hover:bg-[var(--color-primary)]/90 ' +
          'focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-[var(--color-background)]',
        secondary:
          'bg-[var(--color-secondary)] text-[var(--color-secondary-foreground)] ' +
          'border border-transparent ' +
          'hover:bg-[var(--color-secondary)]/90 ' +
          'focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-[var(--color-background)]',
        ghost:
          'bg-transparent text-[var(--color-text)] ' +
          'border border-[var(--color-border)] ' +
          'hover:bg-[var(--color-surface)]/40 ' +
          'focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-[var(--color-background)]',
      },
      size: {
        sm: 'h-8 gap-1.5 px-3 text-xs',
        md: 'h-10 gap-2 px-4 text-sm',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

/**
 * Semantic <button> — never a styled <div onClick>. Disabled state is
 * conveyed by both the native `disabled` attribute (which also drives
 * aria-disabled semantics and removes it from the tab order) and reduced
 * opacity, per docs/agents/accessibility.md.
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = 'button', ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export default Button

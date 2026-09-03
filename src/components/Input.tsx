import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '../lib/cn'

/**
 * Single-line text input field. Colors are sourced exclusively from the
 * semantic --color-* CSS vars (see docs/agents/token-conventions.md) so the
 * palette switcher can re-theme every instance at runtime without a code
 * change.
 *
 * Token gap: token-conventions.md's role table has no dedicated
 * error/danger role. This component uses `--color-primary` for the
 * `invalid` border/ring — deliberately *not* `--color-accent`, even though
 * Badge's "danger" variant precedent uses accent, because Input's own
 * focus-visible ring already uses accent (matching Button/Card). Reusing
 * accent for both would make a focused+invalid input show the same ring
 * color as a focused-but-valid one, collapsing the one visual signal that's
 * supposed to distinguish the two states. Primary is otherwise unused by
 * Input, so it's free to carry "invalid" unambiguously. See Input.meta.ts
 * for the note on how consumers must pair `invalid` with a visible error
 * message — this component intentionally never renders one itself (see
 * accessibility.md: color is never the sole conveyor of state).
 */
export const inputVariants = cva(
  'flex w-full rounded-[var(--radius-md)] border bg-[var(--color-surface)] font-sans ' +
    'text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] ' +
    'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
    'focus-visible:ring-offset-[var(--color-background)] ' +
    'disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-3.5 text-sm',
      },
      invalid: {
        true: 'border-[var(--color-primary)] focus-visible:ring-[var(--color-primary)]',
        false:
          'border-[var(--color-border)] hover:border-[var(--color-text-muted)] ' +
          'focus-visible:ring-[var(--color-accent)]',
      },
    },
    defaultVariants: {
      size: 'md',
      invalid: false,
    },
  },
)

export type InputSize = 'sm' | 'md'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Control height, padding, and font size. Defaults to 'md'. */
  size?: InputSize
  /**
   * Marks the input as invalid: swaps the border/focus-ring to
   * `--color-primary` and sets `aria-invalid`. Per accessibility.md, color
   * is never the sole conveyor of state — consumers MUST pair this with a
   * visible text message (e.g. via `aria-describedby` pointing at an error
   * element rendered alongside the input). Input does not render that
   * message itself; see Input.meta.ts notes.
   */
  invalid?: boolean
}

/**
 * Semantic <input> — never a styled <div>. Disabled state is conveyed by
 * both the native `disabled` attribute (removes it from the tab order,
 * drives aria-disabled semantics) and reduced opacity. Invalid state sets
 * `aria-invalid` in addition to the visual border/ring change, per
 * docs/agents/accessibility.md.
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, size, invalid = false, type = 'text', ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        aria-invalid={invalid || undefined}
        className={cn(inputVariants({ size, invalid }), className)}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export default Input

import { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/cn'

/**
 * Small status/label pill (e.g. "New", "Beta", "Error", "Success"). Colors
 * are sourced exclusively from the semantic --color-* CSS vars (see
 * docs/agents/token-conventions.md) so the palette switcher can re-theme
 * every instance at runtime without a code change.
 *
 * Token gap: token-conventions.md's role table has no dedicated
 * success/warning/danger roles (only background/surface/text/primary/
 * secondary/accent/border). With five requested variants and three
 * non-primary roles to draw from (secondary, accent, border), some visual
 * collisions between variants are possible under Wada combinations where
 * those roles resolve to the same source color (e.g. combo 261, where
 * accent === secondary === border). This is a real limitation of the
 * current token set, not a bug in this component — see the note in
 * Badge.meta.ts. Recommend token-conventions.md add explicit status roles
 * (e.g. `success`/`warning`/`danger` + matching `-foreground`) if
 * true per-status color distinction is required; until then this mapping
 * only uses contrast pairs already guaranteed or precedented elsewhere in
 * the codebase (text/background, text/surface, primary/primaryForeground
 * guaranteed by resolvePalette's passesWcagAA check; secondary/
 * secondaryForeground precedented by Button's "secondary" variant).
 */
export const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full font-sans font-medium ' +
    'px-2.5 py-0.5 text-xs leading-5 whitespace-nowrap',
  {
    variants: {
      variant: {
        neutral: 'bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)]',
        primary: 'bg-[var(--color-primary)] text-[var(--color-primary-foreground)] border border-transparent',
        success: 'bg-transparent text-[var(--color-text)] border border-[var(--color-secondary)]',
        warning: 'bg-[var(--color-secondary)] text-[var(--color-secondary-foreground)] border border-transparent',
        danger: 'bg-transparent text-[var(--color-text)] border border-[var(--color-accent)]',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  },
)

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /**
   * Renders a small decorative leading dot in the badge's own text color.
   * Purely a reinforcing visual cue — per docs/agents/accessibility.md,
   * status is primarily conveyed by the label text (`children`), never by
   * color alone, so this is optional and defaults to off. Marked
   * `aria-hidden` since it carries no information beyond what the text
   * already states.
   */
  dot?: boolean
}

/**
 * Non-interactive by default: renders a plain `<span>`, no tabIndex, no
 * role, no focus-visible ring — accessibility.md's interactive-state
 * requirements (hover/focus-visible/disabled) don't apply because a badge
 * is not an interactive control. If a consumer needs a clickable badge
 * (e.g. a removable filter chip), that's a distinct interactive component
 * and should compose Badge inside a real `<button>`, not add click
 * handlers to this one.
 */
const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, dot = false, children, ...props }, ref) => {
    return (
      <span ref={ref} className={cn(badgeVariants({ variant }), className)} {...props}>
        {dot && (
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 shrink-0 rounded-full bg-current"
          />
        )}
        {children}
      </span>
    )
  },
)
Badge.displayName = 'Badge'

export default Badge

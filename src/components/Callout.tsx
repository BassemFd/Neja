import { forwardRef } from 'react'
import type { HTMLAttributes, ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/cn'

/**
 * Inline message/admonition box (info/warning/success/danger) used to call
 * out a notice inline with content — e.g. docs admonitions. Colors are
 * sourced exclusively from the semantic --color-* CSS vars (see
 * docs/agents/token-conventions.md) so the palette switcher can re-theme
 * every instance at runtime without a code change.
 *
 * Token gap: token-conventions.md's role table has no dedicated
 * info/warning/success/danger roles (only background/surface/text/
 * textMuted/primary/primaryForeground/secondary/secondaryForeground/
 * accent/border). With 4 variants and exactly 4 non-text/surface roles
 * available (primary, secondary, accent, border), this component maps one
 * role per variant 1:1 (info->primary, success->secondary, warning->accent,
 * danger->border) rather than reusing a role across variants the way
 * Badge's 5-variant mapping had to. That avoids Badge's *guaranteed*
 * collisions from double-using a role, but it does NOT guarantee the four
 * roles resolve to four distinct hues under every Wada combination — two
 * semantic roles can still share a source color under some palettes (see
 * Badge.tsx/Badge.meta.ts for the general, already-documented version of
 * this finding). Concretely, under the combo handed off for this build
 * (comboId 284), secondary === accent === surface and border === primary,
 * so "success"/"warning" share their border+icon color and "info" shares
 * its border+icon color with the surrounding surface's outline via
 * "danger" — see Callout.meta.ts notes for the full statement. This is a
 * token-set limitation, not a bug in this component; per accessibility.md
 * every variant also carries a distinct glyph so meaning never depends on
 * hue alone.
 */
export const calloutVariants = cva(
  'flex items-start gap-3 rounded-[var(--radius-md)] border-l-4 bg-[var(--color-surface)] ' +
    'p-4 font-sans text-[var(--color-text)]',
  {
    variants: {
      variant: {
        info: 'border-[var(--color-primary)]',
        success: 'border-[var(--color-secondary)]',
        warning: 'border-[var(--color-accent)]',
        danger: 'border-[var(--color-border)]',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  },
)

/**
 * Glyph color per variant, kept in lockstep with the border color above so
 * the icon reinforces (never replaces) the color signal. Defined outside
 * `cva` because it targets a nested `<span>`, not the container.
 */
const glyphColorClasses: Record<CalloutVariant, string> = {
  info: 'text-[var(--color-primary)]',
  success: 'text-[var(--color-secondary)]',
  warning: 'text-[var(--color-accent)]',
  danger: 'text-[var(--color-border)]',
}

/**
 * Per accessibility.md, color is never the sole conveyor of meaning: each
 * variant renders a distinct leading glyph (a plain unicode character, no
 * icon library needed) in addition to its distinct border/tint color.
 */
const glyphs: Record<CalloutVariant, string> = {
  info: 'ⓘ',
  success: '✓',
  warning: '▲',
  danger: '✕',
}

const defaultTitles: Record<CalloutVariant, string> = {
  info: 'Info',
  success: 'Success',
  warning: 'Warning',
  danger: 'Danger',
}

export type CalloutVariant = NonNullable<VariantProps<typeof calloutVariants>['variant']>

export interface CalloutProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>,
    VariantProps<typeof calloutVariants> {
  /**
   * Heading rendered above the body text. Shadows the native `<div>`
   * `title` attribute (tooltip text) on purpose — a Callout's heading is
   * visible content, not hover-only metadata, so `HTMLAttributes['title']`
   * is omitted in favor of this richer `ReactNode` prop.
   */
  title?: ReactNode
  /**
   * Overrides the default glyph for the variant. Rarely needed — the
   * built-in glyphs already give each variant a shape distinct from color
   * alone (see accessibility.md).
   */
  icon?: ReactNode
}

/**
 * Non-interactive: renders a plain `<div role="note">`, no tabIndex, no
 * focus-visible ring, no disabled state — accessibility.md's
 * hover/focus-visible/disabled requirements apply only to interactive
 * controls, which this is not. `role="note"` marks it as supplementary
 * content associated with the surrounding content, without the
 * assertive/interrupting semantics of `role="alert"` (which would be wrong
 * here since a Callout is static page content, not a live update).
 */
const Callout = forwardRef<HTMLDivElement, CalloutProps>(
  ({ className, variant, title, icon, children, ...props }, ref) => {
    const resolvedVariant: CalloutVariant = variant ?? 'info'
    return (
      <div
        ref={ref}
        role="note"
        className={cn(calloutVariants({ variant: resolvedVariant }), className)}
        {...props}
      >
        <span
          aria-hidden="true"
          className={cn('shrink-0 leading-6 text-base', glyphColorClasses[resolvedVariant])}
        >
          {icon ?? glyphs[resolvedVariant]}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold leading-6">{title ?? defaultTitles[resolvedVariant]}</p>
          <div className="text-sm text-[var(--color-text-muted)]">{children}</div>
        </div>
      </div>
    )
  },
)
Callout.displayName = 'Callout'

export default Callout

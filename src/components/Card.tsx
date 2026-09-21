import { forwardRef } from 'react'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/cn'

/**
 * Content container/panel used to group related information (e.g. a title +
 * body text + optional footer actions). Colors are sourced exclusively from
 * the semantic --color-* CSS vars (see docs/agents/token-conventions.md) so
 * the palette switcher can re-theme every instance at runtime without a
 * code change.
 */
export const cardVariants = cva(
  // `block` is load-bearing: an interactive Card renders as <a>, which is
  // display:inline by default — without this, padding/width/radius/background
  // fragment across the text's inline line-boxes instead of forming one box.
  'block rounded-[var(--radius-md)] text-left font-sans transition-colors ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
    'focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-[var(--color-background)]',
  {
    variants: {
      variant: {
        default: 'bg-[var(--color-surface)] text-[var(--color-text)] border border-transparent',
        outlined: 'bg-transparent text-[var(--color-text)] border border-[var(--color-border)]',
      },
      interactive: {
        true: 'cursor-pointer hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      interactive: false,
    },
  },
)

interface CardOwnProps extends VariantProps<typeof cardVariants> {
  /**
   * Marks the card as a clickable link/button (hover lift + focus-visible
   * ring). Renders as `<a>` when `href` is provided, otherwise `<button>`.
   * Ignored (card renders as a plain `<div>`) when omitted/false.
   */
  interactive?: boolean
  className?: string
  children?: React.ReactNode
}

/** Non-interactive card: a plain `<div>`, per docs/agents/accessibility.md (no ARIA needed — it's not an interactive control). */
export type CardStaticProps = CardOwnProps & HTMLAttributes<HTMLDivElement>

/** Interactive card acting as a link. */
export type CardLinkProps = CardOwnProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { interactive: true; href: string }

/** Interactive card acting as a button. */
export type CardButtonProps = CardOwnProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { interactive: true; href?: undefined }

export type CardProps = CardStaticProps | CardLinkProps | CardButtonProps

/**
 * Semantic element choice follows accessibility.md: a plain `<div>` when
 * non-interactive, an `<a>` when interactive with `href`, a `<button>`
 * (native `disabled`, focus-visible ring, non-color disabled affordance)
 * when interactive without `href`.
 */
const Card = forwardRef<HTMLDivElement | HTMLAnchorElement | HTMLButtonElement, CardProps>(
  ({ className, variant, interactive, ...props }, ref) => {
    const classes = cn(cardVariants({ variant, interactive }), className)

    if (interactive && 'href' in props && props.href !== undefined) {
      const { href, ...anchorProps } = props as CardLinkProps
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={classes}
          {...anchorProps}
        />
      )
    }

    if (interactive) {
      const { type = 'button', ...buttonProps } = props as CardButtonProps
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type={type}
          className={classes}
          {...buttonProps}
        />
      )
    }

    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        className={classes}
        {...(props as HTMLAttributes<HTMLDivElement>)}
      />
    )
  },
)
Card.displayName = 'Card'

export default Card

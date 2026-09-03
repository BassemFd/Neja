# Accessibility baseline

- Contrast: enforced upstream by `resolvePalette()`'s `passesWcagAA` check and `listAccessibleCombinations()` — a component should never end up rendered under a combination that fails WCAG AA, because the switcher never offers one.
- Every interactive element needs a visible `:focus-visible` state that isn't color-alone (an outline/ring, not just a color shift — color shifts can fall below contrast thresholds under some Wada combinations even if the base state doesn't).
- Semantic HTML first: a `<button>` for actions, not a styled `<div onClick>`. Use ARIA attributes to supplement semantics, not replace them.
- Disabled states must be conveyed by more than color (reduced opacity + `aria-disabled`/`disabled`, not just a duller shade of `primary`).

`visual-reviewer` checks all of the above and rejects with specific findings if any is missing — see `handoff-contract.md` for the rejection shape.

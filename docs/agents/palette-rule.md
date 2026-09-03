# The palette rule

Every color anywhere in the product (`src/tokens/**`, `src/components/**`) must be one of the 159 named colors in Sanzo Wada's *A Dictionary of Color Combinations* (1930s), vendored at `src/data/wada-colors.json` (MIT-licensed dataset compiled by mattdesl: https://github.com/mattdesl/dictionary-of-colour-combinations). No exceptions, no "just this one hardcoded gray."

## Why a constraint instead of a free palette

The point of the whole exercise is that a *good* design system needs a rule tight enough that an agent (or a developer) can't quietly reintroduce inconsistency by picking a slightly-off hex from a color picker. Wada's book is the constraint: 348 numbered combinations, each already color-harmonized by a professional colorist, so picking *within* a combination is close to foolproof, and picking *outside* it is exactly the failure mode worth blocking.

## How it's enforced

1. **`src/lib/wada.ts`** loads the dataset and exposes `getCombination(id)`, which throws on any id that isn't one of the 348 — combinations are never invented, only looked up.
2. **`src/lib/palette.ts`**'s `resolvePalette(comboId)` deterministically maps a combination's raw colors onto the semantic token roles (`background`, `surface`, `text`, `primary`, …). It only ever assigns colors that were already in the combination — there's no path in that function that can produce a hex outside the dataset.
3. **`scripts/validate-palette.ts`** is the actual guardrail: it scans product source for `#rrggbb` literals and fails if any isn't in `wadaHexSet`. This runs as a pre-commit hook (`.claude/settings.json`) and as part of `palette-curator`'s and `visual-reviewer`'s own verification steps.

Steps 1–2 make it *easy* to stay compliant; step 3 is what makes it *impossible not to* — it's a script, not a suggestion, and it doesn't care whether a human or an agent introduced the violation.

## Picking a combination

`listAccessibleCombinations()` filters the 348 down to ones whose semantic mapping clears WCAG AA (`≥4.5:1` text/background, `≥3:1` for UI-element contrast). Only that filtered list should ever be offered in the palette switcher UI — an inaccessible combination existing in the book doesn't mean it belongs in the product's picker.

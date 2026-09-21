# AGENTS.md

This repo is two things at once, deliberately:

1. **A design system** whose colors are never freehand — every hex value must come from Sanzo Wada's 1930s *Dictionary of Color Combinations* (348 numbered combinations, 159 named colors, vendored at `src/data/wada-colors.json`, MIT-licensed dataset by mattdesl). See `docs/agents/palette-rule.md`.
2. **A demo of a native Claude Code multi-agent harness** that builds it. The pipeline is not decoration — it is how this repo is actually meant to be extended. See `docs/agents/pipeline.md`.

Read this file first. It's short on purpose; details live in `docs/agents/*.md` and are linked below rather than inlined.

## How the pipeline works

```text
palette-curator → component-builder → doc-writer → visual-reviewer
```

Each stage is a `.claude/agents/*.md` subagent. Each one's **only valid output is a JSON handoff object** — no prose report — so the next stage can consume it mechanically instead of re-reading a paragraph and guessing. See `docs/agents/handoff-contract.md` for the exact schema.

The orchestrator, `.claude/agents/design-system-pipeline.md`, chains all four for one component at a time. Run it with a component name and a one-line intent; it stops and reports if any stage's handoff fails verification — it does not "push through" a broken stage.

## Model selection is deliberate, not default

Each agent's frontmatter pins a specific model, chosen by how much judgment its task needs — mechanical lookup gets a fast/cheap model, architecture and visual judgment get a stronger one. The reasoning is written down in `docs/agents/model-selection.md`. Don't change an agent's model without updating that doc — the mismatch is the thing worth noticing if it ever happens.

## Guardrails live in code, not just in prompts

`scripts/validate-palette.ts` scans the token sources (`tokens/**`), the generated outputs (`src/tokens/**`, `build/tokens/**`) and `src/components/**` for hex literals and fails if any isn't one of Wada's 159 colors — and fails if a semantic token inlines a hex instead of referencing a primitive. It's wired as a pre-commit hook in `.claude/settings.json`. An agent forgetting the palette rule, or a human pasting a hex from a color picker, gets blocked by the script — not by hoping the instructions were followed. See `docs/agents/guardrails.md`.

## Tokens are a build step

Tokens are built by **Style Dictionary** from DTCG sources in `tokens/` into web (CSS), TypeScript, iOS and Android outputs — `npm run build:tokens`, run automatically before `dev` and `build`. `src/tokens/tokens.css` is generated; don't hand-edit it. Live re-theming still happens at runtime via `resolvePalette()`. See `docs/adr/0001-style-dictionary.md`.

## Conventions

- Token naming: `docs/agents/token-conventions.md`
- Component API shape: `docs/agents/component-conventions.md`
- Accessibility baseline: `docs/agents/accessibility.md`
- Pipeline status: `IMPLEMENTATION_STATUS.md` — tracks each component through 🔴 spec'd → 🟡 built → 🟢 documented+reviewed. Updated by the pipeline, not hand-maintained fiction.

## Stack

Vite + React + TypeScript + Tailwind CSS v4. Colors are CSS custom properties on `:root` (`src/tokens/tokens.css`) so re-theming is a runtime variable swap, not a rebuild — see `src/lib/palette.ts` for how a Wada combination is mapped onto the semantic token roles.

## Explicitly out of scope (don't add these without discussion)

- No GitHub-Actions label-triggered autonomous PR bot.
- No LLM gateway / multi-provider routing — model variation happens only via subagent frontmatter.
- No attempt to expose all 348 Wada combinations in the picker UI — only ones that clear WCAG AA (`listAccessibleCombinations()`).

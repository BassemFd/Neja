# Guardrails: what's enforced in code vs. what's asked for in prompts

A prompt instruction is advice; a script is a gate. This repo tries to put anything that would be genuinely bad if violated behind a gate, and leave everything else as documented convention.

## Enforced in code (can't be talked around)

- **Palette rule** — `scripts/validate-palette.ts`, wired as a pre-commit hook. Two checks: (1) any hex in `tokens/**`, `src/tokens/**`, `src/components/**` or the generated `build/tokens/**` must be one of Wada's 159 colors (Android's 8-digit ARGB is normalized first); (2) semantic token files (`tokens/semantic/**`) must contain **no** raw hex — a semantic token must reference a primitive (`{color.wada.*}`). See `palette-rule.md`.
- **Token freshness** — `npm run tokens:check` regenerates from `tokens/**` and fails if the committed generated outputs (`src/tokens/tokens.css`, `src/tokens/tokens.generated.ts`, `build/tokens/**`) differ. Runs in CI; catches a hand-edit or a stale commit of a generated file.
- **Build-time/runtime drift** — a Vitest test (`tokens/tokens.test.ts`) asserts the generated `--color-*` equal `resolvePalette(155)`, so the baked default canvas can't diverge from the live switcher's algorithm.
- **Commit message size** — a pre-commit hook rejecting commit messages over a fixed line/byte budget. This exists because agentic commits have a real failure mode of pasting entire test/build logs into the commit message body; the fix is a hard cap, not a reminder in a prompt.

Both hooks live in `.claude/settings.json` under `hooks.PreToolUse` / the commit-specific hook, and both run a real command with a real exit code — a hook that just prints a warning and continues is not a guardrail, it's a suggestion with extra steps.

## Documented as convention (asked for, not gated)

- Token naming (`token-conventions.md`)
- Component API shape (`component-conventions.md`)
- Accessibility baseline beyond contrast (`accessibility.md`)

These aren't gated because violating them produces a code-review-catchable problem, not a silent one — unlike a stray hex, which can slip in and look fine until someone changes the active palette and it doesn't move with everything else.

## The general test for "should this be a hook or a doc?"

Ask: if an agent (or a rushed human) ignores this, does the mistake announce itself immediately, or does it sit invisible until something unrelated breaks later? Silent failure modes get a hook. Loud ones get a doc and a code reviewer.

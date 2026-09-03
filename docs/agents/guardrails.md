# Guardrails: what's enforced in code vs. what's asked for in prompts

A prompt instruction is advice; a script is a gate. This repo tries to put anything that would be genuinely bad if violated behind a gate, and leave everything else as documented convention.

## Enforced in code (can't be talked around)

- **Palette rule** — `scripts/validate-palette.ts`, wired as a pre-commit hook. Fails the commit if any hex literal in `src/tokens/**` or `src/components/**` isn't one of Wada's 159 colors. See `palette-rule.md`.
- **Commit message size** — a pre-commit hook rejecting commit messages over a fixed line/byte budget. This exists because agentic commits have a real failure mode of pasting entire test/build logs into the commit message body; the fix is a hard cap, not a reminder in a prompt.

Both hooks live in `.claude/settings.json` under `hooks.PreToolUse` / the commit-specific hook, and both run a real command with a real exit code — a hook that just prints a warning and continues is not a guardrail, it's a suggestion with extra steps.

## Documented as convention (asked for, not gated)

- Token naming (`token-conventions.md`)
- Component API shape (`component-conventions.md`)
- Accessibility baseline beyond contrast (`accessibility.md`)

These aren't gated because violating them produces a code-review-catchable problem, not a silent one — unlike a stray hex, which can slip in and look fine until someone changes the active palette and it doesn't move with everything else.

## The general test for "should this be a hook or a doc?"

Ask: if an agent (or a rushed human) ignores this, does the mistake announce itself immediately, or does it sit invisible until something unrelated breaks later? Silent failure modes get a hook. Loud ones get a doc and a code reviewer.

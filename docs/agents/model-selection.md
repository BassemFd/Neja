# Model selection

Every subagent's model is chosen for what the stage actually demands, not defaulted to "the strongest model everywhere" or "the cheapest everywhere." This document is the rationale — if an agent's model is ever changed, update this alongside it, and if you notice a mismatch (a mechanical stage on a heavyweight model, or a judgment-heavy stage on a fast one) that's worth flagging, not shrugging at.

| Agent | Model | Why |
|---|---|---|
| `palette-curator` | `haiku` | The task is a deterministic lookup + mapping (`resolvePalette()` in `src/lib/palette.ts` does the actual math) plus picking which combination fits a requested mood from a filtered list. There's no architecture decision and no creative writing — a fast, cheap model does this exactly as well as an expensive one, and the guardrail script re-validates the output regardless of which model produced it. |
| `component-builder` | `sonnet` | Real code judgment: component API shape, variant modeling, accessibility attributes, matching existing conventions in `docs/agents/component-conventions.md`. Mistakes here are expensive to unwind later (every doc page and downstream component depends on the API being right), so this stage gets a model capable of holding the whole convention set in mind while writing code. |
| `doc-writer` | `haiku` | Mostly transcription: turning a component's already-decided props/variants into a props table and example matrix. The creative decisions were made upstream by component-builder; doc-writer is executing a known shape, not inventing one. |
| `visual-reviewer` | `opus` | The highest-judgment stage on purpose. It's evaluating actual visual quality (not just "does it compile") against the `frontend-design` skill's principles, checking contrast math is right, checking the palette guardrail didn't get worked around some clever way the script didn't anticipate, and writing specific, actionable rejection findings when something's off. This is the stage where a weaker model's review would be the least trustworthy — false approvals here are the worst failure mode in the whole pipeline, because everything downstream treats an approval as final. |

## The general rule

Ask "if this stage's output is wrong, how expensive is that, and how likely is a weaker model to get it wrong?" Mechanical/deterministic work with a code-level guardrail behind it tolerates a fast model — the guardrail is what actually enforces correctness, not the model's carefulness. Judgment calls with no downstream check (visual-reviewer's approval *is* the check) need the strongest model available.

This is also why the palette guardrail (`scripts/validate-palette.ts`) exists as code rather than as an instruction to `palette-curator`: it means the fast/cheap model doesn't need to be trusted to enforce the rule — the script enforces it regardless of what the model did.

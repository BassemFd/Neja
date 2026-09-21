# The pipeline

```text
palette-curator → component-builder → doc-writer → visual-reviewer
                                              ↑___________________|
                                         (rejection loops back to component-builder)
```

Run via the orchestrator, `.claude/agents/design-system-pipeline.md`, with a component name and a one-line intent (e.g. "Callout — an inline message box for warnings/info/success").

## Stage by stage

1. **palette-curator** picks (or is told) a Wada combination id, calls `resolvePalette()`, verifies `passesWcagAA`, hands off the resolved `SemanticPalette`.
2. **component-builder** takes the palette handoff + the component intent, writes `ComponentName.tsx` + `ComponentName.meta.ts`, runs `npm run validate:palette && npm run typecheck` as its own verification, hands off the file list + meta.
3. **doc-writer** takes the component handoff, generates the style-guide page (`src/pages/components/ComponentName.tsx` or equivalent route content) — variant matrix, props table, Preview/Code panel — from the `.meta.ts`, not from re-reading the component's implementation.
4. **visual-reviewer** takes the doc handoff, runs the mandatory token-freshness gate (`npm run build:tokens` + `npm run tokens:check`, so no component is approved against stale token outputs), re-runs the palette validator, checks contrast/state-coverage/accessibility conventions, and either approves (`status: "ready"`) or rejects with structured `findings`. Component findings route back to `component-builder`; a token-gate failure is a repo-state problem routed to the human instead.

The orchestrator caps rejection loops (default 3) to avoid an infinite back-and-forth — if a component still isn't approved after that many rounds, it stops and surfaces the last rejection to a human instead of continuing to loop.

## After a component is approved

The orchestrator updates `IMPLEMENTATION_STATUS.md`, moving the component to 🟢. That file is the audit trail that the pipeline actually ran, not just that someone declared it did.

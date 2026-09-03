# Handoff contract

Every pipeline agent (`palette-curator`, `component-builder`, `doc-writer`, `visual-reviewer`) emits exactly one JSON object as its final output — nothing before or after it except the JSON itself in a fenced code block. No prose summary, no "let me know if you'd like changes." The point is that the next agent (or the orchestrator) parses this mechanically; a paragraph can't be parsed reliably, a fixed schema can.

## Shape

```jsonc
{
  "agent": "component-builder",
  "status": "ready" | "blocked" | "rejected",
  "component": "Button",
  "files_touched": ["src/components/Button.tsx", "src/components/Button.stories.tsx"],
  "verification": {
    "command": "npm run validate:palette && npm run typecheck",
    "result": "pass" | "fail",
    "output": "<tail of the actual command output, not a description of it>"
  },
  "handoff": {
    "ready_for_next": true,
    "next_agent": "doc-writer",
    "payload": { /* whatever the next stage needs, e.g. component props, variant list */ }
  },
  "findings": [
    // only present when status is "blocked" or "rejected" — specific,
    // file:line where possible, never a vague "consider improving X"
  ]
}
```

## Rules

- `verification.result` must reflect a command that was **actually run**, with real output pasted into `verification.output`. An agent claiming `"pass"` without having run the command is a contract violation — flag it if you see it.
- `status: "rejected"` must always carry `findings`. A rejection with no findings is not actionable and should be treated as a bug in the agent, not a legitimate handoff.
- `handoff.ready_for_next: false` stops the orchestrator. It does not "try the next stage anyway and see."
- Anything not in the schema (extra commentary, apologies, hedging) does not belong in the handoff. If an agent has something to say that doesn't fit the schema, that's a sign the schema is missing a field — raise it, don't bolt prose on the side.

See `../../.claude/agents/design-system-pipeline.md` for how the orchestrator consumes these.

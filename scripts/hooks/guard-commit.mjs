#!/usr/bin/env node
// Claude Code PreToolUse hook: gates `git commit` Bash calls.
//
// Two guardrails, both concrete, both from docs/agents/guardrails.md:
//   1. Commit messages over a byte/line budget are rejected outright — the
//      documented failure mode (Zalando's agentic-engineering post) is an
//      agent pasting an entire test/build log into a commit message.
//   2. The palette validator (scripts/validate-palette.ts) must pass before
//      any commit lands, regardless of which model/agent authored the diff.
//
// Reads the Claude Code hook JSON payload from stdin. Exit 0 = allow silently.
// Exit 2 with a stderr message = block and surface the reason to the agent.

import { execSync } from 'node:child_process'

const MAX_COMMIT_MESSAGE_BYTES = 2000
const MAX_COMMIT_MESSAGE_LINES = 30

let raw = ''
process.stdin.setEncoding('utf-8')
for await (const chunk of process.stdin) raw += chunk

let payload
try {
  payload = JSON.parse(raw)
} catch {
  process.exit(0) // no parseable payload, nothing to gate
}

const command = payload?.tool_input?.command ?? ''
if (payload?.tool_name !== 'Bash' || !/\bgit\s+commit\b/.test(command)) {
  process.exit(0)
}

function extractMessage(cmd) {
  const heredoc = cmd.match(/-m\s+"\$\(cat\s+<<['"]?EOF['"]?\n([\s\S]*?)\nEOF\s*\)"/)
  if (heredoc) return heredoc[1]
  const quoted = cmd.match(/-m\s+"([\s\S]*?)"(?!\S)/) ?? cmd.match(/-m\s+'([\s\S]*?)'(?!\S)/)
  if (quoted) return quoted[1]
  return null
}

const message = extractMessage(command)
if (message !== null) {
  const bytes = Buffer.byteLength(message, 'utf-8')
  const lines = message.split('\n').length
  if (bytes > MAX_COMMIT_MESSAGE_BYTES || lines > MAX_COMMIT_MESSAGE_LINES) {
    console.error(
      `✗ Commit blocked: message is ${bytes} bytes / ${lines} lines (limit ${MAX_COMMIT_MESSAGE_BYTES} bytes / ${MAX_COMMIT_MESSAGE_LINES} lines). ` +
        `Looks like log output got pasted into the commit message — summarize instead.`,
    )
    process.exit(2)
  }
}

try {
  execSync('npm run validate:palette', { stdio: 'pipe' })
} catch (err) {
  console.error('✗ Commit blocked: palette guardrail failed.\n')
  console.error(err.stdout?.toString() ?? err.message)
  process.exit(2)
}

process.exit(0)

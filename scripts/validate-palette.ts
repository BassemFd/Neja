#!/usr/bin/env tsx
/**
 * Hard guardrail: fails the build if any hex color literal in product source
 * exists that is NOT one of the 159 colors from Sanzo Wada's "A Dictionary of
 * Color Combinations". This is enforced here, in code, deliberately outside
 * the model's control — no amount of prompt drift in an agent can bypass it,
 * because this script is what actually gates commits and CI, not an agent's
 * self-report.
 *
 * Scans src/tokens/** and src/components/** only: that's where token values
 * and component styling live. Docs/markdown are exempt since they may cite
 * hex values as prose examples.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { extname, join } from 'node:path'
import { wadaHexSet } from '../src/lib/wada'

const SCAN_DIRS = ['src/tokens', 'src/components']
const SCAN_EXTENSIONS = new Set(['.ts', '.tsx', '.css'])
const HEX_PATTERN = /#[0-9a-fA-F]{6}\b/g

function walk(dir: string): string[] {
  let out: string[] = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory()) {
      out = out.concat(walk(full))
    } else if (SCAN_EXTENSIONS.has(extname(full))) {
      out.push(full)
    }
  }
  return out
}

interface Violation {
  file: string
  hex: string
  line: number
}

const violations: Violation[] = []
let filesScanned = 0

for (const dir of SCAN_DIRS) {
  let files: string[]
  try {
    files = walk(dir)
  } catch {
    continue // dir doesn't exist yet
  }

  for (const file of files) {
    filesScanned++
    const content = readFileSync(file, 'utf-8')
    const lines = content.split('\n')
    lines.forEach((lineText, i) => {
      const matches = lineText.match(HEX_PATTERN)
      if (!matches) return
      for (const hex of matches) {
        if (!wadaHexSet.has(hex.toLowerCase())) {
          violations.push({ file, hex, line: i + 1 })
        }
      }
    })
  }
}

if (violations.length > 0) {
  console.error(`\n✗ Palette guardrail failed — ${violations.length} hex value(s) outside the Wada dictionary:\n`)
  for (const v of violations) {
    console.error(`  ${v.file}:${v.line}  ${v.hex}`)
  }
  console.error(
    `\nEvery color must come from one of Wada's 159 named colors (src/data/wada-colors.json). Use resolvePalette() / CSS var tokens instead of a literal hex.\n`,
  )
  process.exit(1)
}

console.log(`✓ Palette guardrail passed — ${filesScanned} file(s) scanned, 0 stray hex values.`)

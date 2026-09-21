#!/usr/bin/env tsx
/**
 * Hard guardrail: fails the build if any hex color literal in product source
 * exists that is NOT one of the 159 colors from Sanzo Wada's "A Dictionary of
 * Color Combinations". This is enforced here, in code, deliberately outside
 * the model's control — no amount of prompt drift in an agent can bypass it,
 * because this script is what actually gates commits and CI, not an agent's
 * self-report.
 *
 * Scans the DTCG token sources (tokens/**), the generated outputs
 * (src/tokens/**, build/tokens/**) and component styling (src/components/**):
 * that's where token values and component styling live. Docs/markdown are
 * exempt since they may cite hex values as prose examples.
 *
 * Two rules:
 *   1. Every hex anywhere must be one of Wada's 159 colors (8-digit ARGB from
 *      the Android output is normalized to its RGB before the check).
 *   2. Semantic token files (tokens/semantic/**) must contain NO raw hex — a
 *      semantic token must reference a primitive ({color.wada.*}), never inline
 *      a color. This catches drift where a generated semantic value stopped
 *      being a reference.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { extname, join, sep } from 'node:path'
import { wadaHexSet } from '../src/lib/wada'

const SCAN_DIRS = ['tokens', 'src/tokens', 'src/components', 'build/tokens']
const SCAN_EXTENSIONS = new Set(['.ts', '.tsx', '.css', '.json', '.xml'])
const HEX_PATTERN = /#[0-9a-fA-F]{8}\b|#[0-9a-fA-F]{6}\b/g

const SEMANTIC_DIR = join('tokens', 'semantic')

/** ARGB (#aarrggbb) from the Android output -> plain #rrggbb; 6-digit passes through. */
function toRgbHex(hex: string): string {
  return hex.length === 9 ? '#' + hex.slice(3) : hex
}

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
  rule: 'not-wada' | 'semantic-inline'
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
    const isSemantic = file.includes(SEMANTIC_DIR + sep)
    const content = readFileSync(file, 'utf-8')
    const lines = content.split('\n')
    lines.forEach((lineText, i) => {
      const matches = lineText.match(HEX_PATTERN)
      if (!matches) return
      for (const hex of matches) {
        if (isSemantic) {
          violations.push({ file, hex, line: i + 1, rule: 'semantic-inline' })
        } else if (!wadaHexSet.has(toRgbHex(hex).toLowerCase())) {
          violations.push({ file, hex, line: i + 1, rule: 'not-wada' })
        }
      }
    })
  }
}

if (violations.length > 0) {
  console.error(`\n✗ Palette guardrail failed — ${violations.length} violation(s):\n`)
  for (const v of violations) {
    const why = v.rule === 'semantic-inline' ? 'raw hex in a semantic token (must be a {reference})' : 'hex outside the Wada dictionary'
    console.error(`  ${v.file}:${v.line}  ${v.hex}  — ${why}`)
  }
  console.error(
    `\nEvery color must come from one of Wada's 159 named colors (src/data/wada-colors.json).\n` +
      `Semantic tokens must reference a primitive ({color.wada.*}); components use CSS var tokens — never a literal hex.\n`,
  )
  process.exit(1)
}

console.log(`✓ Palette guardrail passed — ${filesScanned} file(s) scanned, 0 stray hex values.`)

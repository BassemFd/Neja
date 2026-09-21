#!/usr/bin/env tsx
/**
 * Generates the DERIVED DTCG token sources — never hand-maintained:
 *
 *   tokens/primitives/wada-colors.json  the 159 Wada colors, from src/data
 *   tokens/semantic/canvas.json         the default canvas (combo 155),
 *                                       from resolvePalette() — the SAME
 *                                       algorithm the runtime switcher uses,
 *                                       so build-time and runtime cannot drift.
 *
 * Hand-authored sources (tokens/semantic/shell.json, tokens/radius.json) are
 * real design decisions and are NOT touched here.
 *
 * Every canvas role is emitted as a reference to a primitive ({color.wada.*}),
 * never a raw hex — the hex only ever lives in the primitives layer, which is
 * itself a mechanical copy of the dictionary.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { wadaColors } from '../src/lib/wada'
import { resolvePalette, type TokenRole } from '../src/lib/palette'

const DEFAULT_COMBO = 155

const kebab = (s: string): string =>
  s
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2') // camelCase boundary: textMuted -> text-Muted
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

// hex -> primitive ref name. First name wins if two share a hex.
const hexToName = new Map<string, string>()
for (const c of wadaColors) {
  const h = c.hex.toLowerCase()
  if (!hexToName.has(h)) hexToName.set(h, kebab(c.name))
}

function refFor(hex: string): string {
  const name = hexToName.get(hex.toLowerCase())
  if (!name) throw new Error(`Resolved hex ${hex} is not a Wada color — canvas cannot reference it`)
  return `{color.wada.${name}}`
}

// --- primitives ---
type DTCGColor = { $value: string; $type: 'color' }
const wada: Record<string, DTCGColor> = {}
for (const c of wadaColors) wada[kebab(c.name)] = { $value: c.hex.toLowerCase(), $type: 'color' }
const primitives = { color: { wada } }

// --- canvas (default = combo 155), role -> primitive ref ---
const roles = resolvePalette(DEFAULT_COMBO).tokens
const color: Record<string, DTCGColor> = {}
for (const [role, hex] of Object.entries(roles) as [TokenRole, string][]) {
  color[kebab(role)] = { $value: refFor(hex), $type: 'color' }
}
const canvas = { color }

mkdirSync('tokens/primitives', { recursive: true })
mkdirSync('tokens/semantic', { recursive: true })
const write = (p: string, o: unknown) => writeFileSync(p, JSON.stringify(o, null, 2) + '\n')
write('tokens/primitives/wada-colors.json', primitives)
write('tokens/semantic/canvas.json', canvas)

console.log(
  `✓ token sources generated — ${wadaColors.length} primitives, ${Object.keys(color).length} canvas roles from combo #${DEFAULT_COMBO}`,
)

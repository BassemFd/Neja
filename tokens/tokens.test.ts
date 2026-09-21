import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { resolvePalette, type TokenRole } from '../src/lib/palette'

/**
 * No drift between build-time and runtime.
 *
 * Style Dictionary bakes the default canvas into --color-* (from combo 155),
 * while the live palette switcher recomputes the same roles at runtime via
 * resolvePalette(). Both must agree, or the page would flash a different
 * default before JS hydrates than it settles on after. This test reads the
 * COMMITTED generated CSS (not a fresh build) so a stale commit fails too.
 */
const DEFAULT_COMBO = 155

/** --color-text-muted -> textMuted */
const roleToVar = (role: string) =>
  '--color-' + role.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

function parseColorVars(css: string): Record<string, string> {
  const out: Record<string, string> = {}
  for (const m of css.matchAll(/(--color-[a-z-]+):\s*(#[0-9a-fA-F]+)\s*;/g)) {
    out[m[1]] = m[2].toLowerCase()
  }
  return out
}

describe('tokens.css default canvas', () => {
  const css = readFileSync(new URL('../src/tokens/tokens.css', import.meta.url), 'utf-8')
  const vars = parseColorVars(css)
  const expected = resolvePalette(DEFAULT_COMBO).tokens

  it.each(Object.keys(expected) as TokenRole[])(
    '--color-%s matches resolvePalette(155)',
    (role) => {
      expect(vars[roleToVar(role)]).toBe(expected[role].toLowerCase())
    },
  )

  it('emits exactly the 10 canvas roles, no more, no fewer', () => {
    expect(Object.keys(vars).sort()).toEqual(
      (Object.keys(expected) as TokenRole[]).map(roleToVar).sort(),
    )
  })
})

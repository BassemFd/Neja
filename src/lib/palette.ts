import { combinationIds, getCombination, type WadaColor } from './wada'

export type TokenRole =
  | 'background'
  | 'surface'
  | 'text'
  | 'textMuted'
  | 'primary'
  | 'primaryForeground'
  | 'secondary'
  | 'secondaryForeground'
  | 'accent'
  | 'border'

export type SemanticPalette = Record<TokenRole, string>

export interface ResolvedPalette {
  comboId: number
  sourceColors: WadaColor[]
  tokens: SemanticPalette
  contrast: {
    textOnBackground: number
    textOnSurface: number
    primaryForegroundOnPrimary: number
  }
  passesWcagAA: boolean
}

function srgbChannel(c: number): number {
  const v = c / 255
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
}

/** WCAG relative luminance, 0 (black) to 1 (white). */
function relativeLuminance([r, g, b]: [number, number, number]): number {
  return 0.2126 * srgbChannel(r) + 0.7152 * srgbChannel(g) + 0.0722 * srgbChannel(b)
}

/** WCAG contrast ratio between two colors, 1 (no contrast) to 21 (black on white). */
export function contrastRatio(a: WadaColor, b: WadaColor): number {
  const la = relativeLuminance(a.rgb)
  const lb = relativeLuminance(b.rgb)
  const lighter = Math.max(la, lb)
  const darker = Math.min(la, lb)
  return (lighter + 0.05) / (darker + 0.05)
}

/** Chroma proxy from Lab a/b channels — how vivid/saturated a color reads, independent of lightness. */
function chroma(c: WadaColor): number {
  const [, a, b] = c.lab
  return Math.sqrt(a * a + b * b)
}

function lightness(c: WadaColor): number {
  return c.lab[0]
}

const WCAG_AA_TEXT = 4.5
const WCAG_AA_UI = 3

/**
 * Deterministically maps a Wada combination's raw colors onto semantic token
 * roles. This is the only place hex values are assigned to tokens — every
 * value it returns is a color that was already in the source combination,
 * so the output can never introduce a hex outside the dictionary.
 */
export function resolvePalette(comboId: number): ResolvedPalette {
  const colors = getCombination(comboId)
  const byLightness = [...colors].sort((x, y) => lightness(x) - lightness(y))

  const background = byLightness[byLightness.length - 1]
  const text = byLightness[0]

  // Surface: the lightest non-background color that still contrasts enough
  // against text to be readable. Trying candidates from lightest downward
  // (instead of always taking "second lightest") rescues combinations where
  // the second-lightest color happens to sit too close to text. Falling
  // back to background itself (rather than forcing a bad pick) is always
  // safe, since background already cleared the stricter text contrast.
  const surfaceCandidates = byLightness.slice(0, -1).reverse()
  const surface =
    surfaceCandidates.find((c) => contrastRatio(text, c) >= WCAG_AA_UI) ?? background

  // Primary/secondary/accent/border: sorted by chroma (most vivid first),
  // then cycled with modulo instead of clamping every extra role to the
  // last distinct color. With 4 colors available all four roles differ;
  // with fewer, roles repeat in a rotating pattern (e.g. primary===accent,
  // secondary===border) rather than three roles collapsing onto the same
  // single leftover color, which was the old behavior.
  //
  // The pool must never include `background`: a 2-color combination has
  // nothing left over after background+text, and falling back to the full
  // `colors` array (as this used to) could hand `background`'s own hex to
  // `primary` — a "primary" button that's literally the same color as the
  // page behind it, with no border to give it an edge either. Falling back
  // to `[text]` instead guarantees every one of these roles is at least as
  // readable against background as text itself already is.
  const remaining = colors.filter((c) => c !== background && c !== text)
  const pool = remaining.length > 0 ? remaining : [text]
  const byChroma = [...pool].sort((x, y) => chroma(y) - chroma(x))

  const primary = byChroma[0 % byChroma.length]
  const secondary = byChroma[1 % byChroma.length]
  const accent = byChroma[2 % byChroma.length]
  const border = byChroma[3 % byChroma.length]

  const white: WadaColor = {
    name: 'white',
    combinations: [],
    swatch: -1,
    cmyk: [0, 0, 0, 0],
    lab: [100, 0, 0],
    rgb: [255, 255, 255],
    hex: '#ffffff',
  }

  const primaryForeground = contrastRatio(text, primary) >= contrastRatio(white, primary) ? text : white
  const secondaryForeground = contrastRatio(text, secondary) >= contrastRatio(white, secondary) ? text : white

  const contrast = {
    textOnBackground: contrastRatio(text, background),
    textOnSurface: contrastRatio(text, surface),
    primaryForegroundOnPrimary: contrastRatio(primaryForeground, primary),
  }

  const passesWcagAA =
    contrast.textOnBackground >= WCAG_AA_TEXT &&
    contrast.textOnSurface >= WCAG_AA_UI &&
    contrast.primaryForegroundOnPrimary >= WCAG_AA_UI

  return {
    comboId,
    sourceColors: colors,
    tokens: {
      background: background.hex,
      surface: surface.hex,
      text: text.hex,
      textMuted: text.hex,
      primary: primary.hex,
      primaryForeground: primaryForeground.hex,
      secondary: secondary.hex,
      secondaryForeground: secondaryForeground.hex,
      accent: accent.hex,
      border: border.hex,
    },
    contrast,
    passesWcagAA,
  }
}

/** Combinations whose semantic mapping clears WCAG AA — the only ones the palette switcher should offer. */
export function listAccessibleCombinations(): number[] {
  return combinationIds.filter((id) => resolvePalette(id).passesWcagAA)
}

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

  const remaining = colors.filter((c) => c !== background && c !== text)
  const pool = remaining.length > 0 ? remaining : colors
  const byChroma = [...pool].sort((x, y) => chroma(y) - chroma(x))

  const primary = byChroma[0] ?? background
  const secondary = byChroma[1] ?? primary
  const accent = byChroma[2] ?? secondary

  const surface = byLightness[Math.max(0, byLightness.length - 2)] ?? background
  const border = byLightness[Math.max(0, Math.min(byLightness.length - 1, 1))] ?? text

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

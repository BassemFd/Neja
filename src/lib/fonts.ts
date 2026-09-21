export interface FontTheme {
  id: string
  name: string
  /** Terse label for the compact dock pill (the full name is too long to sit in the bar). */
  short: string
  mood: string
  display: string
  sans: string
  mono: string
}

/**
 * Curated font-pairing themes, switchable live the same way a Wada
 * combination is — a small, deliberate set of trios rather than a free
 * pick, each with its own character. Every family here is loaded upfront
 * in index.css's Google Fonts import so switching is instant, no network
 * wait. Picked to avoid the default AI-generated-page pairings (no
 * Fraunces+Inter, no Playfair+Lato) in favor of combinations with real,
 * distinct personality.
 */
export const FONT_THEMES: FontTheme[] = [
  {
    id: 'ink-and-brush',
    name: 'Ink & Brush',
    short: 'Ink',
    mood: 'The site default — a Japanese-designed mincho serif with brush-cut terminals, paired with a matching gothic sans.',
    display: "'Zen Old Mincho', serif",
    sans: "'Zen Kaku Gothic New', sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
  {
    id: 'spec-sheet',
    name: 'Spec Sheet',
    short: 'Spec',
    mood: 'Geometric, technical headlines over a plain engineering sans — the agent-harness half of this project\'s identity.',
    display: "'Space Grotesk', sans-serif",
    sans: "'IBM Plex Sans', sans-serif",
    mono: "'IBM Plex Mono', monospace",
  },
  {
    id: 'broadside',
    name: 'Broadside',
    short: 'Broadside',
    mood: 'Tall, condensed poster display over a plain, sturdy body face — a printed-notice, signage mood.',
    display: "'Big Shoulders Display', sans-serif",
    sans: "'Public Sans', sans-serif",
    mono: "'Space Mono', monospace",
  },
  {
    id: 'bibliotheque',
    name: 'Bibliothèque',
    short: 'Biblio',
    mood: 'A warm, moderate-contrast old-style serif for a literary, printed-book feel.',
    display: "'Petrona', serif",
    sans: "'Work Sans', sans-serif",
    mono: "'Fira Code', monospace",
  },
]

export const DEFAULT_FONT_THEME_ID = FONT_THEMES[0].id

export function getFontTheme(id: string): FontTheme {
  return FONT_THEMES.find((t) => t.id === id) ?? FONT_THEMES[0]
}

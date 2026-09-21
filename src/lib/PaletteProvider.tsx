import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { listAccessibleCombinations, resolvePalette, type ResolvedPalette, type TokenRole } from './palette'

const STORAGE_KEY = 'neja-combo-id'
const DEFAULT_COMBO_ID = 155

const CSS_VAR_BY_ROLE: Record<TokenRole, string> = {
  background: '--color-background',
  surface: '--color-surface',
  text: '--color-text',
  textMuted: '--color-text-muted',
  primary: '--color-primary',
  primaryForeground: '--color-primary-foreground',
  secondary: '--color-secondary',
  secondaryForeground: '--color-secondary-foreground',
  accent: '--color-accent',
  border: '--color-border',
}

interface PaletteContextValue {
  palette: ResolvedPalette
  comboId: number
  accessibleCombinations: number[]
  setComboId: (id: number) => void
}

const PaletteContext = createContext<PaletteContextValue | null>(null)

function applyToDocument(palette: ResolvedPalette) {
  const root = document.documentElement
  for (const role of Object.keys(CSS_VAR_BY_ROLE) as TokenRole[]) {
    root.style.setProperty(CSS_VAR_BY_ROLE[role], palette.tokens[role])
  }
  applyFavicon(palette)
}

/**
 * The tab favicon IS the current combination: a rounded square split into the
 * combo's raw Wada colors (2–4 of them), regenerated as an inline SVG data URI
 * on every switch. Rebuilt here rather than shipped as a static file so it
 * tracks resolvePalette() with zero drift — the same source of truth as the
 * --color-* vars above.
 */
function applyFavicon(palette: ResolvedPalette) {
  const colors = palette.sourceColors.map((c) => c.hex)
  const w = 32 / colors.length
  const stripes = colors
    // +0.6 overlap hides sub-pixel seams between stripes when rasterized small.
    .map((c, i) => `<rect x="${i * w}" width="${w + 0.6}" height="32" fill="${c}"/>`)
    .join('')
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">` +
    `<defs><clipPath id="r"><rect width="32" height="32" rx="7"/></clipPath></defs>` +
    `<g clip-path="url(#r)">${stripes}</g></svg>`

  let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
  if (!link) {
    link = document.createElement('link')
    link.rel = 'icon'
    document.head.appendChild(link)
  }
  link.type = 'image/svg+xml'
  link.href = 'data:image/svg+xml,' + encodeURIComponent(svg)
}

export function PaletteProvider({ children }: { children: ReactNode }) {
  const accessibleCombinations = useMemo(() => listAccessibleCombinations(), [])

  const [comboId, setComboIdState] = useState<number>(() => {
    if (typeof window === 'undefined') return DEFAULT_COMBO_ID
    const stored = Number(window.localStorage.getItem(STORAGE_KEY))
    return accessibleCombinations.includes(stored) ? stored : DEFAULT_COMBO_ID
  })

  const palette = useMemo(() => resolvePalette(comboId), [comboId])

  useEffect(() => {
    applyToDocument(palette)
    window.localStorage.setItem(STORAGE_KEY, String(comboId))
  }, [palette, comboId])

  const setComboId = useCallback(
    (id: number) => {
      if (!accessibleCombinations.includes(id)) return
      setComboIdState(id)
    },
    [accessibleCombinations],
  )

  const value = useMemo(
    () => ({ palette, comboId, accessibleCombinations, setComboId }),
    [palette, comboId, accessibleCombinations, setComboId],
  )

  return <PaletteContext.Provider value={value}>{children}</PaletteContext.Provider>
}

export function usePalette(): PaletteContextValue {
  const ctx = useContext(PaletteContext)
  if (!ctx) throw new Error('usePalette must be used within a PaletteProvider')
  return ctx
}

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

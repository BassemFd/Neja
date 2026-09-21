import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { DEFAULT_FONT_THEME_ID, FONT_THEMES, getFontTheme, type FontTheme } from './fonts'

const STORAGE_KEY = 'neja-font-theme-id'

interface FontContextValue {
  fontTheme: FontTheme
  setFontThemeId: (id: string) => void
}

const FontContext = createContext<FontContextValue | null>(null)

function applyToDocument(theme: FontTheme) {
  const root = document.documentElement
  root.style.setProperty('--font-display', theme.display)
  root.style.setProperty('--font-sans', theme.sans)
  root.style.setProperty('--font-mono', theme.mono)
}

export function FontProvider({ children }: { children: ReactNode }) {
  const [fontThemeId, setFontThemeIdState] = useState<string>(() => {
    if (typeof window === 'undefined') return DEFAULT_FONT_THEME_ID
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return FONT_THEMES.some((t) => t.id === stored) ? (stored as string) : DEFAULT_FONT_THEME_ID
  })

  const fontTheme = useMemo(() => getFontTheme(fontThemeId), [fontThemeId])

  useEffect(() => {
    applyToDocument(fontTheme)
    window.localStorage.setItem(STORAGE_KEY, fontThemeId)
  }, [fontTheme, fontThemeId])

  const setFontThemeId = useCallback((id: string) => {
    if (!FONT_THEMES.some((t) => t.id === id)) return
    setFontThemeIdState(id)
  }, [])

  const value = useMemo(() => ({ fontTheme, setFontThemeId }), [fontTheme, setFontThemeId])

  return <FontContext.Provider value={value}>{children}</FontContext.Provider>
}

export function useFontTheme(): FontContextValue {
  const ctx = useContext(FontContext)
  if (!ctx) throw new Error('useFontTheme must be used within a FontProvider')
  return ctx
}

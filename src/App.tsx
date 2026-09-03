import { Analytics } from '@vercel/analytics/react'
import { Outlet, Route, HashRouter, Routes } from 'react-router-dom'
import { PaletteProvider } from './lib/PaletteProvider'
import { SiteHeader } from './chrome/SiteHeader'
import { SiteFooter } from './chrome/SiteFooter'
import { PaletteDock } from './chrome/PaletteDock'
import { Home } from './pages/Home'
import { ComponentsIndex } from './pages/ComponentsIndex'
import { ButtonPage } from './pages/components/Button'
import { CardPage } from './pages/components/Card'
import { BadgePage } from './pages/components/Badge'
import { InputPage } from './pages/components/Input'
import { CalloutPage } from './pages/components/Callout'
import { PipelinePage } from './pages/PipelinePage'

function Shell() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--shell-ink)] pb-14">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
      <PaletteDock />
    </div>
  )
}

export default function App() {
  return (
    <PaletteProvider>
      <HashRouter>
        <Routes>
          <Route element={<Shell />}>
            <Route index element={<Home />} />
            <Route path="components" element={<ComponentsIndex />} />
            <Route path="components/button" element={<ButtonPage />} />
            <Route path="components/card" element={<CardPage />} />
            <Route path="components/badge" element={<BadgePage />} />
            <Route path="components/input" element={<InputPage />} />
            <Route path="components/callout" element={<CalloutPage />} />
            <Route path="pipeline" element={<PipelinePage />} />
          </Route>
        </Routes>
      </HashRouter>
      <Analytics />
    </PaletteProvider>
  )
}

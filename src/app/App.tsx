import { lazy } from 'react'
import { BrowserRouter, HashRouter, MemoryRouter, Route, Routes } from 'react-router-dom'
import { Shell } from './Shell'
import { HomePage } from '../pages/Home/HomePage'

import AboutPage from '../pages/About/AboutPage'
import ProjectsPage from '../pages/Projects/ProjectsPage'
import ProjectDetailPage from '../pages/ProjectDetail/ProjectDetailPage'
import ThinkingRoomPage from '../pages/ThinkingRoom/ThinkingRoomPage'
import ExperimentsPage from '../pages/Experiments/ExperimentsPage'
import ContactPage from '../pages/Contact/ContactPage'
import NotFoundPage from '../pages/NotFound/NotFoundPage'

// Sheets are small, so they ship together: no layout shift while a page
// chunk arrives. Only the article reader (which carries the Markdown parser)
// loads on demand.
const ArticlePage = lazy(() => import('../pages/Article/ArticlePage'))

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:slug" element={<ProjectDetailPage />} />
        <Route path="writing" element={<ThinkingRoomPage />} />
        <Route path="writing/:slug" element={<ArticlePage />} />
        <Route path="experiments" element={<ExperimentsPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

/**
 * Real paths by default. VITE_ROUTER=hash is for static hosts that cannot
 * rewrite unknown paths to index.html; VITE_ROUTER=memory is for embedded
 * previews where the page cannot own its URL.
 */
export function App() {
  const mode = import.meta.env.VITE_ROUTER ?? (import.meta.env.MODE === 'static' ? 'hash' : undefined)
  if (mode === 'memory') {
    return (
      <MemoryRouter>
        <AppRoutes />
      </MemoryRouter>
    )
  }
  if (mode === 'hash') {
    return (
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    )
  }
  return (
    <BrowserRouter basename={import.meta.env.VITE_BASENAME || undefined}>
      <AppRoutes />
    </BrowserRouter>
  )
}

import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/space-grotesk'
import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'
import 'katex/dist/katex.min.css'
import './index.css'
import App from './App.tsx'
import { PRESENTATION_PATH } from './presentation/config.ts'

// Prezentatsiya alohida bo‘lakda yuklanadi — simulyatorga ta’sir qilmaydi
const Presentation = lazy(() => import('./presentation/Presentation.tsx'))

const path = window.location.pathname.replace(/\/+$/, '')
const isPresentation = path === PRESENTATION_PATH

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isPresentation ? (
      <Suspense fallback={<div className="fixed inset-0 bg-ink" />}>
        <Presentation />
      </Suspense>
    ) : (
      <App />
    )}
  </StrictMode>,
)

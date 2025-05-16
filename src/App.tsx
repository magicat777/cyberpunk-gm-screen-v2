import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AppShell } from '@components/core/AppShell'
import { LoadingSpinner } from '@components/utility/LoadingSpinner'
import { ThemeProvider } from '@components/accessibility/ThemeProvider'
import './styles/App.css'

// Lazy load pages for better performance
const Dashboard = React.lazy(() => import('@/pages/Dashboard'))
const DiceRoller = React.lazy(() => import('@/pages/DiceRoller'))
const RulesReference = React.lazy(() => import('@/pages/RulesReference'))
const NotFound = React.lazy(() => import('@/pages/NotFound'))

function App() {
  return (
    <ThemeProvider>
      <AppShell>
        <Suspense fallback={<LoadingSpinner size="large" />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dice" element={<DiceRoller />} />
            <Route path="/rules" element={<RulesReference />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AppShell>
    </ThemeProvider>
  )
}

export default App
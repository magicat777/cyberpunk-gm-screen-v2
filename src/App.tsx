import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AppShell } from '@components/core/AppShell'
import { LoadingSpinner } from '@components/utility/LoadingSpinner'
import { ThemeProvider } from '@components/accessibility/ThemeProvider'
import './styles/App.css'

// Lazy load pages for better performance
const Dashboard = React.lazy(() => import('@/pages/Dashboard/Dashboard'))
const DiceRoller = React.lazy(() => import('@/pages/DiceRoller/DiceRoller'))
const RulesReference = React.lazy(() => import('@/pages/RulesReference/RulesReference'))
const GMTools = React.lazy(() => import('@/pages/GMTools/GMTools').then(m => ({default: m.GMTools})))
const Sessions = React.lazy(() => import('@/pages/Sessions/Sessions').then(m => ({default: m.Sessions})))
const Characters = React.lazy(() => import('@/pages/Characters/Characters').then(m => ({default: m.Characters})))
const Encounters = React.lazy(() => import('@/pages/Encounters/Encounters').then(m => ({default: m.Encounters})))
const NPCs = React.lazy(() => import('@/pages/NPCs/NPCs').then(m => ({default: m.NPCs})))
const Equipment = React.lazy(() => import('@/pages/Equipment/Equipment').then(m => ({default: m.Equipment})))
const Maps = React.lazy(() => import('@/pages/Maps/Maps').then(m => ({default: m.Maps})))
const Netrunning = React.lazy(() => import('@/pages/Netrunning/Netrunning').then(m => ({default: m.Netrunning})))
const NotFound = React.lazy(() => import('@/pages/NotFound/NotFound'))

function App() {
  return (
    <ThemeProvider>
      <AppShell>
        <Suspense fallback={<LoadingSpinner size="large" />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dice" element={<DiceRoller />} />
            <Route path="/rules" element={<RulesReference />} />
            <Route path="/gm-tools" element={<GMTools />} />
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/characters" element={<Characters />} />
            <Route path="/encounters" element={<Encounters />} />
            <Route path="/combat" element={<GMTools />} />
            <Route path="/npcs" element={<NPCs />} />
            <Route path="/cyberware" element={<Equipment />} />
            <Route path="/equipment" element={<Equipment />} />
            <Route path="/maps" element={<Maps />} />
            <Route path="/netrunning" element={<Netrunning />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AppShell>
    </ThemeProvider>
  )
}

export default App
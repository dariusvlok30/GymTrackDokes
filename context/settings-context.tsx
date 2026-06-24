'use client'

import { createContext, useContext, useState, useTransition } from 'react'
import { updateUserSettings } from '@/actions/profile'
import type { Units } from '@/types/database'

interface SettingsContextValue {
  units: Units
  theme: 'dark' | 'light'
  setUnits: (u: Units) => void
  setTheme: (t: 'dark' | 'light') => void
}

const SettingsContext = createContext<SettingsContextValue>({
  units: 'metric',
  theme: 'dark',
  setUnits: () => {},
  setTheme: () => {},
})

export function SettingsProvider({
  children,
  initialUnits,
  initialTheme,
}: {
  children: React.ReactNode
  initialUnits: Units
  initialTheme: 'dark' | 'light'
}) {
  const [units, setUnitsState] = useState<Units>(initialUnits)
  const [theme, setThemeState] = useState<'dark' | 'light'>(initialTheme)
  const [, startTransition] = useTransition()

  function setUnits(u: Units) {
    setUnitsState(u)
    startTransition(async () => {
      await updateUserSettings({ units: u })
    })
  }

  function setTheme(t: 'dark' | 'light') {
    setThemeState(t)
    document.documentElement.setAttribute('data-theme', t)
    localStorage.setItem('gymtrack-theme', t)
    startTransition(async () => {
      await updateUserSettings({ theme: t })
    })
  }

  return (
    <SettingsContext.Provider value={{ units, theme, setUnits, setTheme }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  return useContext(SettingsContext)
}

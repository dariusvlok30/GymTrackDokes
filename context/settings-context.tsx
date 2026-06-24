'use client'

import { createContext, useContext, useState, useTransition } from 'react'
import { updateUserSettings } from '@/actions/profile'
import type { Units, EnergyUnit } from '@/types/database'

interface SettingsContextValue {
  units: Units
  theme: 'dark' | 'light'
  energyUnit: EnergyUnit
  setUnits: (u: Units) => void
  setTheme: (t: 'dark' | 'light') => void
  setEnergyUnit: (e: EnergyUnit) => void
}

const SettingsContext = createContext<SettingsContextValue>({
  units: 'metric',
  theme: 'dark',
  energyUnit: 'kcal',
  setUnits: () => {},
  setTheme: () => {},
  setEnergyUnit: () => {},
})

export function SettingsProvider({
  children,
  initialUnits,
  initialTheme,
  initialEnergyUnit,
}: {
  children: React.ReactNode
  initialUnits: Units
  initialTheme: 'dark' | 'light'
  initialEnergyUnit: EnergyUnit
}) {
  const [units, setUnitsState] = useState<Units>(initialUnits)
  const [theme, setThemeState] = useState<'dark' | 'light'>(initialTheme)
  const [energyUnit, setEnergyUnitState] = useState<EnergyUnit>(initialEnergyUnit)
  const [, startTransition] = useTransition()

  function setUnits(u: Units) {
    setUnitsState(u)
    startTransition(async () => { await updateUserSettings({ units: u }) })
  }

  function setTheme(t: 'dark' | 'light') {
    setThemeState(t)
    document.documentElement.setAttribute('data-theme', t)
    localStorage.setItem('gymtrack-theme', t)
    startTransition(async () => { await updateUserSettings({ theme: t }) })
  }

  function setEnergyUnit(e: EnergyUnit) {
    setEnergyUnitState(e)
    startTransition(async () => { await updateUserSettings({ energy_unit: e }) })
  }

  return (
    <SettingsContext.Provider value={{ units, theme, energyUnit, setUnits, setTheme, setEnergyUnit }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  return useContext(SettingsContext)
}

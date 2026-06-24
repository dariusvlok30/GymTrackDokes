import type { Units } from '@/types/database'

export function displayWeight(kg: number | null, units: Units): string {
  if (kg == null) return '—'
  if (units === 'imperial') return `${(kg * 2.20462).toFixed(1)} lbs`
  return `${kg} kg`
}

export function displayHeight(cm: number | null, units: Units): string {
  if (cm == null) return '—'
  if (units === 'imperial') {
    const totalInches = cm / 2.54
    const ft = Math.floor(totalInches / 12)
    const inn = Math.round(totalInches % 12)
    return `${ft}′${inn}″`
  }
  return `${cm} cm`
}

export function kgToLbs(kg: number): number {
  return Math.round(kg * 2.20462 * 10) / 10
}

export function lbsToKg(lbs: number): number {
  return Math.round((lbs / 2.20462) * 10) / 10
}

export function cmToFtIn(cm: number): { ft: number; in: number } {
  const totalInches = cm / 2.54
  return { ft: Math.floor(totalInches / 12), in: Math.round(totalInches % 12) }
}

export function ftInToCm(ft: number, inches: number): number {
  return Math.round(((ft * 12 + inches) * 2.54) * 10) / 10
}

export function weightUnit(units: Units): string {
  return units === 'imperial' ? 'lbs' : 'kg'
}

export function heightUnit(units: Units): string {
  return units === 'imperial' ? 'ft/in' : 'cm'
}

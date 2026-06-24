'use server'

import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/server'
import { getCurrentDbUser } from './users'
import type { Units, ActivityLevel, EnergyUnit } from '@/types/database'

export async function saveOnboarding(data: {
  gender: 'male' | 'female' | 'other'
  date_of_birth: string
  height_cm: number
  weight_kg: number
  activity_level: ActivityLevel
  units: Units
}) {
  const user = await getCurrentDbUser()
  const db = createServiceClient()
  const { error } = await db
    .from('users')
    .update({
      gender: data.gender,
      date_of_birth: data.date_of_birth,
      height_cm: data.height_cm,
      weight_kg: data.weight_kg,
      activity_level: data.activity_level,
      units: data.units,
      onboarded: true,
    })
    .eq('id', user.id)
  if (error) throw new Error(error.message)
  revalidatePath('/dashboard')
  revalidatePath('/profile')
}

export async function updateUserSettings(data: {
  units?: Units
  theme?: 'dark' | 'light'
  energy_unit?: EnergyUnit
}) {
  const user = await getCurrentDbUser()
  const db = createServiceClient()
  const updates: Record<string, string> = {}
  if (data.units) updates.units = data.units
  if (data.theme) updates.theme = data.theme
  if (data.energy_unit) updates.energy_unit = data.energy_unit
  const { error } = await db.from('users').update(updates).eq('id', user.id)
  if (error) throw new Error(error.message)
  revalidatePath('/settings')
  revalidatePath('/profile')
}

export async function updateProfile(data: {
  height_cm?: number
  weight_kg?: number
  activity_level?: ActivityLevel
}) {
  const user = await getCurrentDbUser()
  const db = createServiceClient()
  const { error } = await db.from('users').update(data).eq('id', user.id)
  if (error) throw new Error(error.message)
  revalidatePath('/profile')
}

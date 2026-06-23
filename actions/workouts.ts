'use server'

import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/server'
import { getCurrentDbUser } from './users'
import type { Split, SplitDay, Exercise } from '@/types/database'

export async function getSplits(): Promise<Split[]> {
  const user = await getCurrentDbUser()
  const db = createServiceClient()
  const { data, error } = await db
    .from('splits')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as Split[]
}

export async function getSplitWithDays(splitId: string) {
  const user = await getCurrentDbUser()
  const db = createServiceClient()
  const { data, error } = await db
    .from('splits')
    .select(`
      *,
      split_days (
        *,
        day_exercises (
          *,
          exercise:exercises (*)
        )
      )
    `)
    .eq('id', splitId)
    .eq('user_id', user.id)
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function getActiveSplit() {
  const user = await getCurrentDbUser()
  const db = createServiceClient()
  const { data } = await db
    .from('splits')
    .select(`*, split_days(*, day_exercises(*, exercise:exercises(*)))`)
    .eq('user_id', user.id)
    .eq('is_active', true)
    .single()
  return data ?? null
}

export async function createSplit(formData: {
  name: string
  description?: string
  days_per_week?: number
}) {
  const user = await getCurrentDbUser()
  const db = createServiceClient()
  const { data, error } = await db
    .from('splits')
    .insert({
      user_id: user.id,
      name: formData.name,
      description: formData.description ?? null,
      days_per_week: formData.days_per_week ?? null,
      is_active: false,
    })
    .select()
    .single()
  if (error) throw new Error(error.message)
  revalidatePath('/workouts')
  return data
}

export async function setActiveSplit(splitId: string) {
  const user = await getCurrentDbUser()
  const db = createServiceClient()
  await db
    .from('splits')
    .update({ is_active: false })
    .eq('user_id', user.id)
  const { error } = await db
    .from('splits')
    .update({ is_active: true })
    .eq('id', splitId)
    .eq('user_id', user.id)
  if (error) throw new Error(error.message)
  revalidatePath('/workouts')
  revalidatePath('/dashboard')
}

export async function deleteSplit(splitId: string) {
  const user = await getCurrentDbUser()
  const db = createServiceClient()
  const { error } = await db
    .from('splits')
    .delete()
    .eq('id', splitId)
    .eq('user_id', user.id)
  if (error) throw new Error(error.message)
  revalidatePath('/workouts')
}

export async function addDayToSplit(splitId: string, dayData: {
  day_number: number
  name: string
  is_rest_day?: boolean
}) {
  const user = await getCurrentDbUser()
  const db = createServiceClient()
  const { data: split } = await db
    .from('splits')
    .select('id')
    .eq('id', splitId)
    .eq('user_id', user.id)
    .single()
  if (!split) throw new Error('Split not found')
  const { data, error } = await db
    .from('split_days')
    .insert({ split_id: splitId, ...dayData })
    .select()
    .single()
  if (error) throw new Error(error.message)
  revalidatePath(`/workouts/${splitId}`)
  return data
}

export async function addExerciseToDay(splitDayId: string, data: {
  exercise_id: string
  order_index: number
  sets?: number
  reps?: string
  rpe?: number
  notes?: string
}) {
  const db = createServiceClient()
  const { data: result, error } = await db
    .from('day_exercises')
    .insert({ split_day_id: splitDayId, ...data })
    .select()
    .single()
  if (error) throw new Error(error.message)
  revalidatePath('/workouts')
  return result
}

export async function removeExerciseFromDay(dayExerciseId: string) {
  const db = createServiceClient()
  const { error } = await db
    .from('day_exercises')
    .delete()
    .eq('id', dayExerciseId)
  if (error) throw new Error(error.message)
  revalidatePath('/workouts')
}

export async function getExercises(): Promise<Exercise[]> {
  const db = createServiceClient()
  const { data, error } = await db
    .from('exercises')
    .select('*')
    .order('name')
  if (error) throw new Error(error.message)
  return (data ?? []) as Exercise[]
}

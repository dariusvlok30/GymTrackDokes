'use server'

import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/server'
import { getCurrentDbUser } from './users'
import type { BodyweightLog } from '@/types/database'

export async function logBodyWeight(data: {
  weight: number
  unit?: string
  date?: string
  notes?: string
}) {
  const user = await getCurrentDbUser()
  const db = createServiceClient()
  const { error } = await db.from('bodyweight_log').insert({
    user_id: user.id,
    weight: data.weight,
    unit: data.unit ?? 'kg',
    date: data.date ?? new Date().toISOString().split('T')[0],
    notes: data.notes ?? null,
  })
  if (error) throw new Error(error.message)
  revalidatePath('/progress')
  revalidatePath('/profile')
}

export async function getBodyWeightLog(limit = 90): Promise<BodyweightLog[]> {
  const user = await getCurrentDbUser()
  const db = createServiceClient()
  const { data, error } = await db
    .from('bodyweight_log')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: true })
    .limit(limit)
  if (error) throw new Error(error.message)
  return (data ?? []) as BodyweightLog[]
}

export async function getPersonalRecords() {
  const user = await getCurrentDbUser()
  const db = createServiceClient()
  const { data, error } = await db
    .from('logged_sets')
    .select(`
      exercise_id,
      weight,
      reps,
      created_at,
      exercise:exercises(name, muscle_group),
      session:sessions!inner(user_id, date)
    `)
    .eq('sessions.user_id', user.id)
    .not('weight', 'is', null)
    .order('weight', { ascending: false })
  if (error) throw new Error(error.message)
  if (!data) return []

  const prMap = new Map<string, typeof data[0]>()
  for (const set of data) {
    const existing = prMap.get(set.exercise_id)
    if (!existing || (set.weight ?? 0) > (existing.weight ?? 0)) {
      prMap.set(set.exercise_id, set)
    }
  }
  return Array.from(prMap.values())
}

export async function getVolumeByWeek(weeks = 12) {
  const user = await getCurrentDbUser()
  const db = createServiceClient()
  const since = new Date()
  since.setDate(since.getDate() - weeks * 7)
  const { data, error } = await db
    .from('logged_sets')
    .select(`
      weight,
      reps,
      session:sessions!inner(user_id, date)
    `)
    .eq('sessions.user_id', user.id)
    .not('weight', 'is', null)
    .not('reps', 'is', null)
    .gte('sessions.date', since.toISOString().split('T')[0])
  if (error) throw new Error(error.message)
  if (!data) return []

  const weekMap = new Map<string, number>()
  for (const set of data) {
    const session = set.session as unknown as { date: string }
    const d = new Date(session.date)
    const monday = new Date(d)
    monday.setDate(d.getDate() - d.getDay() + 1)
    const key = monday.toISOString().split('T')[0]
    const vol = (set.weight ?? 0) * (set.reps ?? 0)
    weekMap.set(key, (weekMap.get(key) ?? 0) + vol)
  }

  return Array.from(weekMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([week, volume]) => ({ week, volume: Math.round(volume) }))
}

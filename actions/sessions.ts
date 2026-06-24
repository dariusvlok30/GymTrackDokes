'use server'

import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/server'
import { getCurrentDbUser } from './users'
import { format } from 'date-fns'
import type { Session, LoggedSet } from '@/types/database'

export async function startSession(data: {
  splitId?: string
  splitDayId?: string
  isRestDay?: boolean
  date?: string
}) {
  const user = await getCurrentDbUser()
  const db = createServiceClient()
  const date = data.date ?? format(new Date(), 'yyyy-MM-dd')
  const { data: session, error } = await db
    .from('sessions')
    .insert({
      user_id: user.id,
      split_id: data.splitId ?? null,
      split_day_id: data.splitDayId ?? null,
      date,
      is_rest_day: data.isRestDay ?? false,
    })
    .select()
    .single()
  if (error) throw new Error(error.message)
  revalidatePath('/log')
  return session
}

export async function logSet(data: {
  sessionId: string
  exerciseId: string
  setNumber: number
  weight: number | null
  reps: number | null
  rpe?: number | null
}) {
  const db = createServiceClient()
  const { error } = await db.from('logged_sets').insert({
    session_id: data.sessionId,
    exercise_id: data.exerciseId,
    set_number: data.setNumber,
    weight: data.weight,
    reps: data.reps,
    unit: 'kg',
    rpe: data.rpe ?? null,
  })
  if (error) throw new Error(error.message)
}

export async function finishSession(sessionId: string, durationSeconds: number) {
  const user = await getCurrentDbUser()
  const db = createServiceClient()
  const { error } = await db
    .from('sessions')
    .update({
      finished_at: new Date().toISOString(),
      duration_min: Math.floor(durationSeconds / 60),
    })
    .eq('id', sessionId)
    .eq('user_id', user.id)
  if (error) throw new Error(error.message)
  revalidatePath('/history')
  revalidatePath('/dashboard')
  revalidatePath('/calendar')
  revalidatePath('/log')
}

export async function getSessions(limit = 20): Promise<Session[]> {
  const user = await getCurrentDbUser()
  const db = createServiceClient()
  const { data, error } = await db
    .from('sessions')
    .select(`*, split:splits(name), split_day:split_days(name)`)
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .limit(limit)
  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as Session[]
}

export async function getSession(sessionId: string) {
  const user = await getCurrentDbUser()
  const db = createServiceClient()
  const { data, error } = await db
    .from('sessions')
    .select(`
      *,
      split:splits(name),
      split_day:split_days(name, day_exercises(*, exercise:exercises(*))),
      logged_sets(*, exercise:exercises(*))
    `)
    .eq('id', sessionId)
    .eq('user_id', user.id)
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function getSessionsForMonth(year: number, month: number) {
  const user = await getCurrentDbUser()
  const db = createServiceClient()
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`
  const endDate = new Date(year, month, 0).toISOString().split('T')[0]
  const { data, error } = await db
    .from('sessions')
    .select('id, date, is_rest_day, split_day:split_days(name)')
    .eq('user_id', user.id)
    .gte('date', startDate)
    .lte('date', endDate)
  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as Array<{
    id: string
    date: string
    is_rest_day: boolean
    split_day: { name: string } | null
  }>
}

export async function getPreviousBests(exerciseIds: string[], userId: string) {
  const db = createServiceClient()
  const results: Record<string, { weight: number | null; reps: number | null }> = {}
  for (const exerciseId of exerciseIds) {
    const { data } = await db
      .from('logged_sets')
      .select('weight, reps, sessions!inner(user_id)')
      .eq('exercise_id', exerciseId)
      .eq('sessions.user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    if (data) {
      results[exerciseId] = { weight: data.weight, reps: data.reps }
    }
  }
  return results
}

export async function getWorkoutStreak(): Promise<number> {
  const user = await getCurrentDbUser()
  const db = createServiceClient()
  const { data } = await db
    .from('sessions')
    .select('date')
    .eq('user_id', user.id)
    .eq('is_rest_day', false)
    .order('date', { ascending: false })
    .limit(60)
  if (!data || data.length === 0) return 0
  const dates = [...new Set(data.map(s => s.date))].sort((a, b) => b.localeCompare(a))
  let streak = 0
  const today = format(new Date(), 'yyyy-MM-dd')
  const yesterday = format(new Date(Date.now() - 86400000), 'yyyy-MM-dd')
  if (dates[0] !== today && dates[0] !== yesterday) return 0
  const startOffset = dates[0] === today ? 0 : 1
  for (let i = 0; i < dates.length; i++) {
    const expected = format(new Date(Date.now() - (i + startOffset) * 86400000), 'yyyy-MM-dd')
    if (dates[i] === expected) {
      streak++
    } else {
      break
    }
  }
  return streak
}

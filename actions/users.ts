'use server'

import { auth } from '@clerk/nextjs/server'
import { createServiceClient } from '@/lib/supabase/server'
import type { DbUser } from '@/types/database'

export async function getCurrentDbUser(): Promise<DbUser> {
  const { userId } = await auth()
  if (!userId) throw new Error('Not authenticated')

  const db = createServiceClient()
  const { data, error } = await db
    .from('users')
    .select('*')
    .eq('clerk_id', userId)
    .single()

  if (error || !data) {
    throw new Error('User not found in database. Please sign out and sign in again to sync your account.')
  }
  return data as DbUser
}

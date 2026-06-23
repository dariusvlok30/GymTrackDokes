'use server'

import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'
import type { DbUser } from '@/types/database'

export async function getCurrentDbUser(): Promise<DbUser> {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const db = createServiceClient()
  const { data } = await db
    .from('users')
    .select('*')
    .eq('clerk_id', userId)
    .single()

  if (!data) redirect('/account-sync')
  return data as DbUser
}

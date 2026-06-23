'use server'

import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'
import type { DbUser } from '@/types/database'

const ROLE_MAP: Record<string, string> = {
  'dariusvlok30@gmail.com': 'admin',
  'anke.strydom.mail@gmail.com': 'user',
}

export async function getCurrentDbUser(): Promise<DbUser> {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const db = createServiceClient()

  const { data: existing } = await db
    .from('users')
    .select('*')
    .eq('clerk_id', userId)
    .single()

  if (existing) return existing as DbUser

  // User not in DB yet — create them now from Clerk session data
  const clerkUser = await currentUser()
  if (!clerkUser) redirect('/sign-in')

  const email = clerkUser.emailAddresses[0]?.emailAddress
  if (!email || !ROLE_MAP[email]) redirect('/unauthorized')

  const { data: created, error } = await db
    .from('users')
    .insert({
      clerk_id: userId,
      email,
      name: `${clerkUser.firstName ?? ''} ${clerkUser.lastName ?? ''}`.trim() || null,
      role: ROLE_MAP[email],
    })
    .select()
    .single()

  if (error || !created) {
    console.error('[getCurrentDbUser] insert failed:', error?.message, '| email:', email)
    redirect('/account-sync')
  }
  return created as DbUser
}

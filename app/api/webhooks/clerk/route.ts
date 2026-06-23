import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

const ROLE_MAP: Record<string, string> = {
  'dariusvlok30@gmail.com': 'admin',
  'anke.strydom.mail@gmail.com': 'user',
}

export async function POST(req: Request) {
  const secret = process.env.CLERK_WEBHOOK_SECRET
  if (!secret) {
    return new Response('Webhook secret not configured', { status: 500 })
  }

  const wh = new Webhook(secret)
  const hdrs = await headers()
  const payload = await req.text()

  let evt: {
    type: string
    data: {
      id: string
      email_addresses?: Array<{ email_address: string }>
      first_name?: string | null
      last_name?: string | null
    }
  }

  try {
    evt = wh.verify(payload, {
      'svix-id': hdrs.get('svix-id') ?? '',
      'svix-timestamp': hdrs.get('svix-timestamp') ?? '',
      'svix-signature': hdrs.get('svix-signature') ?? '',
    }) as typeof evt
  } catch {
    return new Response('Invalid webhook signature', { status: 400 })
  }

  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  if (evt.type === 'user.created' || evt.type === 'user.updated') {
    const email = evt.data.email_addresses?.[0]?.email_address ?? ''
    const role = ROLE_MAP[email]

    if (!role) {
      return new Response('Email not on allowlist', { status: 403 })
    }

    const name = [evt.data.first_name, evt.data.last_name]
      .filter(Boolean)
      .join(' ')
      .trim()

    const { error } = await db.from('users').upsert(
      {
        clerk_id: evt.data.id,
        email,
        name: name || null,
        role,
      },
      { onConflict: 'clerk_id' }
    )

    if (error) {
      console.error('Supabase upsert error:', error)
      return new Response('Database error', { status: 500 })
    }
  }

  if (evt.type === 'user.deleted') {
    const { error } = await db.from('users').delete().eq('clerk_id', evt.data.id)
    if (error) {
      console.error('Supabase delete error:', error)
      return new Response('Database error', { status: 500 })
    }
  }

  return new Response('OK', { status: 200 })
}

import { UserButton } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import { createServiceClient } from '@/lib/supabase/server'
import { ThemeToggle } from './theme-toggle'

async function getUserName(): Promise<string> {
  try {
    const { userId } = await auth()
    if (!userId) return ''
    const db = createServiceClient()
    const { data } = await db.from('users').select('name').eq('clerk_id', userId).single()
    return data?.name ?? ''
  } catch {
    return ''
  }
}

interface TopbarProps {
  title: string
}

export async function Topbar({ title }: TopbarProps) {
  const name = await getUserName()

  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-background/80 backdrop-blur-sm sticky top-0 z-30">
      <h1 className="text-base font-semibold text-foreground">{title}</h1>
      <div className="flex items-center gap-2">
        {name && (
          <span className="text-sm text-muted-foreground hidden sm:block">
            Hey, <span className="text-foreground font-medium">{name.split(' ')[0]}</span>
          </span>
        )}
        <ThemeToggle />
        <UserButton
          appearance={{
            elements: { avatarBox: 'h-8 w-8' },
          }}
        />
      </div>
    </header>
  )
}

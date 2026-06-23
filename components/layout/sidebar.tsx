'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useTheme } from '@/hooks/use-theme'
import {
  LayoutDashboard,
  Dumbbell,
  Plus,
  History,
  CalendarDays,
  TrendingUp,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/workouts', label: 'My Splits', icon: Dumbbell },
  { href: '/log', label: 'Log Workout', icon: Plus },
  { href: '/history', label: 'History', icon: History },
  { href: '/calendar', label: 'Calendar', icon: CalendarDays },
  { href: '/progress', label: 'Progress', icon: TrendingUp },
]

export function Sidebar() {
  const pathname = usePathname()
  const theme = useTheme()

  return (
    <aside className="hidden md:flex h-screen w-60 flex-col bg-card border-r border-border fixed left-0 top-0 z-40">
      <div className="flex h-14 items-center gap-2.5 px-5 border-b border-border shrink-0">
        <img
          src={theme === 'dark' ? '/logo-white.png' : '/logo.png'}
          alt="GymTrack"
          className="h-8 w-8 object-contain"
        />
        <span className="text-lg font-bold tracking-tight text-foreground">GymTrack</span>
      </div>
      <nav className="flex-1 space-y-0.5 p-3 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-3 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">GymTrack v1.0</p>
      </div>
    </aside>
  )
}

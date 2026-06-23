'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useTheme } from '@/hooks/use-theme'
import { LayoutDashboard, Dumbbell, Plus, History, TrendingUp } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/workouts', label: 'Splits', icon: Dumbbell },
  { href: '/log', label: 'Log', icon: Plus, primary: true },
  { href: '/history', label: 'History', icon: History },
  { href: '/progress', label: 'Progress', icon: TrendingUp },
]

export function BottomNav() {
  const pathname = usePathname()
  const theme = useTheme()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border pb-safe">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href))

          if (item.primary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-0.5 -mt-5"
              >
                <div className={cn(
                  'h-14 w-14 rounded-full flex items-center justify-center shadow-lg transition-all overflow-hidden',
                  isActive ? 'bg-primary scale-105' : 'bg-primary'
                )}>
                  <img
                    src={theme === 'dark' ? '/logo.png' : '/logo-white.png'}
                    alt="Log"
                    className="h-10 w-10 object-contain"
                  />
                </div>
                <span className="text-[10px] font-medium text-muted-foreground">{item.label}</span>
              </Link>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-0.5 px-3 py-2 min-w-[3rem]"
            >
              <Icon className={cn(
                'h-5 w-5 transition-colors',
                isActive ? 'text-foreground' : 'text-muted-foreground'
              )} />
              <span className={cn(
                'text-[10px] font-medium transition-colors',
                isActive ? 'text-foreground' : 'text-muted-foreground'
              )}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

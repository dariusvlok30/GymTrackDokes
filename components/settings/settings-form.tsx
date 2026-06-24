'use client'

import { useSettings } from '@/context/settings-context'
import { useClerk, useUser } from '@clerk/nextjs'
import { cn } from '@/lib/utils'
import { Moon, Sun, Ruler, Scale } from 'lucide-react'
import type { Units } from '@/types/database'

function OptionCard({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex-1 rounded-xl border-2 py-3 px-4 text-sm font-semibold transition-colors text-left',
        selected
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-border bg-card text-foreground hover:border-primary/40'
      )}
    >
      {children}
    </button>
  )
}

export function SettingsForm() {
  const { units, theme, setUnits, setTheme } = useSettings()
  const { signOut } = useClerk()
  const { user } = useUser()

  return (
    <div className="p-4 space-y-4 max-w-2xl mx-auto">

      {/* ── Appearance ── */}
      <section className="rounded-2xl border border-border bg-card p-5 space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Appearance</h2>

        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Theme</p>
          <div className="flex gap-3">
            <OptionCard selected={theme === 'dark'} onClick={() => setTheme('dark')}>
              <Moon className="h-4 w-4 mb-1" />
              <span className="block">Dark</span>
            </OptionCard>
            <OptionCard selected={theme === 'light'} onClick={() => setTheme('light')}>
              <Sun className="h-4 w-4 mb-1" />
              <span className="block">Light</span>
            </OptionCard>
          </div>
        </div>
      </section>

      {/* ── Units ── */}
      <section className="rounded-2xl border border-border bg-card p-5 space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Units</h2>

        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Measurement system</p>
          <div className="flex gap-3">
            <OptionCard selected={units === 'metric'} onClick={() => setUnits('metric' as Units)}>
              <Ruler className="h-4 w-4 mb-1" />
              <span className="block">Metric</span>
              <span className="block text-xs font-normal text-muted-foreground">kg, cm</span>
            </OptionCard>
            <OptionCard selected={units === 'imperial'} onClick={() => setUnits('imperial' as Units)}>
              <Scale className="h-4 w-4 mb-1" />
              <span className="block">Imperial</span>
              <span className="block text-xs font-normal text-muted-foreground">lbs, ft</span>
            </OptionCard>
          </div>
          <p className="text-xs text-muted-foreground">
            Affects weight display in workouts, history, and your health profile.
          </p>
        </div>
      </section>

      {/* ── Account ── */}
      <section className="rounded-2xl border border-border bg-card p-5 space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Account</h2>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Name</span>
            <span className="text-sm font-medium text-foreground">
              {user?.firstName} {user?.lastName}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Email</span>
            <span className="text-sm font-medium text-foreground truncate max-w-[60%]">
              {user?.primaryEmailAddress?.emailAddress}
            </span>
          </div>
        </div>

        <button
          onClick={() => signOut({ redirectUrl: '/sign-in' })}
          className="w-full h-11 rounded-xl border border-destructive/40 text-destructive text-sm font-semibold hover:bg-destructive/10 transition-colors"
        >
          Sign out
        </button>
      </section>

      <p className="text-center text-xs text-muted-foreground pb-4">GymTrack v1.0</p>
    </div>
  )
}

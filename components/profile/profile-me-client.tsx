'use client'

import { useSettings } from '@/context/settings-context'
import { useClerk } from '@clerk/nextjs'
import { cn } from '@/lib/utils'
import { Moon, Sun, Ruler, Scale, Zap, LogOut } from 'lucide-react'
import type { Units, EnergyUnit } from '@/types/database'

function ToggleRow({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string; sub?: string; icon: React.ReactNode }[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex gap-2">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            'flex-1 rounded-xl border-2 py-3 px-3 text-left transition-all active:scale-[0.97]',
            value === opt.value
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border bg-secondary/40 text-foreground'
          )}
        >
          <div className="flex items-center gap-2">
            <span className={cn('shrink-0', value === opt.value ? 'text-primary-foreground' : 'text-muted-foreground')}>
              {opt.icon}
            </span>
            <div>
              <p className="text-sm font-semibold leading-none">{opt.label}</p>
              {opt.sub && (
                <p className={cn('text-[11px] mt-0.5', value === opt.value ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
                  {opt.sub}
                </p>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}

export function ProfileMeClient() {
  const { units, theme, energyUnit, setUnits, setTheme, setEnergyUnit } = useSettings()
  const { signOut } = useClerk()

  return (
    <div className="space-y-3">

      {/* ── Appearance ── */}
      <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Appearance</p>
        <ToggleRow
          value={theme}
          onChange={v => setTheme(v as 'dark' | 'light')}
          options={[
            { value: 'dark',  label: 'Dark',  sub: 'Black bg', icon: <Moon className="h-4 w-4" /> },
            { value: 'light', label: 'Light', sub: 'White bg',  icon: <Sun className="h-4 w-4" /> },
          ]}
        />
      </div>

      {/* ── Units ── */}
      <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Measurement Units</p>
        <ToggleRow
          value={units}
          onChange={v => setUnits(v as Units)}
          options={[
            { value: 'metric',   label: 'Metric',   sub: 'kg · cm',  icon: <Ruler className="h-4 w-4" /> },
            { value: 'imperial', label: 'Imperial', sub: 'lbs · ft', icon: <Scale className="h-4 w-4" /> },
          ]}
        />
      </div>

      {/* ── Energy unit ── */}
      <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Energy Display</p>
        <ToggleRow
          value={energyUnit}
          onChange={v => setEnergyUnit(v as EnergyUnit)}
          options={[
            { value: 'kcal', label: 'kcal', sub: 'Calories',    icon: <Zap className="h-4 w-4" /> },
            { value: 'kj',   label: 'kJ',   sub: 'Kilojoules',  icon: <Zap className="h-4 w-4" /> },
          ]}
        />
      </div>

      {/* ── Sign out ── */}
      <button
        onClick={() => signOut({ redirectUrl: '/sign-in' })}
        className="w-full h-12 rounded-xl border border-border text-muted-foreground text-sm font-medium flex items-center justify-center gap-2 hover:text-destructive hover:border-destructive/40 transition-colors"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>

      <p className="text-center text-[11px] text-muted-foreground pb-2">GymTrack v1.0</p>
    </div>
  )
}

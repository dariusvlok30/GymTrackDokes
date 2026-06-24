'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { logBodyWeight } from '@/actions/progress'
import { useSettings } from '@/context/settings-context'
import { kgToLbs, lbsToKg, weightUnit } from '@/lib/units'
import { format } from 'date-fns'
import { Check, Plus } from 'lucide-react'
import type { BodyweightLog } from '@/types/database'

interface Props {
  recentEntries: BodyweightLog[]
}

export function WeightLogClient({ recentEntries }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const { units } = useSettings()

  const today = new Date().toISOString().split('T')[0]
  const [date, setDate] = useState(today)
  const [weightVal, setWeightVal] = useState('')
  const [done, setDone] = useState(false)

  function handleSubmit() {
    const parsed = parseFloat(weightVal)
    if (!parsed || parsed <= 0) return

    const weightKg = units === 'imperial' ? lbsToKg(parsed) : parsed

    startTransition(async () => {
      await logBodyWeight({ weight: weightKg, unit: 'kg', date })
      setWeightVal('')
      setDone(true)
      setTimeout(() => setDone(false), 2000)
      router.refresh()
    })
  }

  const wu = weightUnit(units)

  return (
    <div className="rounded-2xl border border-border bg-card p-4 space-y-4">
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Log Bodyweight</p>

      {/* Date row */}
      <div className="flex gap-2 items-center">
        <button
          onClick={() => setDate(today)}
          className={`shrink-0 rounded-lg px-3 h-9 text-xs font-semibold border transition-colors ${
            date === today
              ? 'bg-primary text-primary-foreground border-primary'
              : 'border-border text-muted-foreground bg-secondary/40 hover:text-foreground'
          }`}
        >
          Today
        </button>
        <input
          type="date"
          value={date}
          max={today}
          onChange={e => setDate(e.target.value)}
          className="h-9 flex-1 rounded-lg border border-border bg-card text-foreground text-xs px-3 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Weight + save row */}
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <input
            type="number"
            inputMode="decimal"
            step="0.1"
            placeholder={units === 'imperial' ? '175.0' : '80.0'}
            value={weightVal}
            onChange={e => setWeightVal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            className="w-full h-11 rounded-xl border border-border bg-background text-foreground px-4 pr-14 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">{wu}</span>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isPending || !weightVal}
          className={`shrink-0 h-11 w-11 rounded-xl flex items-center justify-center transition-all active:scale-95 disabled:opacity-40 ${
            done ? 'bg-emerald-500' : 'bg-primary'
          }`}
        >
          {done
            ? <Check className="h-5 w-5 text-white" />
            : isPending
              ? <div className="h-4 w-4 border-2 border-primary-foreground/50 border-t-primary-foreground rounded-full animate-spin" />
              : <Plus className="h-5 w-5 text-primary-foreground" />
          }
        </button>
      </div>

      {/* Recent entries */}
      {recentEntries.length > 0 && (
        <div className="space-y-1 pt-1 border-t border-border">
          {recentEntries.slice(-6).reverse().map(entry => {
            const displayW = units === 'imperial'
              ? `${kgToLbs(entry.weight).toFixed(1)} lbs`
              : `${entry.weight} kg`
            return (
              <div key={entry.id} className="flex items-center justify-between py-1">
                <span className="text-xs text-muted-foreground">
                  {format(new Date(entry.date + 'T00:00:00'), 'MMM d')}
                </span>
                <span className="text-sm font-semibold text-foreground tabular-nums">{displayW}</span>
              </div>
            )
          })}
        </div>
      )}

      {recentEntries.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-2">No entries yet — log your first weight above</p>
      )}
    </div>
  )
}

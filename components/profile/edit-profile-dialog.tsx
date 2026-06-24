'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateProfile } from '@/actions/profile'
import { lbsToKg, ftInToCm, cmToFtIn, kgToLbs } from '@/lib/units'
import type { DbUser, ActivityLevel } from '@/types/database'

const ACTIVITY_OPTIONS: { value: ActivityLevel; label: string }[] = [
  { value: 'sedentary',   label: 'Sedentary' },
  { value: 'light',       label: 'Lightly Active (1–3×/week)' },
  { value: 'moderate',    label: 'Moderately Active (3–5×/week)' },
  { value: 'active',      label: 'Very Active (6–7×/week)' },
  { value: 'very_active', label: 'Extremely Active (2×/day)' },
]

export function EditProfileDialog({ user }: { user: DbUser }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const units = user.units

  const initFtIn = user.height_cm ? cmToFtIn(user.height_cm) : { ft: 0, in: 0 }
  const initLbs = user.weight_kg ? kgToLbs(user.weight_kg) : 0

  const [heightCm, setHeightCm] = useState(user.height_cm?.toString() ?? '')
  const [heightFt, setHeightFt] = useState(initFtIn.ft.toString())
  const [heightIn, setHeightIn] = useState(initFtIn.in.toString())
  const [weightVal, setWeightVal] = useState(
    units === 'imperial' ? initLbs.toString() : (user.weight_kg?.toString() ?? '')
  )
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(user.activity_level ?? 'moderate')

  function handleSave() {
    let finalHeightCm: number
    let finalWeightKg: number

    if (units === 'metric') {
      finalHeightCm = parseFloat(heightCm)
      finalWeightKg = parseFloat(weightVal)
    } else {
      finalHeightCm = ftInToCm(parseFloat(heightFt) || 0, parseFloat(heightIn) || 0)
      finalWeightKg = lbsToKg(parseFloat(weightVal))
    }

    startTransition(async () => {
      await updateProfile({
        height_cm: finalHeightCm,
        weight_kg: finalWeightKg,
        activity_level: activityLevel,
      })
      setOpen(false)
      router.refresh()
    })
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-xs font-medium text-primary hover:underline"
      >
        Edit
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-card rounded-2xl border border-border p-5 space-y-4">
        <h3 className="text-base font-semibold text-foreground">Edit Stats</h3>

        {/* Height */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Height</label>
          {units === 'metric' ? (
            <div className="relative">
              <input
                type="number" inputMode="decimal"
                value={heightCm}
                onChange={e => setHeightCm(e.target.value)}
                className="w-full h-11 rounded-xl border border-border bg-background text-foreground px-4 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">cm</span>
            </div>
          ) : (
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input type="number" inputMode="numeric" value={heightFt} onChange={e => setHeightFt(e.target.value)}
                  className="w-full h-11 rounded-xl border border-border bg-background text-foreground px-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">ft</span>
              </div>
              <div className="relative flex-1">
                <input type="number" inputMode="numeric" value={heightIn} onChange={e => setHeightIn(e.target.value)}
                  className="w-full h-11 rounded-xl border border-border bg-background text-foreground px-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">in</span>
              </div>
            </div>
          )}
        </div>

        {/* Weight */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Weight</label>
          <div className="relative">
            <input
              type="number" inputMode="decimal"
              value={weightVal}
              onChange={e => setWeightVal(e.target.value)}
              className="w-full h-11 rounded-xl border border-border bg-background text-foreground px-4 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              {units === 'metric' ? 'kg' : 'lbs'}
            </span>
          </div>
        </div>

        {/* Activity */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Activity Level</label>
          <select
            value={activityLevel}
            onChange={e => setActivityLevel(e.target.value as ActivityLevel)}
            className="w-full h-11 rounded-xl border border-border bg-background text-foreground px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {ACTIVITY_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 pt-1">
          <button
            onClick={() => setOpen(false)}
            className="flex-1 h-11 rounded-xl border border-border text-foreground text-sm font-semibold hover:bg-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isPending}
            className="flex-1 h-11 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50 transition-opacity"
          >
            {isPending ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

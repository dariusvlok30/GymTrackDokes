import { getCurrentDbUser } from '@/actions/users'
import { getBodyWeightLog } from '@/actions/progress'
import { EditProfileDialog } from '@/components/profile/edit-profile-dialog'
import { ProfileMeClient } from '@/components/profile/profile-me-client'
import { WeightLogClient } from '@/components/profile/weight-log-client'
import { displayWeight, displayHeight, displayEnergy } from '@/lib/units'
import { Pencil } from 'lucide-react'

export const dynamic = 'force-dynamic'

// ── Health calculations ─────────────────────────────────────────────────────

function calcAge(dob: string): number {
  const birth = new Date(dob)
  const now = new Date()
  let age = now.getFullYear() - birth.getFullYear()
  const m = now.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--
  return age
}

function calcBMI(weightKg: number, heightCm: number): number {
  const h = heightCm / 100
  return Math.round((weightKg / (h * h)) * 10) / 10
}

function bmiCategory(bmi: number): { label: string; textColor: string; ringColor: string } {
  if (bmi < 18.5) return { label: 'Underweight', textColor: 'text-sky-400',    ringColor: 'border-sky-400' }
  if (bmi < 25)   return { label: 'Normal',      textColor: 'text-emerald-400', ringColor: 'border-emerald-400' }
  if (bmi < 30)   return { label: 'Overweight',  textColor: 'text-amber-400',  ringColor: 'border-amber-400' }
  return              { label: 'Obese',       textColor: 'text-red-400',    ringColor: 'border-red-400' }
}

const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9,
}
const ACTIVITY_LABELS: Record<string, string> = {
  sedentary: 'Sedentary', light: 'Lightly Active', moderate: 'Moderately Active',
  active: 'Very Active', very_active: 'Extremely Active',
}

function calcTDEE(weightKg: number, heightCm: number, age: number, gender: string, activity: string): number {
  const bmr = gender === 'male'
    ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
    : 10 * weightKg + 6.25 * heightCm - 5 * age - 161
  return Math.round(bmr * (ACTIVITY_MULTIPLIERS[activity] ?? 1.55))
}

// ── Page ────────────────────────────────────────────────────────────────────

export default async function MePage() {
  const user = await getCurrentDbUser()
  const { weight_kg, height_cm, date_of_birth, gender, activity_level, units, energy_unit, name, email } = user
  const recentWeightLog = await getBodyWeightLog(10)

  const hasStats = weight_kg != null && height_cm != null && date_of_birth != null && gender != null

  let bmi: number | null = null
  let bmiCat: ReturnType<typeof bmiCategory> | null = null
  let tdee: number | null = null
  let age: number | null = null

  if (hasStats) {
    age = calcAge(date_of_birth!)
    bmi = calcBMI(weight_kg!, height_cm!)
    bmiCat = bmiCategory(bmi)
    tdee = calcTDEE(weight_kg!, height_cm!, age, gender!, activity_level ?? 'moderate')
  }

  const initials = (name ?? email ?? 'U')
    .split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="min-h-screen bg-background pb-24">

      {/* ── Profile header ── */}
      <div className="bg-card border-b border-border px-4 pt-12 pb-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center shrink-0">
            <span className="text-xl font-bold text-primary-foreground">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-foreground truncate">{name ?? 'Athlete'}</h1>
            <p className="text-sm text-muted-foreground truncate">{email}</p>
          </div>
          <EditProfileDialog user={user} />
        </div>
      </div>

      <div className="p-4 space-y-3 max-w-2xl mx-auto">

        {/* ── No stats CTA ── */}
        {!hasStats && (
          <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mx-auto">
              <Pencil className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-semibold text-foreground">Set up your health stats</p>
            <p className="text-xs text-muted-foreground">Add your height, weight and birthday to see BMI, daily calorie needs and more.</p>
            <EditProfileDialog user={user} />
          </div>
        )}

        {/* ── Key metrics row ── */}
        {hasStats && bmi != null && bmiCat != null && tdee != null && (
          <>
            <div className="grid grid-cols-2 gap-3">
              {/* BMI card */}
              <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">BMI</p>
                <div className="flex items-center gap-3">
                  <div className={`h-14 w-14 rounded-full border-[3px] ${bmiCat.ringColor} flex items-center justify-center shrink-0`}>
                    <span className="text-lg font-bold text-foreground">{bmi}</span>
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${bmiCat.textColor}`}>{bmiCat.label}</p>
                    <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                      &lt;18.5 Under<br />18.5–24.9 OK<br />25+ Over
                    </p>
                  </div>
                </div>
              </div>

              {/* TDEE card */}
              <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Daily Energy</p>
                <p className="text-2xl font-bold text-foreground tabular-nums">{displayEnergy(tdee, energy_unit ?? 'kcal')}</p>
                <p className="text-[11px] text-muted-foreground">to maintain weight</p>
                <p className="text-[10px] text-muted-foreground">{ACTIVITY_LABELS[activity_level ?? 'moderate']}</p>
              </div>
            </div>

            {/* Calorie targets */}
            <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Energy Targets</p>
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-sky-500/10 border border-sky-500/20 p-3 text-center">
                  <p className="text-[10px] text-sky-400 font-semibold mb-1">Cut</p>
                  <p className="text-sm font-bold text-foreground">{displayEnergy(tdee - 500, energy_unit ?? 'kcal')}</p>
                  <p className="text-[9px] text-muted-foreground">−500 deficit</p>
                </div>
                <div className="rounded-xl bg-primary/10 border border-primary/30 p-3 text-center">
                  <p className="text-[10px] text-primary font-semibold mb-1">Maintain</p>
                  <p className="text-sm font-bold text-primary">{displayEnergy(tdee, energy_unit ?? 'kcal')}</p>
                  <p className="text-[9px] text-muted-foreground">maintenance</p>
                </div>
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-center">
                  <p className="text-[10px] text-emerald-400 font-semibold mb-1">Bulk</p>
                  <p className="text-sm font-bold text-foreground">{displayEnergy(tdee + 500, energy_unit ?? 'kcal')}</p>
                  <p className="text-[9px] text-muted-foreground">+500 surplus</p>
                </div>
              </div>
            </div>

            {/* Body stats */}
            <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Body Stats</p>
              <div className="grid grid-cols-4 gap-2">
                <div className="text-center">
                  <p className="text-base font-bold text-foreground">{displayHeight(height_cm, units)}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Height</p>
                </div>
                <div className="text-center">
                  <p className="text-base font-bold text-foreground">{displayWeight(weight_kg, units)}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Weight</p>
                </div>
                <div className="text-center">
                  <p className="text-base font-bold text-foreground">{age}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Age</p>
                </div>
                <div className="text-center">
                  <p className="text-base font-bold text-foreground capitalize">{gender}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Sex</p>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground">Mifflin-St Jeor formula · tap edit to update</p>
            </div>
          </>
        )}

        {/* ── Weight log ── */}
        <WeightLogClient recentEntries={recentWeightLog} />

        {/* ── Divider ── */}
        <div className="flex items-center gap-3 py-1">
          <div className="flex-1 h-px bg-border" />
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Preferences</p>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* ── Client settings (theme, units, sign out) ── */}
        <ProfileMeClient />
      </div>
    </div>
  )
}

'use server'

import { getCurrentDbUser } from '@/actions/users'
import { Topbar } from '@/components/layout/topbar'
import { EditProfileDialog } from '@/components/profile/edit-profile-dialog'
import { displayWeight, displayHeight } from '@/lib/units'

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

function bmiCategory(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-400' }
  if (bmi < 25)   return { label: 'Normal',      color: 'text-green-400' }
  if (bmi < 30)   return { label: 'Overweight',  color: 'text-yellow-400' }
  return              { label: 'Obese',       color: 'text-red-400' }
}

const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  sedentary:   1.2,
  light:       1.375,
  moderate:    1.55,
  active:      1.725,
  very_active: 1.9,
}

const ACTIVITY_LABELS: Record<string, string> = {
  sedentary:   'Sedentary',
  light:       'Lightly Active',
  moderate:    'Moderately Active',
  active:      'Very Active',
  very_active: 'Extremely Active',
}

function calcTDEE(weightKg: number, heightCm: number, age: number, gender: string, activityLevel: string): number {
  let bmr: number
  if (gender === 'male') {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161
  }
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] ?? 1.55
  return Math.round(bmr * multiplier)
}

export default async function ProfilePage() {
  const user = await getCurrentDbUser()
  const { weight_kg, height_cm, date_of_birth, gender, activity_level, units } = user

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

  return (
    <div className="min-h-screen bg-background">
      <Topbar title="Health & Profile" />

      <div className="p-4 space-y-4 max-w-2xl mx-auto">

        {/* ── Body Stats ── */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">Body Stats</h2>
            <EditProfileDialog user={user} />
          </div>

          {hasStats ? (
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-secondary/60 p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Height</p>
                <p className="text-sm font-bold text-foreground">{displayHeight(height_cm, units)}</p>
              </div>
              <div className="rounded-xl bg-secondary/60 p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Weight</p>
                <p className="text-sm font-bold text-foreground">{displayWeight(weight_kg, units)}</p>
              </div>
              <div className="rounded-xl bg-secondary/60 p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Age</p>
                <p className="text-sm font-bold text-foreground">{age} yrs</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No stats yet — click Edit to add them.</p>
          )}
        </div>

        {/* ── BMI ── */}
        {bmi != null && bmiCat != null && (
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-base font-semibold text-foreground mb-3">BMI</h2>
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full border-4 border-border flex flex-col items-center justify-center shrink-0">
                <span className="text-2xl font-bold text-foreground">{bmi}</span>
              </div>
              <div>
                <span className={`text-lg font-bold ${bmiCat.color}`}>{bmiCat.label}</span>
                <p className="text-xs text-muted-foreground mt-1">Underweight &lt;18.5 · Normal 18.5–24.9 · Overweight 25–29.9 · Obese ≥30</p>
              </div>
            </div>
          </div>
        )}

        {/* ── TDEE ── */}
        {tdee != null && (
          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <h2 className="text-base font-semibold text-foreground">Daily Calorie Needs</h2>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-foreground">{tdee.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground">kcal / day</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Maintenance calories to keep your current weight · Activity: {ACTIVITY_LABELS[activity_level ?? 'moderate']}
            </p>
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="rounded-xl bg-secondary/60 p-3 text-center">
                <p className="text-[10px] text-muted-foreground mb-1">Cut (−500)</p>
                <p className="text-sm font-bold text-foreground">{(tdee - 500).toLocaleString()}</p>
              </div>
              <div className="rounded-xl bg-primary/10 border border-primary/20 p-3 text-center">
                <p className="text-[10px] text-muted-foreground mb-1">Maintain</p>
                <p className="text-sm font-bold text-primary">{tdee.toLocaleString()}</p>
              </div>
              <div className="rounded-xl bg-secondary/60 p-3 text-center">
                <p className="text-[10px] text-muted-foreground mb-1">Bulk (+500)</p>
                <p className="text-sm font-bold text-foreground">{(tdee + 500).toLocaleString()}</p>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground">Calculated using Mifflin-St Jeor formula</p>
          </div>
        )}
      </div>
    </div>
  )
}

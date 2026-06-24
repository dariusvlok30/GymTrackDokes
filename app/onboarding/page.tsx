'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { saveOnboarding } from '@/actions/profile'
import { lbsToKg, ftInToCm } from '@/lib/units'
import type { ActivityLevel, Units } from '@/types/database'

const ACTIVITY_OPTIONS: { value: ActivityLevel; label: string; desc: string }[] = [
  { value: 'sedentary',   label: 'Sedentary',        desc: 'Desk job, little to no exercise' },
  { value: 'light',       label: 'Lightly Active',   desc: '1–3 days / week' },
  { value: 'moderate',    label: 'Moderately Active', desc: '3–5 days / week' },
  { value: 'active',      label: 'Very Active',       desc: '6–7 days / week' },
  { value: 'very_active', label: 'Extremely Active',  desc: 'Athlete or 2× per day' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  // Step 1
  const [gender, setGender] = useState<'male' | 'female' | null>(null)
  const [dob, setDob] = useState('')

  // Step 2
  const [units, setUnits] = useState<Units>('metric')
  const [heightCm, setHeightCm] = useState('')
  const [heightFt, setHeightFt] = useState('')
  const [heightIn, setHeightIn] = useState('')
  const [weightVal, setWeightVal] = useState('')

  // Step 3
  const [activityLevel, setActivityLevel] = useState<ActivityLevel | null>(null)

  function canNextStep1() {
    return gender !== null && dob !== ''
  }

  function canNextStep2() {
    if (units === 'metric') return heightCm !== '' && weightVal !== ''
    return heightFt !== '' && weightVal !== ''
  }

  function canFinish() {
    return activityLevel !== null
  }

  function handleSubmit() {
    if (!gender || !dob || !activityLevel) return
    setError(null)

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
      try {
        await saveOnboarding({
          gender,
          date_of_birth: dob,
          height_cm: finalHeightCm,
          weight_kg: finalWeightKg,
          activity_level: activityLevel,
          units,
        })
        router.push('/dashboard')
      } catch {
        setError('Something went wrong saving your profile. Please try again.')
      }
    })
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      {/* Logo + title */}
      <div className="flex flex-col items-center gap-3 mb-8">
        <img src="/logo-white.png" alt="GymTrack" className="h-12 w-12" />
        <h1 className="text-2xl font-bold text-foreground">Welcome to GymTrack</h1>
        <p className="text-sm text-muted-foreground text-center">Let&apos;s set up your profile to personalise your experience</p>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3].map(s => (
          <div key={s} className={`h-2 rounded-full transition-all ${s === step ? 'w-8 bg-primary' : s < step ? 'w-2 bg-primary/60' : 'w-2 bg-border'}`} />
        ))}
      </div>

      <div className="w-full max-w-sm">
        {/* ── STEP 1: About You ── */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-1">About you</h2>
              <p className="text-sm text-muted-foreground">Used for calorie calculations</p>
            </div>

            {/* Sex */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Biological sex</label>
              <div className="grid grid-cols-2 gap-3">
                {(['male', 'female'] as const).map(g => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    className={`rounded-xl border-2 py-4 text-sm font-semibold capitalize transition-colors ${
                      gender === g
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-card text-foreground hover:border-primary/50'
                    }`}
                  >
                    {g === 'male' ? '♂ Male' : '♀ Female'}
                  </button>
                ))}
              </div>
            </div>

            {/* Date of birth */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="dob">Date of birth</label>
              <input
                id="dob"
                type="date"
                value={dob}
                onChange={e => setDob(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full h-11 rounded-xl border border-border bg-card text-foreground px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!canNextStep1()}
              className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-40 transition-opacity"
            >
              Continue
            </button>
          </div>
        )}

        {/* ── STEP 2: Body Stats ── */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-1">Body stats</h2>
              <p className="text-sm text-muted-foreground">Used to calculate BMI and daily calorie needs</p>
            </div>

            {/* Units toggle */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Units</label>
              <div className="grid grid-cols-2 gap-3">
                {(['metric', 'imperial'] as const).map(u => (
                  <button
                    key={u}
                    onClick={() => setUnits(u)}
                    className={`rounded-xl border-2 py-3 text-sm font-semibold capitalize transition-colors ${
                      units === u
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-card text-foreground hover:border-primary/50'
                    }`}
                  >
                    {u === 'metric' ? 'Metric (kg/cm)' : 'Imperial (lbs/ft)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Height */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Height</label>
              {units === 'metric' ? (
                <div className="relative">
                  <input
                    type="number"
                    inputMode="decimal"
                    placeholder="175"
                    value={heightCm}
                    onChange={e => setHeightCm(e.target.value)}
                    className="w-full h-11 rounded-xl border border-border bg-card text-foreground px-4 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">cm</span>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      inputMode="numeric"
                      placeholder="5"
                      value={heightFt}
                      onChange={e => setHeightFt(e.target.value)}
                      className="w-full h-11 rounded-xl border border-border bg-card text-foreground px-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">ft</span>
                  </div>
                  <div className="relative flex-1">
                    <input
                      type="number"
                      inputMode="numeric"
                      placeholder="10"
                      value={heightIn}
                      onChange={e => setHeightIn(e.target.value)}
                      className="w-full h-11 rounded-xl border border-border bg-card text-foreground px-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">in</span>
                  </div>
                </div>
              )}
            </div>

            {/* Weight */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Weight</label>
              <div className="relative">
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder={units === 'metric' ? '75' : '165'}
                  value={weightVal}
                  onChange={e => setWeightVal(e.target.value)}
                  className="w-full h-11 rounded-xl border border-border bg-card text-foreground px-4 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  {units === 'metric' ? 'kg' : 'lbs'}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 h-12 rounded-xl border border-border text-foreground font-semibold hover:bg-secondary transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!canNextStep2()}
                className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-40 transition-opacity"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Activity Level ── */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-1">Activity level</h2>
              <p className="text-sm text-muted-foreground">How active are you outside the gym?</p>
            </div>

            <div className="space-y-2">
              {ACTIVITY_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setActivityLevel(opt.value)}
                  className={`w-full rounded-xl border-2 px-4 py-3 text-left transition-colors ${
                    activityLevel === opt.value
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-card hover:border-primary/40'
                  }`}
                >
                  <p className={`text-sm font-semibold ${activityLevel === opt.value ? 'text-primary' : 'text-foreground'}`}>
                    {opt.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>

            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 h-12 rounded-xl border border-border text-foreground font-semibold hover:bg-secondary transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!canFinish() || isPending}
                className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-40 transition-opacity"
              >
                {isPending ? 'Saving…' : "Let's go!"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

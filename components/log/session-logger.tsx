'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { logSet, finishSession } from '@/actions/sessions'
import { cn } from '@/lib/utils'
import { CheckCircle2, Circle, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

interface SetState {
  weight: number
  reps: number
  completed: boolean
}

interface ExerciseState {
  exercise_id: string
  exercise_name: string
  muscle_group: string | null
  planned_sets: number
  planned_reps: string | null
  rpe: number | null
  prev_weight: number | null
  prev_reps: number | null
  sets: SetState[]
  expanded: boolean
}

interface SessionLoggerProps {
  sessionId: string
  exercises: Omit<ExerciseState, 'sets' | 'expanded'>[]
  startedAt: string
  splitDayName: string
}

function parseRepDefault(planned: string | null): number {
  if (!planned) return 10
  const n = parseInt(planned.split('-')[0])
  return isNaN(n) ? 10 : n
}

function buildSets(planned: number, prevWeight: number | null, plannedReps: string | null): SetState[] {
  return Array.from({ length: planned }, () => ({
    weight: prevWeight ?? 0,
    reps: parseRepDefault(plannedReps),
    completed: false,
  }))
}

function formatTime(s: number) {
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  return `${m}:${String(sec).padStart(2, '0')}`
}

function Stepper({
  value,
  onChange,
  step = 1,
  min = 0,
  disabled,
}: {
  value: number
  onChange: (v: number) => void
  step?: number
  min?: number
  disabled?: boolean
}) {
  return (
    <div className="flex items-center">
      <button
        type="button"
        disabled={disabled || value <= min}
        onClick={() => onChange(Math.max(min, Math.round((value - step) * 100) / 100))}
        className="h-9 w-8 rounded-l-lg border border-border bg-secondary flex items-center justify-center text-foreground disabled:opacity-30 active:bg-muted transition-colors text-base font-light shrink-0"
      >
        −
      </button>
      <div className="h-9 w-10 border-t border-b border-border bg-background flex items-center justify-center shrink-0">
        <span className="text-sm font-semibold tabular-nums">{value % 1 === 0 ? value : value.toFixed(1)}</span>
      </div>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(Math.round((value + step) * 100) / 100)}
        className="h-9 w-8 rounded-r-lg border border-border bg-secondary flex items-center justify-center text-foreground disabled:opacity-30 active:bg-muted transition-colors text-base font-light shrink-0"
      >
        +
      </button>
    </div>
  )
}

export function SessionLogger({ sessionId, exercises: initialExercises, startedAt, splitDayName }: SessionLoggerProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [exercises, setExercises] = useState<ExerciseState[]>(() =>
    initialExercises.map((ex, i) => ({
      ...ex,
      sets: buildSets(ex.planned_sets, ex.prev_weight, ex.planned_reps),
      expanded: i === 0,
    }))
  )

  const [elapsed, setElapsed] = useState(() =>
    Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000)
  )

  useEffect(() => {
    const start = new Date(startedAt).getTime()
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [startedAt])

  function updateSet(exIdx: number, setIdx: number, field: 'weight' | 'reps', value: number) {
    setExercises(prev =>
      prev.map((ex, i) =>
        i !== exIdx ? ex : {
          ...ex,
          sets: ex.sets.map((s, j) => j === setIdx ? { ...s, [field]: value } : s),
        }
      )
    )
  }

  function toggleSet(exIdx: number, setIdx: number) {
    const ex = exercises[exIdx]
    const set = ex.sets[setIdx]
    if (set.completed) return

    startTransition(async () => {
      await logSet({
        sessionId,
        exerciseId: ex.exercise_id,
        setNumber: setIdx + 1,
        weight: set.weight > 0 ? set.weight : null,
        reps: set.reps > 0 ? set.reps : null,
        rpe: ex.rpe,
      })
    })

    setExercises(prev =>
      prev.map((ex, i) => {
        if (i !== exIdx) return ex
        const newSets = ex.sets.map((s, j) => j === setIdx ? { ...s, completed: true } : s)
        const allDone = newSets.every(s => s.completed)
        return { ...ex, sets: newSets, expanded: !allDone }
      }).map((ex, i) => {
        if (i === exIdx + 1) {
          const prevDone = exercises[exIdx].sets
            .map((s, j) => j === exercises[exIdx].sets.length - 1 ? true : s.completed)
            .every(Boolean)
          if (prevDone) return { ...ex, expanded: true }
        }
        return ex
      })
    )
  }

  function toggleExpanded(exIdx: number) {
    setExercises(prev =>
      prev.map((ex, i) => i === exIdx ? { ...ex, expanded: !ex.expanded } : ex)
    )
  }

  function handleFinish() {
    if (!confirm('Finish this workout?')) return
    startTransition(async () => {
      await finishSession(sessionId, elapsed)
      router.push('/history')
    })
  }

  const allSets = exercises.flatMap(e => e.sets)
  const completedCount = allSets.filter(s => s.completed).length
  const totalCount = allSets.length
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky top header */}
      <div className="sticky top-0 bg-background border-b border-border z-20 px-4 pt-3 pb-2">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => router.back()}
            className="h-8 w-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-mono font-bold text-foreground tabular-nums">{formatTime(elapsed)}</span>
              <span className="text-xs text-muted-foreground truncate">{splitDayName}</span>
            </div>
            <p className="text-xs text-muted-foreground">{completedCount}/{totalCount} sets completed</p>
          </div>
        </div>
        <Progress value={progressPct} className="h-1" />
      </div>

      {/* Exercise list */}
      <div className="flex-1 p-3 space-y-2 pb-32">
        {exercises.map((ex, exIdx) => {
          const exCompleted = ex.sets.every(s => s.completed)
          return (
            <div
              key={ex.exercise_id}
              className={cn(
                'rounded-xl border transition-colors overflow-hidden',
                exCompleted ? 'border-primary/40 bg-primary/5' : 'border-border bg-card'
              )}
            >
              {/* Exercise header — tap to expand */}
              <button
                className="w-full flex items-center justify-between p-4 text-left"
                onClick={() => toggleExpanded(exIdx)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={cn(
                    'h-7 w-7 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold',
                    exCompleted ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                  )}>
                    {exCompleted ? <CheckCircle2 className="h-4 w-4" /> : exIdx + 1}
                  </div>
                  <div className="min-w-0">
                    <p className={cn('font-semibold text-base truncate', exCompleted ? 'text-primary' : 'text-foreground')}>
                      {ex.exercise_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {ex.muscle_group} · {ex.planned_sets} × {ex.planned_reps}
                      {ex.rpe ? ` · RPE ${ex.rpe}` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {ex.prev_weight != null && ex.prev_weight > 0 && (
                    <span className="text-xs font-medium text-muted-foreground">{ex.prev_weight}kg</span>
                  )}
                  {ex.expanded
                    ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    : <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  }
                </div>
              </button>

              {/* Set rows */}
              {ex.expanded && (
                <div className="px-3 pb-4 space-y-2.5">
                  {/* Previous best */}
                  {ex.prev_weight != null && ex.prev_weight > 0 && (
                    <div className="text-xs text-muted-foreground bg-secondary/60 rounded-lg px-3 py-2">
                      Previous best: <span className="text-foreground font-semibold">{ex.prev_weight}kg × {ex.prev_reps}</span>
                    </div>
                  )}

                  {/* Column labels */}
                  <div className="grid grid-cols-[1.25rem_1fr_auto_1fr_2.5rem] gap-1.5 items-center px-0.5">
                    <span className="text-[10px] text-muted-foreground text-center">#</span>
                    <span className="text-[10px] text-muted-foreground text-center">kg</span>
                    <span />
                    <span className="text-[10px] text-muted-foreground text-center">reps</span>
                    <span />
                  </div>

                  {ex.sets.map((set, setIdx) => (
                    <div
                      key={setIdx}
                      className={cn(
                        'grid grid-cols-[1.25rem_1fr_auto_1fr_2.5rem] gap-1.5 items-center',
                        set.completed && 'opacity-40'
                      )}
                    >
                      <span className="text-sm font-mono text-muted-foreground text-center">{setIdx + 1}</span>
                      <Stepper
                        value={set.weight}
                        onChange={v => updateSet(exIdx, setIdx, 'weight', v)}
                        step={2.5}
                        min={0}
                        disabled={set.completed}
                      />
                      <span className="text-muted-foreground text-xs text-center">×</span>
                      <Stepper
                        value={set.reps}
                        onChange={v => updateSet(exIdx, setIdx, 'reps', v)}
                        step={1}
                        min={0}
                        disabled={set.completed}
                      />
                      <button
                        onClick={() => toggleSet(exIdx, setIdx)}
                        disabled={set.completed}
                        className={cn(
                          'h-11 w-11 rounded-xl border flex items-center justify-center transition-all shrink-0',
                          set.completed
                            ? 'bg-primary border-primary text-primary-foreground'
                            : 'border-border text-muted-foreground active:bg-secondary'
                        )}
                      >
                        {set.completed
                          ? <CheckCircle2 className="h-5 w-5" />
                          : <Circle className="h-5 w-5" />
                        }
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Fixed bottom finish bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-background border-t border-border p-3 pb-safe md:left-60">
        <button
          onClick={handleFinish}
          disabled={isPending}
          className="w-full h-14 rounded-xl bg-primary text-primary-foreground font-semibold text-base flex items-center justify-center gap-2 active:opacity-90 disabled:opacity-60 transition-opacity"
        >
          {isPending ? 'Saving...' : `Finish Workout · ${formatTime(elapsed)}`}
        </button>
      </div>
    </div>
  )
}

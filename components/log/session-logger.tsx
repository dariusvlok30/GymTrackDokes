'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { logSet, finishSession } from '@/actions/sessions'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Circle, Flame, ChevronDown, ChevronUp } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

interface SetState {
  weight: string
  reps: string
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

function buildSets(planned: number, prevWeight: number | null, plannedReps: string | null): SetState[] {
  return Array.from({ length: planned }, () => ({
    weight: prevWeight ? String(prevWeight) : '',
    reps: plannedReps?.split('-')[0] ?? '',
    completed: false,
  }))
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

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
    return `${m}:${String(sec).padStart(2, '0')}`
  }

  const updateSet = (exIdx: number, setIdx: number, field: 'weight' | 'reps', value: string) => {
    setExercises(prev =>
      prev.map((ex, i) =>
        i !== exIdx ? ex : {
          ...ex,
          sets: ex.sets.map((s, j) => j === setIdx ? { ...s, [field]: value } : s),
        }
      )
    )
  }

  const toggleSet = (exIdx: number, setIdx: number) => {
    const ex = exercises[exIdx]
    const set = ex.sets[setIdx]
    if (set.completed) return

    startTransition(async () => {
      await logSet({
        sessionId,
        exerciseId: ex.exercise_id,
        setNumber: setIdx + 1,
        weight: set.weight ? parseFloat(set.weight) : null,
        reps: set.reps ? parseInt(set.reps) : null,
        rpe: ex.rpe,
      })
    })

    setExercises(prev =>
      prev.map((ex, i) => {
        if (i !== exIdx) return ex
        const newSets = ex.sets.map((s, j) => j === setIdx ? { ...s, completed: true } : s)
        const nextExIdx = i + 1
        return { ...ex, sets: newSets, expanded: !newSets.every(s => s.completed) }
      }).map((ex, i) => {
        const prevEx = exercises[i - 1]
        if (i > 0 && prevEx && prevEx.sets.every(s => s.completed) && i === exIdx + 1) {
          return { ...ex, expanded: true }
        }
        return ex
      })
    )
  }

  const toggleExpanded = (exIdx: number) => {
    setExercises(prev =>
      prev.map((ex, i) => i === exIdx ? { ...ex, expanded: !ex.expanded } : ex)
    )
  }

  const handleFinish = () => {
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
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* Sticky header */}
      <div className="sticky top-0 bg-background border-b border-border -mx-4 px-4 pt-4 pb-3 z-10">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-2xl font-mono font-bold text-primary">{formatTime(elapsed)}</div>
            <p className="text-xs text-muted-foreground">{splitDayName} · {completedCount}/{totalCount} sets</p>
          </div>
          <Button
            onClick={handleFinish}
            disabled={isPending}
            className="gap-2"
            size="sm"
          >
            <Flame className="h-4 w-4" />
            Finish
          </Button>
        </div>
        <Progress value={progressPct} className="h-1.5" />
      </div>

      {/* Exercises */}
      {exercises.map((ex, exIdx) => {
        const exCompleted = ex.sets.every(s => s.completed)
        return (
          <div
            key={ex.exercise_id}
            className={cn(
              'rounded-xl border transition-colors',
              exCompleted ? 'border-primary/30 bg-primary/5' : 'border-border bg-card'
            )}
          >
            {/* Exercise header */}
            <button
              className="w-full flex items-center justify-between p-4 text-left"
              onClick={() => toggleExpanded(exIdx)}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center shrink-0',
                  exCompleted ? 'bg-primary/20' : 'bg-secondary'
                )}>
                  {exCompleted
                    ? <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    : <span className="text-xs font-medium text-muted-foreground">{exIdx + 1}</span>
                  }
                </div>
                <div>
                  <p className={cn('font-medium text-sm', exCompleted ? 'text-primary' : 'text-foreground')}>
                    {ex.exercise_name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {ex.muscle_group} · {ex.planned_sets} × {ex.planned_reps}
                    {ex.rpe ? ` · RPE ${ex.rpe}` : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {ex.prev_weight && (
                  <span className="text-xs text-primary font-medium">{ex.prev_weight}kg</span>
                )}
                {ex.expanded
                  ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  : <ChevronDown className="h-4 w-4 text-muted-foreground" />
                }
              </div>
            </button>

            {/* Set inputs */}
            {ex.expanded && (
              <div className="px-4 pb-4 space-y-2">
                {/* Previous best hint */}
                {ex.prev_weight && (
                  <div className="text-xs text-muted-foreground bg-secondary/50 rounded-md px-3 py-1.5">
                    Previous best: <span className="text-primary font-medium">{ex.prev_weight}kg × {ex.prev_reps}</span> — try to match or beat it!
                  </div>
                )}

                {/* Column headers */}
                <div className="grid grid-cols-[2rem_1fr_1fr_2.5rem] gap-2 px-1 text-xs text-muted-foreground">
                  <span>Set</span>
                  <span>Weight (kg)</span>
                  <span>Reps</span>
                  <span />
                </div>

                {ex.sets.map((set, setIdx) => (
                  <div
                    key={setIdx}
                    className={cn(
                      'grid grid-cols-[2rem_1fr_1fr_2.5rem] gap-2 items-center',
                      set.completed && 'opacity-50'
                    )}
                  >
                    <span className="text-sm font-mono text-muted-foreground text-center">
                      {setIdx + 1}
                    </span>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={set.weight}
                      onChange={e => updateSet(exIdx, setIdx, 'weight', e.target.value)}
                      disabled={set.completed}
                      placeholder={ex.prev_weight?.toString() ?? '0'}
                      className="h-9 w-full rounded-md border border-border bg-secondary px-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-40"
                    />
                    <input
                      type="number"
                      min="0"
                      value={set.reps}
                      onChange={e => updateSet(exIdx, setIdx, 'reps', e.target.value)}
                      disabled={set.completed}
                      placeholder={ex.planned_reps?.split('-')[0] ?? '10'}
                      className="h-9 w-full rounded-md border border-border bg-secondary px-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-40"
                    />
                    <button
                      onClick={() => toggleSet(exIdx, setIdx)}
                      disabled={set.completed}
                      className={cn(
                        'h-9 w-9 rounded-lg border flex items-center justify-center transition-all shrink-0',
                        set.completed
                          ? 'bg-primary border-primary text-primary-foreground cursor-default'
                          : 'border-border text-muted-foreground hover:border-primary hover:text-primary cursor-pointer'
                      )}
                    >
                      {set.completed
                        ? <CheckCircle2 className="h-4 w-4" />
                        : <Circle className="h-4 w-4" />
                      }
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}

      <Button
        onClick={handleFinish}
        disabled={isPending}
        variant="outline"
        className="w-full gap-2"
      >
        <Flame className="h-4 w-4" />
        Finish Workout ({formatTime(elapsed)})
      </Button>
    </div>
  )
}

'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { getActiveSplit } from '@/actions/workouts'
import { startSession } from '@/actions/sessions'
import { Dumbbell, Moon, ZapOff, Loader2, Calendar } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useEffect } from 'react'

function todayStr() {
  return new Date().toISOString().split('T')[0]
}

export default function LogPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [selectedDate, setSelectedDate] = useState(todayStr)
  const [loadingDayId, setLoadingDayId] = useState<string | null>(null)
  const [activeSplit, setActiveSplit] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getActiveSplit().then(split => {
      setActiveSplit(split)
      setLoading(false)
    })
  }, [])

  const isToday = selectedDate === todayStr()

  function handleTapDay(day: any) {
    if (loadingDayId) return
    setLoadingDayId(day.id)
    startTransition(async () => {
      const session = await startSession({
        splitId: activeSplit?.id,
        splitDayId: day.id,
        isRestDay: day.is_rest_day,
        date: selectedDate,
      })
      if (day.is_rest_day) {
        router.push('/dashboard')
      } else {
        router.push(`/log/${session.id}`)
      }
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 bg-background/90 backdrop-blur-sm border-b border-border z-20 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-semibold">Log Workout</h1>
        </div>
        {/* Date picker row */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedDate(todayStr())}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm font-medium transition-all border',
              isToday
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
            )}
          >
            Today
          </button>
          <div className="relative flex-1">
            <input
              type="date"
              value={selectedDate}
              max={todayStr()}
              onChange={e => setSelectedDate(e.target.value)}
              className="w-full h-9 rounded-lg border border-border bg-secondary px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
            />
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {!activeSplit ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <ZapOff className="h-12 w-12 text-muted-foreground/40" />
            <div>
              <p className="font-medium">No active split</p>
              <p className="text-sm text-muted-foreground mt-1">Set an active split to start logging</p>
            </div>
            <Link href="/workouts">
              <Button>Go to Splits</Button>
            </Link>
          </div>
        ) : (
          <>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide px-1">
              {activeSplit.name}
            </p>
            <div className="grid grid-cols-1 gap-3">
              {((activeSplit as any).split_days ?? [])
                .sort((a: any, b: any) => a.day_number - b.day_number)
                .map((day: any) => {
                  const exercises = day.day_exercises ?? []
                  const isLoading = loadingDayId === day.id && isPending

                  return (
                    <button
                      key={day.id}
                      onClick={() => handleTapDay(day)}
                      disabled={!!loadingDayId && isPending}
                      className={cn(
                        'w-full text-left rounded-xl border bg-card p-4 transition-all active:scale-[0.98]',
                        day.is_rest_day
                          ? 'border-border hover:border-muted-foreground/40'
                          : 'border-border hover:border-primary/60 hover:bg-card',
                        isLoading && 'opacity-60'
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={cn(
                            'h-10 w-10 rounded-lg flex items-center justify-center shrink-0',
                            day.is_rest_day ? 'bg-secondary' : 'bg-primary/10'
                          )}>
                            {day.is_rest_day
                              ? <Moon className="h-5 w-5 text-muted-foreground" />
                              : <Dumbbell className="h-5 w-5 text-primary" />
                            }
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground text-base truncate">
                              {day.name}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Day {day.day_number}
                              {!day.is_rest_day && ` · ${exercises.length} exercises`}
                            </p>
                          </div>
                        </div>
                        <div className="shrink-0 mt-0.5">
                          {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                          ) : (
                            <div className={cn(
                              'h-7 w-7 rounded-full border flex items-center justify-center',
                              day.is_rest_day ? 'border-border' : 'border-primary/40'
                            )}>
                              <svg className="h-3 w-3 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>

                      {!day.is_rest_day && exercises.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {exercises.slice(0, 5).map((ex: any) => (
                            <span
                              key={ex.id}
                              className="text-xs bg-secondary rounded-md px-2 py-0.5 text-muted-foreground"
                            >
                              {ex.exercise?.name ?? 'Unknown'}
                            </span>
                          ))}
                          {exercises.length > 5 && (
                            <span className="text-xs text-muted-foreground">
                              +{exercises.length - 5} more
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  )
                })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

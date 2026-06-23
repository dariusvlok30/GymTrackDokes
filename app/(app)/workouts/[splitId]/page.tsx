import { Topbar } from '@/components/layout/topbar'
import { getSplitWithDays, getExercises } from '@/actions/workouts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Dumbbell, Moon } from 'lucide-react'
import { SplitActions } from '@/components/workouts/split-actions'
import { AddExerciseForm } from '@/components/workouts/add-exercise-form'
import { AddDayForm } from '@/components/workouts/add-day-form'

export default async function SplitDetailPage({
  params,
}: {
  params: Promise<{ splitId: string }>
}) {
  const { splitId } = await params

  const [split, exercises] = await Promise.all([
    getSplitWithDays(splitId).catch(() => null),
    getExercises(),
  ])

  if (!split) notFound()

  const days = ((split as any).split_days ?? []).sort(
    (a: any, b: any) => a.day_number - b.day_number
  )

  return (
    <div>
      <Topbar title="Split Details" />
      <div className="p-6 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/workouts">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">{split.name}</h2>
                {split.is_active && (
                  <Badge variant="success" className="gap-1 text-xs">
                    <CheckCircle2 className="h-3 w-3" />
                    Active
                  </Badge>
                )}
              </div>
              {split.description && (
                <p className="text-sm text-muted-foreground mt-0.5">{split.description}</p>
              )}
            </div>
          </div>
          <SplitActions splitId={split.id} isActive={split.is_active} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {days.map((day: any) => (
            <Card key={day.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    {day.is_rest_day ? (
                      <Moon className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Dumbbell className="h-4 w-4 text-primary" />
                    )}
                    Day {day.day_number}: {day.name}
                  </CardTitle>
                  {day.is_rest_day && (
                    <Badge variant="outline" className="text-xs">Rest</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {day.is_rest_day ? (
                  <p className="text-sm text-muted-foreground">Rest and recover 💤</p>
                ) : (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      {(day.day_exercises ?? [])
                        .sort((a: any, b: any) => a.order_index - b.order_index)
                        .map((ex: any) => (
                          <div
                            key={ex.id}
                            className="flex items-center justify-between py-1.5 px-2 rounded-md bg-secondary/50 text-sm"
                          >
                            <div className="flex-1 min-w-0">
                              <span className="font-medium text-foreground truncate block">
                                {ex.exercise?.name ?? 'Unknown'}
                              </span>
                              {ex.exercise?.muscle_group && (
                                <span className="text-xs text-muted-foreground">
                                  {ex.exercise.muscle_group}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground shrink-0 ml-2 text-right">
                              {ex.sets && ex.reps && (
                                <span>{ex.sets} × {ex.reps}</span>
                              )}
                              {ex.rpe && <span className="ml-1 text-primary">RPE {ex.rpe}</span>}
                            </div>
                          </div>
                        ))}
                    </div>
                    <AddExerciseForm splitDayId={day.id} exercises={exercises} existingCount={day.day_exercises?.length ?? 0} />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <AddDayForm splitId={split.id} existingDays={days.length} />
      </div>
    </div>
  )
}

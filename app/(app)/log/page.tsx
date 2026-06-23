import { Topbar } from '@/components/layout/topbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getActiveSplit } from '@/actions/workouts'
import { StartSessionButton } from '@/components/log/start-session-button'
import { Dumbbell, Moon, ZapOff } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function LogPage() {
  const activeSplit = await getActiveSplit()

  return (
    <div>
      <Topbar title="Log Workout" />
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold">Start a Workout</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Select today&apos;s training day to begin logging
          </p>
        </div>

        {!activeSplit ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
              <ZapOff className="h-12 w-12 text-muted-foreground/40" />
              <div className="text-center">
                <p className="font-medium">No active split selected</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Set an active split first to start logging workouts
                </p>
              </div>
              <Link href="/workouts">
                <Button>Go to Splits</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-sm text-muted-foreground">
                {activeSplit.name}
              </h3>
              <Badge variant="success" className="text-xs">Active</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {((activeSplit as any).split_days ?? [])
                .sort((a: any, b: any) => a.day_number - b.day_number)
                .map((day: any) => {
                  const exerciseCount = (day.day_exercises ?? []).length
                  return (
                    <Card key={day.id} className="hover:border-primary/40 transition-colors">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          {day.is_rest_day ? (
                            <Moon className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Dumbbell className="h-4 w-4 text-primary" />
                          )}
                          Day {day.day_number}: {day.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        {day.is_rest_day ? (
                          <p className="text-xs text-muted-foreground mb-3">Rest & recover</p>
                        ) : (
                          <div className="mb-3">
                            <p className="text-xs text-muted-foreground">
                              {exerciseCount} exercise{exerciseCount !== 1 ? 's' : ''}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {(day.day_exercises ?? [])
                                .slice(0, 4)
                                .map((ex: any) => (
                                  <span
                                    key={ex.id}
                                    className="text-xs bg-secondary rounded px-1.5 py-0.5 text-muted-foreground"
                                  >
                                    {ex.exercise?.name ?? 'Unknown'}
                                  </span>
                                ))}
                              {exerciseCount > 4 && (
                                <span className="text-xs text-muted-foreground">
                                  +{exerciseCount - 4} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                        <StartSessionButton
                          splitId={activeSplit.id}
                          splitDayId={day.id}
                          isRestDay={day.is_rest_day}
                        />
                      </CardContent>
                    </Card>
                  )
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

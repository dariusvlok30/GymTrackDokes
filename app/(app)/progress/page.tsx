import { Topbar } from '@/components/layout/topbar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getBodyWeightLog, getPersonalRecords, getVolumeByWeek } from '@/actions/progress'
import { WeightChart } from '@/components/progress/weight-chart'
import { VolumeChart } from '@/components/progress/volume-chart'
import { LogWeightForm } from '@/components/progress/log-weight-form'
import { format } from 'date-fns'
import { Trophy, TrendingUp } from 'lucide-react'

export default async function ProgressPage() {
  const [weightLog, prs, volume] = await Promise.all([
    getBodyWeightLog(90),
    getPersonalRecords(),
    getVolumeByWeek(12),
  ])

  const latestWeight = weightLog.at(-1)
  const firstWeight = weightLog[0]
  const weightChange = latestWeight && firstWeight && weightLog.length > 1
    ? (latestWeight.weight - firstWeight.weight).toFixed(1)
    : null

  return (
    <div>
      <Topbar title="Progress" />
      <div className="p-6 space-y-6">
        <Tabs defaultValue="weight">
          <TabsList className="mb-4">
            <TabsTrigger value="weight">Body Weight</TabsTrigger>
            <TabsTrigger value="prs">Personal Records</TabsTrigger>
            <TabsTrigger value="volume">Volume</TabsTrigger>
          </TabsList>

          <TabsContent value="weight" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                {latestWeight && (
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-foreground">{latestWeight.weight}</span>
                    <span className="text-muted-foreground">kg</span>
                    {weightChange && (
                      <span className={`text-sm font-medium ${Number(weightChange) > 0 ? 'text-red-400' : Number(weightChange) < 0 ? 'text-primary' : 'text-muted-foreground'}`}>
                        {Number(weightChange) > 0 ? '+' : ''}{weightChange}kg
                      </span>
                    )}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  {latestWeight ? `Last logged ${format(new Date(latestWeight.date), 'MMM d')}` : 'No weight logged yet'}
                  {weightLog.length > 0 && ` · ${weightLog.length} entries`}
                </p>
              </div>
              <LogWeightForm />
            </div>

            {weightLog.length > 1 ? (
              <Card>
                <CardContent className="p-4">
                  <WeightChart data={weightLog.map(w => ({ date: w.date, weight: Number(w.weight) }))} />
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
                  <TrendingUp className="h-12 w-12 text-muted-foreground/40" />
                  <p className="text-muted-foreground text-sm">
                    Log your weight regularly to see the trend
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="prs" className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                {prs.length} personal record{prs.length !== 1 ? 's' : ''}
              </h3>
              {prs.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
                    <Trophy className="h-12 w-12 text-muted-foreground/40" />
                    <p className="text-muted-foreground text-sm">
                      Log workouts to see your personal records
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {prs.map((pr) => {
                    const exercise = pr.exercise as any
                    const session = pr.session as any
                    return (
                      <Card key={pr.exercise_id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-foreground truncate">
                                {exercise?.name ?? 'Unknown'}
                              </p>
                              {exercise?.muscle_group && (
                                <p className="text-xs text-muted-foreground">{exercise.muscle_group}</p>
                              )}
                            </div>
                            <Trophy className="h-4 w-4 text-yellow-400 shrink-0 mt-0.5" />
                          </div>
                          <div className="mt-3 flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-primary">{pr.weight}</span>
                            <span className="text-sm text-muted-foreground">kg</span>
                            <span className="text-sm text-muted-foreground ml-1">× {pr.reps}</span>
                          </div>
                          {session?.date && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {format(new Date(session.date), 'MMM d, yyyy')}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="volume" className="space-y-4">
            {volume.length > 1 ? (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Weekly Volume (kg × reps)</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <VolumeChart data={volume} />
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
                  <TrendingUp className="h-12 w-12 text-muted-foreground/40" />
                  <p className="text-muted-foreground text-sm">
                    Log workouts to see your weekly volume
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

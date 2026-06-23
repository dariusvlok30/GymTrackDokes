import { Topbar } from '@/components/layout/topbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getSessions, getWorkoutStreak } from '@/actions/sessions'
import { getActiveSplit } from '@/actions/workouts'
import { getBodyWeightLog } from '@/actions/progress'
import { getCurrentDbUser } from '@/actions/users'
import { formatDuration } from '@/lib/utils'
import { format } from 'date-fns'
import Link from 'next/link'
import { Dumbbell, Flame, Scale, PlayCircle, CalendarDays, Clock } from 'lucide-react'

export default async function DashboardPage() {
  const [user, activeSplit, recentSessions, streak, weightLog] = await Promise.all([
    getCurrentDbUser(),
    getActiveSplit(),
    getSessions(5),
    getWorkoutStreak(),
    getBodyWeightLog(7),
  ])

  const latestWeight = weightLog.at(-1)
  const prevWeight = weightLog.at(-2)
  const weightDiff = latestWeight && prevWeight
    ? (latestWeight.weight - prevWeight.weight).toFixed(1)
    : null

  const completedToday = recentSessions.some(
    s => s.date === format(new Date(), 'yyyy-MM-dd')
  )

  const totalWorkoutsThisWeek = recentSessions.filter(s => {
    const d = new Date(s.date)
    const now = new Date()
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay() + 1))
    return d >= weekStart && !s.is_rest_day
  }).length

  return (
    <div>
      <Topbar title="Dashboard" />
      <div className="p-6 space-y-6">

        {/* Welcome + quick action */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {completedToday ? 'Great work today! 💪' : 'Ready to train?'}
            </h2>
            <p className="text-muted-foreground text-sm mt-0.5">
              {format(new Date(), 'EEEE, MMMM d')}
            </p>
          </div>
          {!completedToday && (
            <Link href="/log">
              <Button className="gap-2">
                <PlayCircle className="h-4 w-4" />
                Start Workout
              </Button>
            </Link>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                <Flame className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{streak}</p>
                <p className="text-xs text-muted-foreground">Day streak</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <CalendarDays className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalWorkoutsThisWeek}</p>
                <p className="text-xs text-muted-foreground">This week</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                <Scale className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {latestWeight ? `${latestWeight.weight}` : '—'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {latestWeight ? `kg${weightDiff ? ` (${Number(weightDiff) > 0 ? '+' : ''}${weightDiff})` : ''}` : 'No weight logged'}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                <Dumbbell className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{recentSessions.filter(s => !s.is_rest_day).length}</p>
                <p className="text-xs text-muted-foreground">Total sessions</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active split */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                <span>Active Split</span>
                <Link href="/workouts">
                  <span className="text-primary text-xs hover:underline">Change →</span>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {activeSplit ? (
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{activeSplit.name}</h3>
                    {activeSplit.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">{activeSplit.description}</p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(activeSplit.split_days as any[])
                      ?.sort((a, b) => a.day_number - b.day_number)
                      .map((day: any) => (
                        <Badge
                          key={day.id}
                          variant={day.is_rest_day ? 'outline' : 'success'}
                          className="text-xs"
                        >
                          {day.name}
                        </Badge>
                      ))}
                  </div>
                  {!completedToday && (
                    <Link href="/log">
                      <Button size="sm" className="w-full mt-1 gap-2">
                        <PlayCircle className="h-4 w-4" />
                        Log Today&apos;s Workout
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground text-sm">No active split selected</p>
                  <Link href="/workouts">
                    <Button size="sm" variant="outline" className="mt-3">
                      Choose a Split
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent sessions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                <span>Recent Sessions</span>
                <Link href="/history">
                  <span className="text-primary text-xs hover:underline">All history →</span>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {recentSessions.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-4">
                  No sessions yet. Go train! 💪
                </p>
              ) : (
                <div className="space-y-2">
                  {recentSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between py-2 border-b border-border last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full shrink-0 ${
                          session.is_rest_day ? 'bg-muted-foreground' : 'bg-primary'
                        }`} />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {session.is_rest_day
                              ? 'Rest Day'
                              : (session.split_day as any)?.name ?? 'Workout'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(session.date), 'EEE, MMM d')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        {session.duration_min && (
                          <>
                            <Clock className="h-3 w-3" />
                            <span>{formatDuration(session.duration_min)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

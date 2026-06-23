import { Topbar } from '@/components/layout/topbar'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getSessions } from '@/actions/sessions'
import { formatDuration } from '@/lib/utils'
import { format } from 'date-fns'
import { Clock, Dumbbell, Moon, Calendar } from 'lucide-react'
import Link from 'next/link'

export default async function HistoryPage() {
  const sessions = await getSessions(50)

  const grouped = sessions.reduce<Record<string, typeof sessions>>((acc, session) => {
    const month = format(new Date(session.date), 'MMMM yyyy')
    if (!acc[month]) acc[month] = []
    acc[month].push(session)
    return acc
  }, {})

  const totalWorkouts = sessions.filter(s => !s.is_rest_day).length
  const totalMinutes = sessions.reduce((acc, s) => acc + (s.duration_min ?? 0), 0)

  return (
    <div>
      <Topbar title="History" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-foreground">{totalWorkouts}</p>
              <p className="text-xs text-muted-foreground">Total workouts</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-foreground">{formatDuration(totalMinutes)}</p>
              <p className="text-xs text-muted-foreground">Total time</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-foreground">{sessions.length}</p>
              <p className="text-xs text-muted-foreground">Total sessions</p>
            </CardContent>
          </Card>
        </div>

        {sessions.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
              <Calendar className="h-12 w-12 text-muted-foreground/40" />
              <div className="text-center">
                <p className="font-medium">No sessions yet</p>
                <p className="text-sm text-muted-foreground mt-1">Start logging workouts to see your history</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([month, monthSessions]) => (
              <div key={month}>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-sm font-medium text-muted-foreground">{month}</h3>
                  <span className="text-xs text-muted-foreground">
                    ({monthSessions.filter(s => !s.is_rest_day).length} workouts)
                  </span>
                </div>
                <div className="space-y-2">
                  {monthSessions.map((session) => (
                    <Card key={session.id} className="hover:border-border/60 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                              session.is_rest_day
                                ? 'bg-secondary'
                                : 'bg-primary/10'
                            }`}>
                              {session.is_rest_day
                                ? <Moon className="h-4 w-4 text-muted-foreground" />
                                : <Dumbbell className="h-4 w-4 text-primary" />
                              }
                            </div>
                            <div>
                              <p className="font-medium text-sm text-foreground">
                                {session.is_rest_day
                                  ? 'Rest Day'
                                  : (session.split_day as any)?.name ?? 'Workout'
                                }
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {format(new Date(session.date), 'EEEE, MMM d')}
                                {(session.split as any)?.name && ` · ${(session.split as any).name}`}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {session.duration_min && (
                              <Badge variant="outline" className="gap-1 text-xs">
                                <Clock className="h-3 w-3" />
                                {formatDuration(session.duration_min)}
                              </Badge>
                            )}
                            {!session.is_rest_day && !session.finished_at && (
                              <Badge variant="warning" className="text-xs">In progress</Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

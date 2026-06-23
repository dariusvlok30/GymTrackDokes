'use client'

import { useRouter } from 'next/navigation'
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isToday,
  isSameMonth,
} from 'date-fns'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CalendarSession {
  id: string
  date: string
  is_rest_day: boolean
  split_day: { name: string } | null
}

interface WorkoutCalendarProps {
  year: number
  month: number
  sessions: CalendarSession[]
}

const DAY_HEADERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function WorkoutCalendar({ year, month, sessions }: WorkoutCalendarProps) {
  const router = useRouter()
  const currentDate = new Date(year, month - 1, 1)
  const days = eachDayOfInterval({ start: startOfMonth(currentDate), end: endOfMonth(currentDate) })

  const sessionMap = new Map<string, CalendarSession>()
  sessions.forEach(s => sessionMap.set(s.date, s))

  const firstDayOfWeek = getDay(startOfMonth(currentDate))
  const offset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1

  const prevMonth = () => {
    const d = new Date(year, month - 2, 1)
    router.push(`/calendar?year=${d.getFullYear()}&month=${d.getMonth() + 1}`)
  }
  const nextMonth = () => {
    const d = new Date(year, month, 1)
    router.push(`/calendar?year=${d.getFullYear()}&month=${d.getMonth() + 1}`)
  }

  const today = format(new Date(), 'yyyy-MM-dd')

  return (
    <div className="space-y-4 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{format(currentDate, 'MMMM yyyy')}</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span>Workout</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-secondary border border-border" />
          <span>Rest day</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full border-2 border-primary" />
          <span>Today</span>
        </div>
      </div>

      {/* Grid */}
      <div className="rounded-xl border border-border overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-border">
          {DAY_HEADERS.map(d => (
            <div key={d} className="py-2 text-center text-xs font-medium text-muted-foreground">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {/* Offset empty cells */}
          {Array.from({ length: offset }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square p-1 border-b border-r border-border/30" />
          ))}

          {days.map((day, i) => {
            const dateStr = format(day, 'yyyy-MM-dd')
            const session = sessionMap.get(dateStr)
            const isT = dateStr === today
            const isWeekend = [0, 6].includes(getDay(day))

            return (
              <div
                key={dateStr}
                className={cn(
                  'aspect-square p-1.5 border-b border-r border-border/30 flex flex-col items-center justify-between',
                  isWeekend && 'bg-secondary/20',
                  (i + offset + 1) % 7 === 0 && 'border-r-0'
                )}
              >
                <span className={cn(
                  'text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full',
                  isT && 'bg-primary text-primary-foreground',
                  !isT && session && !session.is_rest_day && 'text-primary',
                  !isT && !session && 'text-muted-foreground',
                )}>
                  {format(day, 'd')}
                </span>

                {session && (
                  <div className="flex flex-col items-center gap-0.5 pb-0.5">
                    <div className={cn(
                      'w-1.5 h-1.5 rounded-full',
                      session.is_rest_day ? 'bg-muted-foreground' : 'bg-primary'
                    )} />
                    {session.split_day?.name && (
                      <span className="text-[9px] text-muted-foreground leading-none text-center hidden sm:block truncate max-w-[40px]">
                        {session.split_day.name}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

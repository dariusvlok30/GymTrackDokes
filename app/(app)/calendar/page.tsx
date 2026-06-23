import { Topbar } from '@/components/layout/topbar'
import { WorkoutCalendar } from '@/components/calendar/workout-calendar'
import { getSessionsForMonth } from '@/actions/sessions'

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>
}) {
  const params = await searchParams
  const now = new Date()
  const year = params.year ? parseInt(params.year) : now.getFullYear()
  const month = params.month ? parseInt(params.month) : now.getMonth() + 1

  const sessions = await getSessionsForMonth(year, month)

  return (
    <div>
      <Topbar title="Calendar" />
      <div className="p-6">
        <WorkoutCalendar
          year={year}
          month={month}
          sessions={sessions}
        />
      </div>
    </div>
  )
}

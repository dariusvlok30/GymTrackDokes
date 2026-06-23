import { getSession } from '@/actions/sessions'
import { getCurrentDbUser } from '@/actions/users'
import { getPreviousBests } from '@/actions/sessions'
import { notFound, redirect } from 'next/navigation'
import { SessionLogger } from '@/components/log/session-logger'
import { Topbar } from '@/components/layout/topbar'

export default async function ActiveSessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>
}) {
  const { sessionId } = await params

  const [session, user] = await Promise.all([
    getSession(sessionId).catch(() => null),
    getCurrentDbUser(),
  ])

  if (!session) notFound()
  if ((session as any).finished_at) redirect('/history')
  if ((session as any).is_rest_day) redirect('/dashboard')

  const splitDay = (session as any).split_day
  const dayExercises = (splitDay?.day_exercises ?? []).sort(
    (a: any, b: any) => a.order_index - b.order_index
  )

  const exerciseIds = dayExercises.map((de: any) => de.exercise_id)
  const prevBests = exerciseIds.length > 0
    ? await getPreviousBests(exerciseIds, user.id)
    : {}

  const exercises = dayExercises.map((de: any) => ({
    exercise_id: de.exercise_id,
    exercise_name: de.exercise?.name ?? 'Unknown Exercise',
    muscle_group: de.exercise?.muscle_group ?? null,
    planned_sets: de.sets ?? 3,
    planned_reps: de.reps ?? '8-12',
    rpe: de.rpe ?? null,
    prev_weight: prevBests[de.exercise_id]?.weight ?? null,
    prev_reps: prevBests[de.exercise_id]?.reps ?? null,
  }))

  return (
    <div>
      <Topbar title={splitDay?.name ?? 'Workout'} />
      <div className="p-4 pb-24">
        <SessionLogger
          sessionId={sessionId}
          exercises={exercises}
          startedAt={(session as any).started_at}
          splitDayName={splitDay?.name ?? 'Workout'}
        />
      </div>
    </div>
  )
}

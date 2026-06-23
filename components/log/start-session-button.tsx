'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { startSession } from '@/actions/sessions'
import { PlayCircle, Moon } from 'lucide-react'

interface StartSessionButtonProps {
  splitId: string
  splitDayId: string
  isRestDay: boolean
}

export function StartSessionButton({ splitId, splitDayId, isRestDay }: StartSessionButtonProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleStart = () => {
    startTransition(async () => {
      const session = await startSession({
        splitId,
        splitDayId,
        isRestDay,
      })
      if (isRestDay) {
        router.push('/dashboard')
      } else {
        router.push(`/log/${session.id}`)
      }
    })
  }

  return (
    <Button
      size="sm"
      variant={isRestDay ? 'secondary' : 'default'}
      className="w-full gap-2 text-xs"
      onClick={handleStart}
      disabled={isPending}
    >
      {isRestDay ? (
        <>
          <Moon className="h-3.5 w-3.5" />
          {isPending ? 'Logging...' : 'Log Rest Day'}
        </>
      ) : (
        <>
          <PlayCircle className="h-3.5 w-3.5" />
          {isPending ? 'Starting...' : 'Start Workout'}
        </>
      )}
    </Button>
  )
}

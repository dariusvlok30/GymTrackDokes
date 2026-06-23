'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { setActiveSplit, deleteSplit } from '@/actions/workouts'
import { CheckCircle2, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface SplitActionsProps {
  splitId: string
  isActive: boolean
}

export function SplitActions({ splitId, isActive }: SplitActionsProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleSetActive = () => {
    startTransition(async () => {
      await setActiveSplit(splitId)
      router.refresh()
    })
  }

  const handleDelete = () => {
    if (!confirm('Delete this split? This cannot be undone.')) return
    startTransition(async () => {
      await deleteSplit(splitId)
      router.refresh()
    })
  }

  return (
    <div className="flex gap-1.5">
      {!isActive && (
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5 text-xs h-8"
          onClick={handleSetActive}
          disabled={isPending}
        >
          <CheckCircle2 className="h-3 w-3" />
          Set Active
        </Button>
      )}
      <Button
        size="sm"
        variant="ghost"
        className="text-xs h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
        onClick={handleDelete}
        disabled={isPending}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  )
}

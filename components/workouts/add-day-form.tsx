'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { addDayToSplit } from '@/actions/workouts'
import { Plus, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface AddDayFormProps {
  splitId: string
  existingDays: number
}

export function AddDayForm({ splitId, existingDays }: AddDayFormProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [isRest, setIsRest] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleAdd = () => {
    if (!name.trim()) return
    startTransition(async () => {
      await addDayToSplit(splitId, {
        day_number: existingDays + 1,
        name: name.trim(),
        is_rest_day: isRest,
      })
      setOpen(false)
      setName('')
      setIsRest(false)
      router.refresh()
    })
  }

  if (!open) {
    return (
      <Button
        variant="outline"
        className="gap-2 w-full"
        onClick={() => setOpen(true)}
      >
        <Plus className="h-4 w-4" />
        Add Day
      </Button>
    )
  }

  return (
    <div className="border border-border rounded-xl p-4 space-y-3 bg-card">
      <div className="flex items-center justify-between">
        <span className="font-medium text-sm">Add Day {existingDays + 1}</span>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="day-name">Day Name</Label>
        <Input
          id="day-name"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Push, Pull, Legs, Rest"
        />
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={isRest}
          onChange={e => setIsRest(e.target.checked)}
          className="rounded border-border"
        />
        <span className="text-sm text-foreground">This is a rest day</span>
      </label>
      <Button onClick={handleAdd} disabled={!name.trim() || isPending} className="w-full" size="sm">
        {isPending ? 'Adding...' : 'Add Day'}
      </Button>
    </div>
  )
}

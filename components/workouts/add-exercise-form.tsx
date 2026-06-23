'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { addExerciseToDay } from '@/actions/workouts'
import { Plus, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Exercise } from '@/types/database'

interface AddExerciseFormProps {
  splitDayId: string
  exercises: Exercise[]
  existingCount: number
}

export function AddExerciseForm({ splitDayId, exercises, existingCount }: AddExerciseFormProps) {
  const [open, setOpen] = useState(false)
  const [exerciseId, setExerciseId] = useState('')
  const [sets, setSets] = useState('3')
  const [reps, setReps] = useState('8-12')
  const [rpe, setRpe] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const grouped = exercises.reduce<Record<string, Exercise[]>>((acc, ex) => {
    const g = ex.muscle_group ?? 'Other'
    if (!acc[g]) acc[g] = []
    acc[g].push(ex)
    return acc
  }, {})

  const handleAdd = () => {
    if (!exerciseId) return
    startTransition(async () => {
      await addExerciseToDay(splitDayId, {
        exercise_id: exerciseId,
        order_index: existingCount + 1,
        sets: sets ? parseInt(sets) : undefined,
        reps: reps || undefined,
        rpe: rpe ? parseInt(rpe) : undefined,
      })
      setOpen(false)
      setExerciseId('')
      setSets('3')
      setReps('8-12')
      setRpe('')
      router.refresh()
    })
  }

  if (!open) {
    return (
      <Button
        size="sm"
        variant="ghost"
        className="w-full text-xs h-7 gap-1 text-muted-foreground hover:text-primary border border-dashed border-border hover:border-primary/50"
        onClick={() => setOpen(true)}
      >
        <Plus className="h-3 w-3" />
        Add Exercise
      </Button>
    )
  }

  return (
    <div className="p-3 bg-background rounded-lg border border-border space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-foreground">Add Exercise</span>
        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => setOpen(false)}>
          <X className="h-3 w-3" />
        </Button>
      </div>
      <Select value={exerciseId} onValueChange={setExerciseId}>
        <SelectTrigger className="h-8 text-xs">
          <SelectValue placeholder="Select exercise..." />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(grouped).sort().map(([group, exs]) => (
            <div key={group}>
              <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">{group}</div>
              {exs.map(ex => (
                <SelectItem key={ex.id} value={ex.id} className="text-xs pl-4">
                  {ex.name}
                </SelectItem>
              ))}
            </div>
          ))}
        </SelectContent>
      </Select>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="text-xs text-muted-foreground">Sets</label>
          <Input value={sets} onChange={e => setSets(e.target.value)} className="h-7 text-xs mt-0.5" placeholder="3" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Reps</label>
          <Input value={reps} onChange={e => setReps(e.target.value)} className="h-7 text-xs mt-0.5" placeholder="8-12" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">RPE</label>
          <Input value={rpe} onChange={e => setRpe(e.target.value)} className="h-7 text-xs mt-0.5" placeholder="8" type="number" min="1" max="10" />
        </div>
      </div>
      <Button
        size="sm"
        className="w-full h-7 text-xs"
        onClick={handleAdd}
        disabled={!exerciseId || isPending}
      >
        {isPending ? 'Adding...' : 'Add'}
      </Button>
    </div>
  )
}

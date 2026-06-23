'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { logBodyWeight } from '@/actions/progress'
import { Plus, Scale } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function LogWeightForm() {
  const [open, setOpen] = useState(false)
  const [weight, setWeight] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!weight) return
    startTransition(async () => {
      await logBodyWeight({ weight: parseFloat(weight) })
      setOpen(false)
      setWeight('')
      router.refresh()
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          Log Weight
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            Log Body Weight
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              min="30"
              max="300"
              value={weight}
              onChange={e => setWeight(e.target.value)}
              placeholder="e.g. 78.5"
              autoFocus
              required
            />
          </div>
          <Button type="submit" disabled={isPending || !weight} className="w-full">
            {isPending ? 'Saving...' : 'Save'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

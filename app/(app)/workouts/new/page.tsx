'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Topbar } from '@/components/layout/topbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createSplit } from '@/actions/workouts'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewSplitPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const name = data.get('name') as string
    const description = data.get('description') as string
    const days = data.get('days_per_week') as string

    if (!name.trim()) {
      setError('Split name is required')
      return
    }

    startTransition(async () => {
      try {
        const split = await createSplit({
          name: name.trim(),
          description: description.trim() || undefined,
          days_per_week: days ? parseInt(days) : undefined,
        })
        router.push(`/workouts/${split.id}`)
      } catch (err) {
        setError('Failed to create split')
      }
    })
  }

  return (
    <div>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/workouts">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Create New Split</h1>
        </div>

        <Card className="max-w-lg">
          <CardHeader>
            <CardTitle>Split Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Split Name *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g. PPL Split, Push Pull Legs"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Brief description of the program..."
                  rows={2}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="days_per_week">Days Per Week</Label>
                <Input
                  id="days_per_week"
                  name="days_per_week"
                  type="number"
                  min="1"
                  max="7"
                  placeholder="e.g. 4"
                />
              </div>
              {error && <p className="text-destructive text-sm">{error}</p>}
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? 'Creating...' : 'Create Split'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

import { Topbar } from '@/components/layout/topbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getSplits, setActiveSplit, deleteSplit } from '@/actions/workouts'
import Link from 'next/link'
import { Plus, Dumbbell, CheckCircle2, Trash2, ArrowRight } from 'lucide-react'
import { SplitActions } from '@/components/workouts/split-actions'

export default async function WorkoutsPage() {
  const splits = await getSplits()

  return (
    <div>
      <Topbar title="My Splits" />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Workout Splits</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {splits.length} split{splits.length !== 1 ? 's' : ''} · {splits.find(s => s.is_active)?.name ?? 'None active'}
            </p>
          </div>
          <Link href="/workouts/new">
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              New Split
            </Button>
          </Link>
        </div>

        {splits.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
              <Dumbbell className="h-12 w-12 text-muted-foreground/40" />
              <div className="text-center">
                <p className="font-medium text-foreground">No splits yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Create your first workout split to get started
                </p>
              </div>
              <Link href="/workouts/new">
                <Button>Create Split</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {splits.map((split) => (
              <Card
                key={split.id}
                className={split.is_active ? 'border-primary/50 shadow-[0_0_0_1px_hsl(var(--primary)/0.3)]' : ''}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base truncate">{split.name}</CardTitle>
                      {split.description && (
                        <CardDescription className="mt-0.5 text-xs line-clamp-2">
                          {split.description}
                        </CardDescription>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {split.is_active && (
                        <Badge variant="success" className="text-xs gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Active
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {split.days_per_week && (
                    <p className="text-xs text-muted-foreground mb-3">
                      {split.days_per_week} days/week
                    </p>
                  )}
                  <div className="flex gap-2 flex-wrap">
                    <Link href={`/workouts/${split.id}`}>
                      <Button size="sm" variant="secondary" className="gap-1.5 text-xs h-8">
                        View
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                    <SplitActions splitId={split.id} isActive={split.is_active} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

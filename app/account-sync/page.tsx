import { SignOutButton } from '@clerk/nextjs'

export default function AccountSyncPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4 max-w-md px-4">
        <div className="text-5xl">⚙️</div>
        <h1 className="text-2xl font-bold text-foreground">Setup Required</h1>
        <p className="text-muted-foreground text-sm">
          Your account is authenticated but the database write failed.
          The most likely cause is a missing environment variable in Vercel.
        </p>
        <div className="bg-card border border-border rounded-lg p-4 text-left space-y-3 text-sm">
          <div>
            <p className="font-medium text-foreground mb-1">Most likely fix:</p>
            <p className="text-muted-foreground">
              Go to <span className="text-primary">Vercel → Settings → Environment Variables</span> and make sure{' '}
              <code className="text-primary font-mono">SUPABASE_SERVICE_ROLE_KEY</code> is set.
            </p>
            <p className="text-muted-foreground mt-1">
              Get it from <span className="text-primary">Supabase → Settings → API → service_role</span> — it starts with <code className="text-primary">eyJ...</code> and is ~200 chars long.
            </p>
          </div>
          <div>
            <p className="font-medium text-foreground mb-1">After adding it:</p>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Redeploy in Vercel (or it redeploys automatically)</li>
              <li>Sign out here, then sign back in</li>
            </ol>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Check Vercel → Functions → Logs for the exact error message.
        </p>
        <SignOutButton>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors text-sm">
            Sign Out
          </button>
        </SignOutButton>
      </div>
    </div>
  )
}

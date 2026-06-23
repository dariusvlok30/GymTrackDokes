import { SignOutButton } from '@clerk/nextjs'

export default function AccountSyncPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4 max-w-md px-4">
        <div className="text-5xl">⚙️</div>
        <h1 className="text-2xl font-bold text-foreground">Account Not Synced</h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Your Clerk account exists but hasn&apos;t been synced to the database yet.
          This means the Clerk webhook hasn&apos;t fired.
        </p>
        <div className="bg-card border border-border rounded-lg p-4 text-left space-y-2 text-sm">
          <p className="font-medium text-foreground">To fix this:</p>
          <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
            <li>Go to Clerk Dashboard → Webhooks</li>
            <li>Add endpoint: your Vercel URL + <code className="text-primary">/api/webhooks/clerk</code></li>
            <li>Subscribe to <code className="text-primary">user.created</code> and <code className="text-primary">user.updated</code></li>
            <li>Copy the signing secret → add as <code className="text-primary">CLERK_WEBHOOK_SECRET</code> in Vercel env vars</li>
            <li>Redeploy Vercel, then sign out and sign back in</li>
          </ol>
        </div>
        <SignOutButton>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors text-sm">
            Sign Out
          </button>
        </SignOutButton>
      </div>
    </div>
  )
}

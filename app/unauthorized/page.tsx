import Link from 'next/link'
import { SignOutButton } from '@clerk/nextjs'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4 max-w-md px-4">
        <div className="text-5xl">🚫</div>
        <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
        <p className="text-muted-foreground">
          Your account is not authorised to access GymTrack. This is a private application.
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

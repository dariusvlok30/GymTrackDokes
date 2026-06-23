import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 px-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <span className="text-3xl">🏋️</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">GymTrack</h1>
          <p className="mt-2 text-muted-foreground">Sign in to your workout tracker</p>
        </div>
        <div className="flex justify-center">
          <SignIn
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'bg-card border border-border shadow-none rounded-xl',
                headerTitle: 'text-foreground',
                headerSubtitle: 'text-muted-foreground',
                formFieldLabel: 'text-foreground',
                formFieldInput: 'bg-secondary border-border text-foreground',
                footerActionLink: 'text-primary',
                formButtonPrimary: 'bg-primary text-primary-foreground hover:bg-primary/90',
                identityPreviewText: 'text-foreground',
                identityPreviewEditButton: 'text-primary',
              },
            }}
          />
        </div>
      </div>
    </div>
  )
}

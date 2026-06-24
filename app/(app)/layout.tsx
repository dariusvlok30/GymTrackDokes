import { redirect } from 'next/navigation'
import { getCurrentDbUser } from '@/actions/users'
import { SettingsProvider } from '@/context/settings-context'
import { Sidebar } from '@/components/layout/sidebar'
import { BottomNav } from '@/components/layout/bottom-nav'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentDbUser()

  // First-time users must complete onboarding (skip redirect when already on /onboarding)
  if (!user.onboarded) {
    redirect('/onboarding')
  }

  return (
    <SettingsProvider initialUnits={user.units} initialTheme={user.theme} initialEnergyUnit={user.energy_unit ?? 'kcal'}>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 md:ml-60 min-h-screen pb-20 md:pb-0">
          {children}
        </main>
        <BottomNav />
      </div>
    </SettingsProvider>
  )
}

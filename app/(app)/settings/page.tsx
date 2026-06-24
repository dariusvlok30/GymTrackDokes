import { Topbar } from '@/components/layout/topbar'
import { SettingsForm } from '@/components/settings/settings-form'

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Topbar title="Settings" />
      <SettingsForm />
    </div>
  )
}

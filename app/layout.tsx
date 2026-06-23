import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

export const dynamic = 'force-dynamic'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GymTrack',
  description: 'Personal gym tracking & workout logging',
  icons: {
    icon: '/logo-white.png',
    apple: '/logo-white.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* Theme init before paint — must be first child of body */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('gymtrack-theme')||'dark';document.documentElement.setAttribute('data-theme',t);}catch(e){}`,
          }}
        />
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  )
}

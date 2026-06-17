'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import DesktopSidebar from './DesktopSidebar'
import GlobalMobileNav from './GlobalMobileNav'
import GlobalFAB from './GlobalFAB'

interface AppLayoutWrapperProps {
  children: React.ReactNode
  role: string
  hasUser: boolean
  consentAcceptedAt: string | null
}

export default function AppLayoutWrapper({ children, role, hasUser, consentAcceptedAt }: AppLayoutWrapperProps) {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // Se l'utente è loggato ma non ha accettato il consenso, reindirizza a /consent
    if (hasUser && !consentAcceptedAt && pathname !== '/consent' && pathname !== '/privacy') {
      router.replace('/consent')
    }
    // Se l'utente ha già accettato il consenso e prova ad andare su /consent, reindirizza a /
    if (hasUser && consentAcceptedAt && pathname === '/consent') {
      router.replace('/')
    }
  }, [hasUser, consentAcceptedAt, pathname, router])

  const isStandalone = pathname === '/login' || pathname === '/privacy' || pathname === '/consent'

  if (isStandalone) {
    return (
      <main className="min-h-screen">
        {children}
      </main>
    )
  }

  return (
    <div className="pb-20 md:pb-0 md:pl-64">
      <DesktopSidebar role={role} />
      <main className="min-h-screen">
        {children}
      </main>
      <GlobalFAB />
      <GlobalMobileNav role={role} />
    </div>
  )
}

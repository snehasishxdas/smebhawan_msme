import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function useAuthGuard(expectedRole: 'customer' | 'supplier' | 'admin') {
  const router = useRouter()

  useEffect(() => {
    if (typeof window === 'undefined') return

    if (expectedRole === 'admin') {
      const isLoggedIn = sessionStorage.getItem('admin_session') === 'true' || sessionStorage.getItem('smebhawan_admin_logged') === 'true'
      if (!isLoggedIn) {
        console.warn('[Security Guard] Unauthorized admin portal access attempt. Terminating session.')
        router.replace('/login/admin')
      }
      return
    }

    const sessionStr = sessionStorage.getItem('smebhawan_user_session')
    if (!sessionStr) {
      console.warn('[Security Guard] No active user session. Redirecting to login.')
      if (expectedRole === 'customer') {
        // buyer page is buyer/page.tsx itself. The state controls login vs dashboard views.
        // We will manage it internally in page.tsx itself using the session storage guard!
      }
      return
    }

    try {
      const session = JSON.parse(sessionStr)
      if (session.role !== expectedRole) {
        console.warn(`[Security Guard] Role mismatch. Expected ${expectedRole}, got ${session.role}. Terminating session.`)
        sessionStorage.removeItem('smebhawan_user_session')
        window.dispatchEvent(new Event('storage'))
      }
    } catch (e) {
      console.error('[Security Guard] Session decode error. Terminating.')
      sessionStorage.removeItem('smebhawan_user_session')
      window.dispatchEvent(new Event('storage'))
    }
  }, [expectedRole, router])
}

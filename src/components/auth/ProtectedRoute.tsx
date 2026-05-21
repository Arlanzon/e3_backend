'use client'

import { useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: 'MANAGER' | 'OWNER' | 'ADMIN'
  redirectTo?: string
}

const roleHierarchy = {
  CUSTOMER: 0,
  MANAGER: 1,
  OWNER: 2,
  ADMIN: 3,
} as const

export default function ProtectedRoute({
  children,
  requiredRole,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const router = useRouter()

  const { isAuthenticated, user, hasHydrated } = useAuthStore()

  useEffect(() => {
    if (!hasHydrated) return

    if (!isAuthenticated || !user) {
      router.replace(redirectTo)
      return
    }

    if (requiredRole) {
      const userLevel = roleHierarchy[user.role]
      const requiredLevel = roleHierarchy[requiredRole]

      if (userLevel < requiredLevel) {
        router.replace('/')
      }
    }
  }, [
    hasHydrated,
    isAuthenticated,
    user,
    requiredRole,
    redirectTo,
    router,
  ])

  if (!hasHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAFAF7]">
        <p className="text-sm text-[#6B6B6B]">Validando sesión...</p>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  if (requiredRole) {
    const userLevel = roleHierarchy[user.role]
    const requiredLevel = roleHierarchy[requiredRole]

    if (userLevel < requiredLevel) {
      return null
    }
  }

  return <>{children}</>
}

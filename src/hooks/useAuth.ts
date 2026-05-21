'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/auth.store'

export function useAuth() {
  const store = useAuthStore()

  useEffect(() => {
    store.hydrate()
  }, [])

  return {
    user: store.user,
    token: store.token,
    isAuthenticated: store.isAuthenticated,
    login: store.login,
    logout: store.logout,
    hydrate: store.hydrate,
  }
}

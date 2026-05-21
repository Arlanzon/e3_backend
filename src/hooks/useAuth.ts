'use client'

import { useEffect } from 'react'
import { getMeApi } from '@/features/auth/auth.api'
import { useAuthStore } from '@/store/auth.store'

export function useAuth() {
  const store = useAuthStore()

  useEffect(() => {
    async function init() {
      if (typeof window === 'undefined') return

      const { hydrate, login, logout } = useAuthStore.getState()

      hydrate()

      const token = localStorage.getItem('auth_token')
      if (!token) return

      try {
        const response = await getMeApi(token)
        const userData = response.data

        login(
          {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
          },
          token,
        )
      } catch {
        logout()
      }
    }

    init()
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

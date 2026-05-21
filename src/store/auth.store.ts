import { create } from 'zustand'

export type AuthUser = {
  id: string
  name: string
  email: string
  role: 'CUSTOMER' | 'OWNER' | 'MANAGER' | 'ADMIN'
}

export interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  login: (user: AuthUser, token: string) => void
  logout: () => void
  hydrate: () => void
}

type SetAuthState = (partial: Partial<AuthState>) => void

export const useAuthStore = create<AuthState>((set: SetAuthState) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  login: (user: AuthUser, token: string) => {
    localStorage.setItem('auth_token', token)
    localStorage.setItem('auth_user', JSON.stringify(user))
    set({ user, token, isAuthenticated: true })
  },
  logout: () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    set({ user: null, token: null, isAuthenticated: false })
  },
  hydrate: () => {
    if (typeof window === 'undefined') return

    const token = localStorage.getItem('auth_token')
    const authUser = localStorage.getItem('auth_user')

    if (!token || !authUser) return

    try {
      const user = JSON.parse(authUser) as AuthUser
      set({ user, token, isAuthenticated: true })
    } catch {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    }
  },
}))

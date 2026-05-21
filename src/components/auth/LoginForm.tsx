'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { ApiError } from '@/lib/api-error'
import { api } from '@/lib/api-client'
import type { AuthState, AuthUser } from '@/store/auth.store'
import { useAuthStore } from '@/store/auth.store'

type LoginRequest = {
  email: string
  password: string
}

type LoginResponse = {
  success: boolean
  data: {
    token: string
    user: AuthUser
  }
}

export default function LoginForm() {
  const router = useRouter()
  const login = useAuthStore((state: AuthState) => state.login)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const payload: LoginRequest = {
      email,
      password,
    }

    try {
      setLoading(true)
      const response = await api.post<LoginResponse>('/auth/login', payload)

      login(response.data.user, response.data.token)
      router.push('/restaurants')
    } catch (caughtError) {
      if (caughtError instanceof ApiError) {
        setError(caughtError.message)
      } else {
        setError('No pudimos iniciar sesión. Revisa tus datos e intenta de nuevo.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <Input
        id="email"
        name="email"
        type="email"
        label="Correo electronico"
        placeholder="tu@correo.com"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />

      <Input
        id="password"
        name="password"
        type="password"
        label="Contrasena"
        placeholder="********"
        autoComplete="current-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <Button type="submit" className="w-full" size="lg" loading={loading}>
        Iniciar sesion
      </Button>

      <p className="text-center text-sm text-[#6B6B6B]">
        No tienes cuenta?{' '}
        <Link
          href="/registro"
          className="font-semibold text-[#1A3A2A] transition hover:text-[#C4622D]"
        >
          Crear cuenta
        </Link>
      </p>
    </form>
  )
}

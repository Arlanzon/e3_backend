'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { ApiError } from '@/lib/api-error'
import { api } from '@/lib/api-client'

type RegisterRequest = {
  name: string
  email: string
  password: string
}

type RegisterResponse = {
  success: boolean
  data: {
    id: string
    name: string
    email: string
    role: 'CUSTOMER'
    active: boolean
    createdAt: string
  }
}

export default function RegisterForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    const payload: RegisterRequest = {
      name,
      email,
      password,
    }

    try {
      setLoading(true)
      await api.post<RegisterResponse>('/auth/register', payload)
      setSuccess('Cuenta creada correctamente. Te llevaremos a iniciar sesión.')
      setTimeout(() => {
        router.push('/login')
      }, 1200)
    } catch (caughtError) {
      if (caughtError instanceof ApiError) {
        setError(caughtError.message)
      } else {
        setError('No pudimos crear tu cuenta. Intenta de nuevo.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <Input
        id="name"
        name="name"
        type="text"
        label="Nombre"
        placeholder="Tu nombre completo"
        autoComplete="name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
      />

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
        autoComplete="new-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />

      <Input
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        label="Confirmar contrasena"
        placeholder="********"
        autoComplete="new-password"
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
        error={error && password !== confirmPassword ? error : undefined}
        required
      />

      {error && password === confirmPassword ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {success ? (
        <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </p>
      ) : null}

      <Button type="submit" className="w-full" size="lg" loading={loading}>
        Crear cuenta
      </Button>

      <p className="text-center text-sm text-[#6B6B6B]">
        Ya tienes cuenta?{' '}
        <Link
          href="/login"
          className="font-semibold text-[#1A3A2A] transition hover:text-[#C4622D]"
        >
          Iniciar sesion
        </Link>
      </p>
    </form>
  )
}

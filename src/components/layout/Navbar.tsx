'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

const navItems = [
  { href: '/', label: 'Inicio' },
  { href: '/restaurants', label: 'Restaurantes' },
]

export default function Navbar() {
  const router = useRouter()
  const { isAuthenticated, user, logout, hydrate } = useAuth()

  useEffect(() => {
    hydrate()
  }, [hydrate])

  function handleLogout() {
    logout()
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-20 border-b border-[#2D5A3D] bg-[#1A3A2A]">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/brand/logo-chapulin.png"
            alt="Chapulin"
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-cover"
          />
          <span className="text-base font-semibold text-white">
            Plataforma Gastronomica
          </span>
        </Link>

        <div className="hidden items-center gap-1 sm:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-white transition hover:text-[#C4622D]"
            >
              {item.label}
            </Link>
          ))}

          {isAuthenticated ? (
            <>
              <Link
                href="/reservations"
                className="rounded-full px-4 py-2 text-sm font-medium text-white transition hover:text-[#C4622D]"
              >
                Mis Reservaciones
              </Link>
              <span className="px-3 py-2 text-sm font-medium text-white">
                {user?.name}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-4 py-2 text-sm font-medium text-white transition hover:text-[#C4622D]"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/registro"
                className="rounded-full px-4 py-2 text-sm font-medium text-white transition hover:text-[#C4622D]"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

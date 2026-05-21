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
      <nav className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <Image
            src="/images/brand/logo-chapulin.png"
            alt="Chapulin"
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-cover"
          />
          <span className="truncate text-sm font-semibold text-white sm:text-base">
            Plataforma Gastronomica
          </span>
        </Link>

        <div className="-mx-1 flex items-center gap-1 overflow-x-auto pb-1 sm:mx-0 sm:flex-wrap sm:justify-end sm:overflow-visible sm:pb-0">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-full px-3 py-2 text-sm font-medium text-white transition hover:text-[#C4622D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-4"
            >
              {item.label}
            </Link>
          ))}

          {isAuthenticated ? (
            <>
              <Link
                href="/reservations"
                className="shrink-0 rounded-full px-3 py-2 text-sm font-medium text-white transition hover:text-[#C4622D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-4"
              >
                Mis Reservaciones
              </Link>
              <span className="max-w-[10rem] shrink-0 truncate px-3 py-2 text-sm font-medium text-white">
                {user?.name}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="shrink-0 rounded-full bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-4"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="shrink-0 rounded-full px-3 py-2 text-sm font-medium text-white transition hover:text-[#C4622D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-4"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/registro"
                className="shrink-0 rounded-full px-3 py-2 text-sm font-medium text-white transition hover:text-[#C4622D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-4"
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

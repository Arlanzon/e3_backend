import Image from 'next/image'
import Link from 'next/link'

const navItems = [
  { href: '/', label: 'Inicio' },
  { href: '/restaurants', label: 'Restaurantes' },
  { href: '/reservations/new', label: 'Reservar' },
]

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-[#2D5A3D] bg-[#1A3A2A]">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/brand/logo-chapulin.png"
            alt="Chapulín"
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-cover"
          />
          <span className="text-base font-semibold text-white">
            Plataforma Gastronómica
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
        </div>
      </nav>
    </header>
  )
}

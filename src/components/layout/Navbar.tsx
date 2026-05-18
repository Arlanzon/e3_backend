import Link from 'next/link'

const navItems = [
  { href: '/', label: 'Inicio' },
  { href: '/restaurants', label: 'Restaurantes' },
  { href: '/reservations/new', label: 'Reservar' },
]

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
            PG
          </span>
          <span className="text-base font-semibold text-stone-950">
            Plataforma Gastronomica
          </span>
        </Link>

        <div className="hidden items-center gap-1 sm:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-100 hover:text-stone-950"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <Link
          href="/restaurants"
          className="rounded-full bg-stone-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          Explorar
        </Link>
      </nav>
    </header>
  )
}

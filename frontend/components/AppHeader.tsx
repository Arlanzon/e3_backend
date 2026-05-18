import type { NavItem } from '../types'

const navItems: NavItem[] = [
  { label: 'Restaurantes', href: '#restaurantes' },
  { label: 'Reservaciones', href: '#reservaciones' },
  { label: 'Contacto', href: '#contacto' },
]

export function AppHeader() {
  return (
    <header className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
      <a className="text-lg font-semibold text-zinc-950" href="/">
        Plataforma Gastronomica Local
      </a>

      <nav className="flex items-center gap-4 text-sm text-zinc-600">
        {navItems.map((item) => (
          <a className="transition hover:text-zinc-950" href={item.href} key={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  )
}

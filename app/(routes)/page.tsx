import Link from 'next/link'
import PageContainer from '@/components/layout/PageContainer'
import RestaurantCard from '@/components/restaurant/RestaurantCard'

const featuredRestaurants = [
  {
    id: 'casa-nopal',
    name: 'Casa Nopal',
    cuisine: 'Oaxaquena contemporanea',
    neighborhood: 'Centro historico',
    description:
      'Cocina de temporada con maices criollos, moles de la casa y una seleccion cuidada de mezcales locales.',
    rating: 4.8,
    priceRange: '$$$',
    featured: true,
  },
  {
    id: 'patio-lumbre',
    name: 'Patio Lumbre',
    cuisine: 'Brasas y cocina regional',
    neighborhood: 'Jalatlaco',
    description:
      'Un patio relajado para compartir cortes, vegetales al carbon y antojitos preparados con ingredientes de mercado.',
    rating: 4.7,
    priceRange: '$$',
    featured: true,
  },
  {
    id: 'maizal-azul',
    name: 'Maizal Azul',
    cuisine: 'Tlayudas y antojitos',
    neighborhood: 'Reforma',
    description:
      'Sabores tradicionales en un formato casual, ideal para comidas entre amigos y cenas sin prisa.',
    rating: 4.6,
    priceRange: '$$',
    featured: true,
  },
]

export default function HomePage() {
  return (
    <PageContainer className="space-y-16">
      <section className="grid gap-10 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="space-y-7">
          <span className="inline-flex rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800">
            Restaurantes locales en un solo lugar
          </span>
          <div className="space-y-5">
            <h1 className="max-w-3xl text-4xl font-bold tracking-normal text-stone-950 sm:text-5xl">
              Descubre, compara y reserva experiencias gastronomicas en Oaxaca.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-stone-600">
              Una primera vista de la plataforma para explorar restaurantes,
              revisar su propuesta y preparar reservaciones de manera sencilla.
            </p>
          </div>
          <Link
            href="/restaurants"
            className="inline-flex rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            Ver restaurantes
          </Link>
        </div>

        <div className="min-h-80 rounded-lg bg-[linear-gradient(135deg,#064e3b,#f59e0b_55%,#fef3c7)] p-6 text-white shadow-sm">
          <div className="flex h-full min-h-72 flex-col justify-end rounded-lg border border-white/30 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
              Oaxaca · Reservaciones
            </p>
            <p className="mt-3 max-w-sm text-2xl font-semibold">
              Mocks visuales listos para iterar antes de conectar la API.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-semibold text-stone-950">
              Restaurantes destacados
            </h2>
            <p className="mt-2 text-stone-600">
              Una seleccion inicial para mostrar el flujo de exploracion.
            </p>
          </div>
          <Link
            href="/restaurants"
            className="text-sm font-semibold text-emerald-700 hover:text-emerald-900"
          >
            Ver todos
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} {...restaurant} />
          ))}
        </div>
      </section>
    </PageContainer>
  )
}

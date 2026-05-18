import Link from 'next/link'
import PageContainer from '@/components/layout/PageContainer'

const restaurants = [
  {
    id: 'casa-nopal',
    name: 'Casa Nopal',
    cuisine: 'Oaxaquena contemporanea',
    neighborhood: 'Centro historico',
    description:
      'Casa Nopal trabaja con productores cercanos para construir una carta de temporada alrededor de maices criollos, moles de la casa, vegetales tatemados y destilados locales. El espacio esta pensado para comidas pausadas, cenas de celebracion y primeras visitas a la ciudad.',
    rating: 4.8,
    priceRange: '$$$',
    hours: 'Lun a Sab · 13:00 a 22:30',
  },
  {
    id: 'patio-lumbre',
    name: 'Patio Lumbre',
    cuisine: 'Brasas y cocina regional',
    neighborhood: 'Jalatlaco',
    description:
      'Patio Lumbre combina cocina de brasas, antojitos regionales y una atmosfera de patio abierto. Su menu mock destaca platos para compartir y preparaciones sencillas con mucho caracter.',
    rating: 4.7,
    priceRange: '$$',
    hours: 'Mar a Dom · 14:00 a 23:00',
  },
  {
    id: 'maizal-azul',
    name: 'Maizal Azul',
    cuisine: 'Tlayudas y antojitos',
    neighborhood: 'Reforma',
    description:
      'Maizal Azul presenta una experiencia casual con tlayudas, memelas y bebidas frescas. Es una opcion visual para representar restaurantes accesibles dentro del directorio.',
    rating: 4.6,
    priceRange: '$$',
    hours: 'Todos los dias · 12:00 a 21:30',
  },
]

type RestaurantDetailPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function RestaurantDetailPage({
  params,
}: RestaurantDetailPageProps) {
  const { id } = await params
  const restaurant = restaurants.find((item) => item.id === id) ?? restaurants[0]

  return (
    <PageContainer className="space-y-8">
      <Link
        href="/restaurants"
        className="inline-flex text-sm font-semibold text-emerald-700 hover:text-emerald-900"
      >
        Volver a restaurantes
      </Link>

      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div className="min-h-96 rounded-lg bg-[linear-gradient(135deg,#14532d,#0f766e_45%,#f59e0b)] p-6 text-white shadow-sm">
          <div className="flex h-full min-h-80 flex-col justify-end rounded-lg border border-white/30 p-6">
            <span className="w-fit rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-emerald-900">
              Imagen placeholder
            </span>
            <h1 className="mt-5 text-4xl font-bold">{restaurant.name}</h1>
            <p className="mt-2 text-white/85">
              {restaurant.cuisine} · {restaurant.neighborhood}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
              Detalle del restaurante
            </p>
            <h2 className="text-3xl font-bold text-stone-950">
              {restaurant.name}
            </h2>
            <p className="leading-8 text-stone-600">{restaurant.description}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-stone-200 bg-white p-4">
              <p className="text-sm text-stone-500">Rating</p>
              <p className="mt-1 text-xl font-semibold text-stone-950">
                {restaurant.rating.toFixed(1)}
              </p>
            </div>
            <div className="rounded-lg border border-stone-200 bg-white p-4">
              <p className="text-sm text-stone-500">Precio</p>
              <p className="mt-1 text-xl font-semibold text-stone-950">
                {restaurant.priceRange}
              </p>
            </div>
            <div className="rounded-lg border border-stone-200 bg-white p-4">
              <p className="text-sm text-stone-500">Zona</p>
              <p className="mt-1 text-xl font-semibold text-stone-950">
                {restaurant.neighborhood}
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-stone-200 bg-stone-50 p-5">
            <p className="text-sm font-semibold text-stone-950">Horario</p>
            <p className="mt-2 text-stone-600">{restaurant.hours}</p>
          </div>

          <button
            type="button"
            className="w-full rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 sm:w-auto"
          >
            Reservar
          </button>
        </div>
      </section>
    </PageContainer>
  )
}

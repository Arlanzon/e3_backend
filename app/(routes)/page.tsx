import Image from 'next/image'
import Link from 'next/link'
import PageContainer from '@/components/layout/PageContainer'
import RestaurantCard from '@/components/restaurant/RestaurantCard'
import { restaurants } from '@/features/restaurants/data/restaurants'

const featuredRestaurants = restaurants.slice(0, 3).map((restaurant) => ({
  id: restaurant.id,
  name: restaurant.name,
  cuisine: restaurant.category,
  neighborhood: restaurant.location,
  description: restaurant.description,
  rating: restaurant.rating,
  priceRange: restaurant.priceRange,
  imageUrl: restaurant.imageUrl,
  featured: true,
}))

export default function HomePage() {
  return (
    <main className="bg-[#FAFAF7]">
      <PageContainer className="space-y-16 pb-16">
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1A3A2A] to-[#2D5A3D] px-6 py-12 text-white shadow-sm sm:px-10 lg:px-14 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="relative z-10 space-y-7">
              <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white">
                Cocina local, mesas memorables
              </span>
              <div className="space-y-5">
                <h1 className="max-w-3xl text-4xl font-bold tracking-normal text-white sm:text-5xl lg:text-6xl">
                  Descubre el sabor de{' '}
                  <span className="text-[#C4622D]">Oaxaca</span> en cada
                  reserva.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-white/80">
                  Explora restaurantes locales, compara propuestas y encuentra
                  el lugar ideal para desayunar, comer o cerrar la noche con
                  una buena mesa.
                </p>
              </div>
              <Link
                href="/restaurants"
                className="inline-flex rounded-xl bg-[#C4622D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#A94F24] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Ver restaurantes
              </Link>
            </div>

            <div className="relative z-10 min-h-72 lg:min-h-96">
              <Image
                src="/images/brand/alebrije-chapulin.png"
                alt="Alebrije chapulín"
                fill
                priority
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-semibold text-[#1C1C1C]">
                Restaurantes destacados
              </h2>
              <p className="mt-2 text-[#6B6B6B]">
                Una selección inicial para probar sabores oaxaqueños cerca de
                ti.
              </p>
            </div>
            <Link
              href="/restaurants"
              className="text-sm font-semibold text-[#1A3A2A] transition hover:text-[#C4622D]"
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
    </main>
  )
}

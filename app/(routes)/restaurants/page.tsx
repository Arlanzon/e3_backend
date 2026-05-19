import PageContainer from '@/components/layout/PageContainer'
import RestaurantCard from '@/components/restaurant/RestaurantCard'
import { restaurantDetails } from '@/features/restaurants/data/restaurant-details'

const restaurants = restaurantDetails.map((restaurant, index) => ({
  id: restaurant.slug,
  name: restaurant.name,
  cuisine: restaurant.category,
  neighborhood: restaurant.location,
  description: restaurant.description,
  rating: Number(restaurant.rating),
  priceRange: restaurant.price,
  imageUrl: restaurant.imageUrl,
  featured: index === 0,
}))

const filters = ['Todos', 'Centro', 'Jalatlaco', 'Cafe', 'Regional', 'Mejor rating']

export default function RestaurantsPage() {
  return (
    <PageContainer className="space-y-8">
      <section className="space-y-4">
        <span className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
          Directorio
        </span>
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <h1 className="text-3xl font-bold text-stone-950 sm:text-4xl">
              Restaurantes
            </h1>
            <p className="mt-3 max-w-2xl leading-7 text-stone-600">
              Explora opciones mock para validar la estructura visual antes de
              conectar la busqueda con datos reales.
            </p>
          </div>
          <div className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm text-stone-500">
            {restaurants.length} resultados
          </div>
        </div>
      </section>

      <section className="flex flex-wrap gap-3" aria-label="Filtros visuales">
        {filters.map((filter, index) => (
          <button
            key={filter}
            type="button"
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              index === 0
                ? 'border-emerald-700 bg-emerald-700 text-white'
                : 'border-stone-200 bg-white text-stone-600 hover:border-emerald-700 hover:text-emerald-800'
            }`}
          >
            {filter}
          </button>
        ))}
      </section>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} {...restaurant} />
        ))}
      </section>
    </PageContainer>
  )
}

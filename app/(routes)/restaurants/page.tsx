import PageContainer from '@/components/layout/PageContainer'
import RestaurantCard from '@/components/restaurant/RestaurantCard'

const restaurants = [
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
  },
  {
    id: 'mesa-calenda',
    name: 'Mesa Calenda',
    cuisine: 'Menu de degustacion',
    neighborhood: 'Xochimilco',
    description:
      'Un recorrido por ingredientes locales, tecnicas artesanales y platos pensados para celebrar ocasiones especiales.',
    rating: 4.9,
    priceRange: '$$$$',
  },
  {
    id: 'bruma-cafe',
    name: 'Bruma Cafe',
    cuisine: 'Cafe y brunch',
    neighborhood: 'Centro historico',
    description:
      'Cafe de especialidad, pan dulce de la casa y desayunos amplios para empezar el dia caminando el centro.',
    rating: 4.5,
    priceRange: '$$',
  },
  {
    id: 'huerto-santo',
    name: 'Huerto Santo',
    cuisine: 'Vegetariana regional',
    neighborhood: 'San Felipe',
    description:
      'Platos frescos con vegetales locales, hierbas aromaticas y una carta ligera para comidas tranquilas.',
    rating: 4.4,
    priceRange: '$$',
  },
]

const filters = ['Todos', 'Centro', 'Jalatlaco', 'Brunch', 'Cena', 'Mejor rating']

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

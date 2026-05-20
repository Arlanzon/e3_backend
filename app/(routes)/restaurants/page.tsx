'use client'

import { useMemo, useState } from 'react'
import { mockRestaurants } from '@/features/restaurants/data/restaurants'
import RestaurantCard from '@/components/restaurant/RestaurantCard'
import EmptyState from '@/components/ui/EmptyState'

const cuisineFilters = [
  'Todos',
  'Comida Tradicional',
  'Cafetería',
  'Antojitos',
  'Bar y Botanas',
  'Fonda',
  'Carnes',
]

const normalizeText = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

export default function RestaurantsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCuisine, setSelectedCuisine] = useState('Todos')

  const filteredRestaurants = useMemo(() => {
    const normalizedSearch = normalizeText(searchTerm.trim())
    const normalizedCuisine = normalizeText(selectedCuisine)

    return mockRestaurants.filter((restaurant) => {
      const matchesCuisine =
        selectedCuisine === 'Todos' ||
        normalizeText(restaurant.cuisineType) === normalizedCuisine

      const searchableText = normalizeText(
        `${restaurant.name} ${restaurant.cuisineType} ${restaurant.address}`,
      )
      const matchesSearch =
        normalizedSearch.length === 0 ||
        searchableText.includes(normalizedSearch)

      return matchesCuisine && matchesSearch
    })
  }, [searchTerm, selectedCuisine])

  return (
    <main className="min-h-screen bg-[#FAFAF7] px-4 py-10 text-[#1C1C1C] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="space-y-6">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#C4622D]">
                Directorio gastronómico
              </p>
              <h1 className="mt-3 text-3xl font-bold text-[#1A3A2A] sm:text-4xl">
                Restaurantes en Oaxaca
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-[#6B6B6B]">
                Descubre los mejores lugares para comer
              </p>
            </div>

            <div className="w-fit rounded-full border border-[#E8E4DE] bg-white px-4 py-2 text-sm font-medium text-[#1A3A2A] shadow-sm">
              {filteredRestaurants.length} restaurantes encontrados
            </div>
          </div>

          <div className="rounded-2xl border border-[#E8E4DE] bg-white p-4 shadow-sm">
            <label htmlFor="restaurant-search" className="sr-only">
              Buscar restaurante
            </label>
            <input
              id="restaurant-search"
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar restaurante..."
              className="w-full rounded-xl border border-[#E8E4DE] bg-[#FAFAF7] px-4 py-3 text-sm text-[#1C1C1C] outline-none transition placeholder:text-[#6B6B6B] focus:border-[#1A3A2A] focus:bg-white focus:ring-2 focus:ring-[#1A3A2A]/15"
            />
          </div>
        </section>

        <section
          className="flex flex-wrap gap-3"
          aria-label="Filtros por tipo de cocina"
        >
          {cuisineFilters.map((filter) => {
            const isActive = selectedCuisine === filter

            return (
              <button
                key={filter}
                type="button"
                onClick={() => setSelectedCuisine(filter)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? 'border-[#1A3A2A] bg-[#1A3A2A] text-white shadow-sm'
                    : 'border-[#E8E4DE] bg-white text-[#6B6B6B] hover:border-[#C4622D] hover:text-[#1A3A2A]'
                }`}
              >
                {filter}
              </button>
            )
          })}
        </section>

        {filteredRestaurants.length > 0 ? (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                id={restaurant.id}
                name={restaurant.name}
                cuisineType={restaurant.cuisineType}
                address={restaurant.address}
                ratingAvg={restaurant.ratingAvg}
                ratingCount={restaurant.ratingCount}
                photoUrl={
                  restaurant.photos?.find((photo) => photo.isPrimary)?.url ??
                  restaurant.photos?.[0]?.url
                }
                featured={false}
              />
            ))}
          </section>
        ) : (
          <section className="rounded-2xl border border-[#E8E4DE] bg-white shadow-sm">
            <EmptyState
              title="No encontramos restaurantes"
              description="Intenta con otro filtro o búsqueda"
            />
          </section>
        )}
      </div>
    </main>
  )
}

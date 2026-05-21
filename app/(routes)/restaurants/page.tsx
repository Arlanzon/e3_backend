'use client'

import { useEffect, useMemo, useState } from 'react'
import { getRestaurantsApi } from '@/features/restaurants/restaurants.api'
import type { ApiRestaurant } from '@/features/restaurants/api-types'
import RestaurantCard from '@/components/restaurant/RestaurantCard'
import EmptyState from '@/components/ui/EmptyState'

const FILTERS = [
  'Todos',
  'Comida Tradicional',
  'Cafetería',
  'Antojitos',
  'Bar y Botanas',
  'Fonda',
  'Carnes',
]

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<ApiRestaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('Todos')

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        setLoading(true)
        setError(null)
        const params: { cuisine?: string } = {}
        if (activeFilter !== 'Todos') {
          params.cuisine = activeFilter
        }
        const response = await getRestaurantsApi({
          page: 1,
          limit: 20,
          ...params,
        })
        setRestaurants(response.data)
      } catch {
        setError('No pudimos cargar los restaurantes. Intenta de nuevo.')
      } finally {
        setLoading(false)
      }
    }
    fetchRestaurants()
  }, [activeFilter])

  const filtered = useMemo(() => {
    if (!search.trim()) return restaurants
    const q = search.toLowerCase()
    return restaurants.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.cuisineType.toLowerCase().includes(q) ||
        r.address.toLowerCase().includes(q),
    )
  }, [restaurants, search])

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

            <div className="w-fit max-w-full rounded-full border border-[#E8E4DE] bg-white px-4 py-2 text-sm font-medium text-[#1A3A2A] shadow-sm">
              {filtered.length} restaurantes encontrados
            </div>
          </div>

          <div className="rounded-2xl border border-[#E8E4DE] bg-white p-3 shadow-sm sm:p-4">
            <label htmlFor="restaurant-search" className="sr-only">
              Buscar restaurante
            </label>
            <input
              id="restaurant-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar restaurante..."
              className="w-full rounded-xl border border-[#E8E4DE] bg-[#FAFAF7] px-4 py-3 text-sm text-[#1A3A2A] outline-none transition placeholder:text-[#8A8A8A] focus:border-[#1A3A2A] focus:bg-white focus:ring-2 focus:ring-[#1A3A2A]/15"
            />
          </div>
        </section>

        <section
          className="flex flex-wrap gap-3"
          aria-label="Filtros por tipo de cocina"
        >
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter

            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A3A2A] ${
                  isActive
                    ? 'bg-[#1A3A2A] text-white'
                    : 'border border-[#E8E4DE] bg-white text-[#6B6B6B] hover:border-[#C4622D] hover:text-[#1A3A2A]'
                }`}
              >
                {filter}
              </button>
            )
          })}
        </section>

        {loading ? (
          <p className="text-sm text-[#6B6B6B]">Cargando restaurantes...</p>
        ) : null}

        {error ? (
          <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        {!loading && !error && filtered.length === 0 ? (
          <section className="rounded-2xl border border-[#E8E4DE] bg-white shadow-sm">
            <EmptyState
              title="No encontramos restaurantes"
              description="Intenta con otro filtro o búsqueda"
            />
          </section>
        ) : null}

        {!loading && !error && filtered.length > 0 ? (
          <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {filtered.map((r) => (
              <RestaurantCard
                key={r.id}
                id={r.id}
                name={r.name}
                cuisineType={r.cuisineType}
                address={r.address}
                ratingAvg={
                  r.ratingAvg === null
                    ? null
                    : typeof r.ratingAvg === 'number'
                      ? r.ratingAvg
                      : Number.parseFloat(String(r.ratingAvg))
                }
                ratingCount={r.ratingCount}
                photoUrl={
                  r.photos?.find((p) => p.isPrimary)?.url ?? r.photos?.[0]?.url
                }
              />
            ))}
          </section>
        ) : null}
      </div>
    </main>
  )
}

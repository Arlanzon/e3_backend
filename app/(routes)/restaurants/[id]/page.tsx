'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { getReviewsByRestaurantId } from '@/features/restaurants/data/restaurant-details'
import { getRestaurantByIdApi } from '@/features/restaurants/restaurants.api'
import type { ApiRestaurant } from '@/features/restaurants/api-types'
import type { BusinessHour, Restaurant, Review } from '@/features/restaurants/types'
import { DAY_LABELS } from '@/features/restaurants/types'

const fallbackPhotoUrl = '/images/restaurants/fallback-restaurant.png'

function minutesToTime(minutes: number | undefined): string {
  if (typeof minutes !== 'number') return '00:00'

  const hours = Math.floor(minutes / 60)
    .toString()
    .padStart(2, '0')
  const mins = (minutes % 60).toString().padStart(2, '0')

  return `${hours}:${mins}`
}

function toNumber(value: number | string | undefined, fallback = 0): number {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value)
    return Number.isNaN(parsed) ? fallback : parsed
  }

  return fallback
}

function mapBusinessHour(
  businessHour: NonNullable<ApiRestaurant['businessHours']>[number],
): BusinessHour {
  return {
    id: businessHour.id,
    dayOfWeek: businessHour.dayOfWeek,
    openTime:
      businessHour.openTime ?? minutesToTime(businessHour.openTimeMin),
    closeTime:
      businessHour.closeTime ?? minutesToTime(businessHour.closeTimeMin),
    isClosed: businessHour.isClosed,
  }
}

function mapApiRestaurant(restaurant: ApiRestaurant): Restaurant {
  const rating =
    restaurant.ratingAvg === null
      ? null
      : typeof restaurant.ratingAvg === 'number'
        ? restaurant.ratingAvg
        : Number.parseFloat(String(restaurant.ratingAvg))

  return {
    id: restaurant.id,
    name: restaurant.name,
    slug: restaurant.slug,
    description: restaurant.description ?? null,
    cuisineType: restaurant.cuisineType,
    address: restaurant.address,
    lat: toNumber(restaurant.lat),
    lng: toNumber(restaurant.lng),
    phone: restaurant.phone ?? null,
    capacity: restaurant.capacity ?? 0,
    reservationCapacityFactor: toNumber(
      restaurant.reservationCapacityFactor,
      0.7,
    ),
    reservationDurationMin: restaurant.reservationDurationMin ?? 90,
    minAdvanceHours: restaurant.minAdvanceHours ?? 2,
    maxAdvanceDays: restaurant.maxAdvanceDays ?? 30,
    timezone: restaurant.timezone ?? 'America/Mexico_City',
    status: restaurant.status,
    ratingAvg: rating,
    ratingCount: restaurant.ratingCount,
    createdAt: restaurant.createdAt,
    photos: restaurant.photos,
    businessHours: restaurant.businessHours?.map(mapBusinessHour),
  }
}

function getPrimaryPhotoUrl(restaurant: Restaurant): string {
  return (
    restaurant.photos?.find((photo) => photo.isPrimary)?.url ??
    restaurant.photos?.[0]?.url ??
    fallbackPhotoUrl
  )
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="rounded-2xl border border-[#E8E4DE] bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <p className="font-semibold text-[#1C1C1C]">{review.userName}</p>
        <p className="text-sm text-[#C4622D]" aria-label={`${review.rating} estrellas`}>
          {'★'.repeat(review.rating)}
        </p>
      </div>

      <p className="mt-3 text-sm leading-6 text-[#6B6B6B]">
        {review.comment ?? 'Sin comentario'}
      </p>

      {review.response ? (
        <div className="mt-4 border-l-4 border-[#1A3A2A] bg-[#FAFAF7] py-3 pl-4 pr-3">
          <p className="text-sm font-medium text-[#1A3A2A]">
            Respuesta del restaurante:
          </p>
          <p className="mt-1 text-sm leading-6 text-[#6B6B6B]">
            {review.response.content}
          </p>
        </div>
      ) : null}
    </article>
  )
}

function RestaurantLoadError() {
  return (
    <main className="min-h-screen bg-[#FAFAF7] px-4 py-16 text-[#1C1C1C] sm:px-6 lg:px-8">
      <section className="mx-auto max-w-xl rounded-2xl border border-[#E8E4DE] bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-[#1A3A2A]">
          No pudimos cargar el restaurante
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#6B6B6B]">
          Intenta de nuevo en unos minutos.
        </p>
        <Link
          href="/restaurants"
          className="mt-6 inline-flex rounded-xl bg-[#C4622D] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#A8521F]"
        >
          Volver al listado
        </Link>
      </section>
    </main>
  )
}

export default function RestaurantDetailPage() {
  const params = useParams<{ id: string | string[] }>()
  const id = Array.isArray(params.id) ? params.id[0] : params.id
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setError('missing-id')
      setLoading(false)
      return
    }

    let active = true

    async function loadRestaurant() {
      try {
        setLoading(true)
        setError(null)
        const response = await getRestaurantByIdApi(id)

        if (active) {
          setRestaurant(mapApiRestaurant(response.data))
        }
      } catch {
        if (active) {
          setError('load-error')
          setRestaurant(null)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadRestaurant()

    return () => {
      active = false
    }
  }, [id])

  const reviews = useMemo(
    () => (id ? getReviewsByRestaurantId(id) : []),
    [id],
  )

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FAFAF7] px-4 py-16 text-sm font-medium text-[#1A3A2A] sm:px-6 lg:px-8">
        Cargando restaurante...
      </main>
    )
  }

  if (error || !restaurant) {
    return <RestaurantLoadError />
  }

  const mainPhotoUrl = getPrimaryPhotoUrl(restaurant)
  const rating = restaurant.ratingAvg

  return (
    <main className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C]">
      <section className="relative h-[340px] overflow-hidden sm:h-[400px]">
        <Image
          src={mainPhotoUrl}
          alt={restaurant.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1C]/85 via-[#1C1C1C]/40 to-transparent" />

        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
            <span className="inline-flex rounded-full bg-[#C4622D] px-3 py-1 text-xs font-semibold text-white">
              {restaurant.cuisineType}
            </span>
            <h1 className="mt-4 break-words text-3xl font-bold text-white sm:text-4xl">
              {restaurant.name}
            </h1>

            <div className="mt-3 flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              {rating !== null ? (
                <p className="font-medium text-white">
                  <span aria-hidden="true">★</span> {rating.toFixed(1)} (
                  {restaurant.ratingCount} reseñas)
                </p>
              ) : null}
              <p className="text-white/80">
                <span aria-hidden="true">📍</span> {restaurant.address}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/restaurants"
          className="text-sm font-medium text-[#1A3A2A] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A3A2A]"
        >
          ← Volver al listado
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-3 lg:items-start">
          <div className="space-y-8 lg:col-span-2">
            <section className="rounded-2xl border border-[#E8E4DE] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#1A3A2A]">
                Sobre el restaurante
              </h2>
              <p className="mt-3 leading-7 text-[#6B6B6B]">
                {restaurant.description ?? 'Sin descripción disponible'}
              </p>
            </section>

            <section className="rounded-2xl border border-[#E8E4DE] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#1A3A2A]">
                Información
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <p className="min-w-0 break-words rounded-xl bg-[#FAFAF7] p-4 text-sm text-[#1C1C1C]">
                  👥 {restaurant.capacity} personas
                </p>
                <p className="min-w-0 break-words rounded-xl bg-[#FAFAF7] p-4 text-sm text-[#1C1C1C]">
                  ☎ {restaurant.phone ?? 'No disponible'}
                </p>
                <p className="min-w-0 break-words rounded-xl bg-[#FAFAF7] p-4 text-sm text-[#1C1C1C]">
                  ⏱ {restaurant.reservationDurationMin} minutos
                </p>
              </div>
            </section>

            {restaurant.businessHours && restaurant.businessHours.length > 0 ? (
              <section className="rounded-2xl border border-[#E8E4DE] bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-[#1A3A2A]">
                  Horarios
                </h2>
                <div className="mt-4 divide-y divide-[#E8E4DE]">
                  {restaurant.businessHours.map((businessHour) => (
                    <div
                      key={businessHour.id}
                      className="flex flex-col gap-1 py-3 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                    >
                      <span className="font-medium text-[#1C1C1C]">
                        {DAY_LABELS[businessHour.dayOfWeek]}
                      </span>
                      {businessHour.isClosed ? (
                        <span className="text-red-500">Cerrado</span>
                      ) : (
                        <span className="text-[#1C1C1C]">
                          {businessHour.openTime} - {businessHour.closeTime}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-[#1A3A2A]">
                Reseñas ({reviews.length})
              </h2>
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              ) : (
                <p className="rounded-2xl border border-[#E8E4DE] bg-white p-6 text-sm text-[#6B6B6B] shadow-sm">
                  Sin reseñas aún
                </p>
              )}
            </section>
          </div>

          <aside className="rounded-2xl border border-[#E8E4DE] bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-28 lg:col-span-1">
            <h2 className="text-xl font-semibold text-[#1A3A2A]">
              Hacer una reservación
            </h2>
            <div className="mt-5 space-y-3 text-sm text-[#6B6B6B]">
              <p>
                <span className="font-medium text-[#1C1C1C]">
                  Capacidad disponible:
                </span>{' '}
                {restaurant.capacity} personas
              </p>
              <p>
                <span className="font-medium text-[#1C1C1C]">
                  Anticipación mínima:
                </span>{' '}
                {restaurant.minAdvanceHours} horas
              </p>
            </div>

            <Link
              href={`/reservations/new?restaurantId=${restaurant.id}`}
              className="mt-6 block w-full rounded-xl bg-[#C4622D] py-3 text-center font-semibold text-white transition-colors hover:bg-[#A8521F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C4622D]"
            >
              Reservar
            </Link>
            <p className="mt-2 text-center text-xs text-[#6B6B6B]">
              Recibirás confirmación en menos de 2 horas
            </p>
          </aside>
        </div>
      </div>
    </main>
  )
}

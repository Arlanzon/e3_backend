import {
  getRestaurantById,
  getReviewsByRestaurantId,
} from '@/features/restaurants/data/restaurant-details'
import type { Restaurant, Review } from '@/features/restaurants/types'
import { DAY_LABELS } from '@/features/restaurants/types'
import Image from 'next/image'
import Link from 'next/link'

type RestaurantDetailPageProps = {
  params: Promise<{
    id: string
  }>
}

const fallbackPhotoUrl = '/images/restaurants/fallback-restaurant.png'

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

export default async function RestaurantDetailPage({
  params,
}: RestaurantDetailPageProps) {
  const { id } = await params
  let restaurant: Restaurant | null = null

  try {
    restaurant = getRestaurantById(id)
  } catch {
    return <RestaurantLoadError />
  }

  if (!restaurant) {
    return <RestaurantLoadError />
  }

  const reviews = getReviewsByRestaurantId(id)
  const mainPhotoUrl = getPrimaryPhotoUrl(restaurant)

  return (
    <main className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C]">
      <section className="relative h-[400px] overflow-hidden">
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
            <h1 className="mt-4 text-4xl font-bold text-white">
              {restaurant.name}
            </h1>

            <div className="mt-3 flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              {restaurant.ratingAvg !== null ? (
                <p className="font-medium text-white">
                  <span aria-hidden="true">★</span> {restaurant.ratingAvg.toFixed(1)} (
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
          className="text-sm font-medium text-[#1A3A2A] hover:underline"
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
                <p className="rounded-xl bg-[#FAFAF7] p-4 text-sm text-[#1C1C1C]">
                  👥 {restaurant.capacity} personas
                </p>
                <p className="rounded-xl bg-[#FAFAF7] p-4 text-sm text-[#1C1C1C]">
                  📞 {restaurant.phone ?? 'No disponible'}
                </p>
                <p className="rounded-xl bg-[#FAFAF7] p-4 text-sm text-[#1C1C1C]">
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
                      className="flex items-center justify-between gap-4 py-3 text-sm"
                    >
                      <span className="font-medium text-[#1C1C1C]">
                        {DAY_LABELS[businessHour.dayOfWeek]}
                      </span>
                      {businessHour.isClosed ? (
                        <span className="text-red-500">Cerrado</span>
                      ) : (
                        <span className="text-[#1C1C1C]">
                          {businessHour.openTime} — {businessHour.closeTime}
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

          <aside className="rounded-2xl border border-[#E8E4DE] bg-white p-6 shadow-sm lg:sticky lg:top-6 lg:col-span-1">
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
              className="mt-6 block w-full rounded-xl bg-[#C4622D] py-3 text-center font-semibold text-white transition-colors hover:bg-[#A8521F]"
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

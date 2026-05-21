'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import PageContainer from '@/components/layout/PageContainer'
import ReservationCard from '@/components/reservation/ReservationCard'
import ReservationsHeader from '@/components/reservation/ReservationsHeader'
import EmptyState from '@/components/ui/EmptyState'
import type { ApiReservation } from '@/features/reservations/api-types'
import { getMyReservationsApi } from '@/features/reservations/reservations.api'
import type { Reservation } from '@/features/reservations/types'
import { ApiError } from '@/lib/api-error'
import { useAuthStore } from '@/store/auth.store'

function mapApiReservation(reservation: ApiReservation): Reservation {
  return {
    id: reservation.id,
    restaurantId: reservation.restaurantId,
    restaurantName: reservation.restaurant?.name ?? 'Restaurante',
    restaurantCuisine: 'Reservación',
    date: reservation.date,
    time: reservation.time,
    numPersons: reservation.numPersons,
    status: reservation.status,
    notes: reservation.notes,
    rejectionReason: reservation.rejectionReason ?? null,
    confirmedAt: reservation.confirmedAt ?? null,
    cancelledAt: reservation.cancelledAt ?? null,
    completedAt: reservation.completedAt ?? null,
    expiredAt: reservation.expiredAt ?? null,
    rejectedAt: reservation.rejectedAt ?? null,
    createdAt: reservation.createdAt,
  }
}

export default function ReservationsPage() {
  const router = useRouter()
  const token = useAuthStore((state) => state.token)
  const [reservations, setReservations] = useState<ApiReservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      router.push('/login')
      return
    }

    const authToken = token
    let active = true

    async function loadReservations() {
      try {
        setLoading(true)
        setError(null)
        const response = await getMyReservationsApi(authToken, {
          page: 1,
          limit: 20,
        })

        if (active) {
          setReservations(response.data)
        }
      } catch (loadError) {
        if (loadError instanceof ApiError && loadError.status === 401) {
          router.push('/login')
          return
        }

        if (active) {
          setError('No pudimos cargar tus reservaciones. Intenta de nuevo.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadReservations()

    return () => {
      active = false
    }
  }, [router, token])

  const reservationCards = reservations.map(mapApiReservation)

  return (
    <PageContainer className="space-y-8 bg-[#FAFAF7]">
      <ReservationsHeader total={reservations.length} />

      <div className="flex justify-start">
        <Link
          href="/restaurants"
          className="rounded-lg bg-[#C4622D] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#A8521F]"
        >
          Buscar restaurante para reservar
        </Link>
      </div>

      {loading ? (
        <section className="rounded-lg border border-[#E8E4DE] bg-white px-6 py-10 text-sm font-medium text-[#1A3A2A]">
          Cargando reservaciones...
        </section>
      ) : null}

      {!loading && error ? (
        <section className="rounded-lg border border-red-200 bg-red-50 px-6 py-4 text-sm font-medium text-red-700">
          {error}
        </section>
      ) : null}

      {!loading && !error && reservations.length === 0 ? (
        <section className="rounded-lg border border-[#E8E4DE] bg-white">
          <EmptyState
            title="No tienes reservaciones"
            description="Reserva en tu restaurante favorito"
            action={
              <Link
                href="/restaurants"
                className="rounded-lg bg-[#C4622D] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#A8521F]"
              >
                Ver restaurantes
              </Link>
            }
          />
        </section>
      ) : null}

      {!loading && !error && reservationCards.length > 0 ? (
        <section className="grid gap-4">
          {reservationCards.map((reservation) => (
            <ReservationCard key={reservation.id} reservation={reservation} />
          ))}
        </section>
      ) : null}
    </PageContainer>
  )
}

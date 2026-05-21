'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import PageContainer from '@/components/layout/PageContainer'
import ReservationCard from '@/components/reservation/ReservationCard'
import ReservationsHeader from '@/components/reservation/ReservationsHeader'
import EmptyState from '@/components/ui/EmptyState'
import type { ApiReservation } from '@/features/reservations/api-types'
import {
  cancelReservationApi,
  getMyReservationsApi,
} from '@/features/reservations/reservations.api'
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
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)
  const [reservations, setReservations] = useState<ApiReservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cancelling, setCancelling] = useState<string | null>(null)
  const [cancelError, setCancelError] = useState<string | null>(null)

  useEffect(() => {
    if (!hasHydrated) return

    if (!token || !isAuthenticated) {
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
  }, [hasHydrated, isAuthenticated, router, token])

  const reservationCards = reservations.map(mapApiReservation)

  async function handleCancel(id: string) {
    if (!token) return

    try {
      setCancelling(id)
      setCancelError(null)
      await cancelReservationApi(id, token)
      const response = await getMyReservationsApi(token, {
        page: 1,
        limit: 20,
      })
      setReservations(response.data)
    } catch (err) {
      if (err instanceof ApiError) {
        const messages: Record<string, string> = {
          INVALID_STATUS: 'Esta reservación no se puede cancelar',
          CANCELLATION_TOO_LATE:
            'No puedes cancelar con menos de 2 horas de anticipación',
          FORBIDDEN: 'No tienes permiso para cancelar esta reservación',
          RESERVATION_NOT_FOUND: 'Reservación no encontrada',
        }
        setCancelError(messages[err.message] ?? err.message)
      } else {
        setCancelError('No pudimos cancelar. Intenta de nuevo.')
      }
    } finally {
      setCancelling(null)
    }
  }

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

      {!hasHydrated ? (
        <section className="rounded-lg border border-[#E8E4DE] bg-white px-6 py-10 text-sm font-medium text-[#1A3A2A]">
          Validando sesión...
        </section>
      ) : null}

      {hasHydrated && loading ? (
        <section className="rounded-lg border border-[#E8E4DE] bg-white px-6 py-10 text-sm font-medium text-[#1A3A2A]">
          Cargando reservaciones...
        </section>
      ) : null}

      {hasHydrated && !loading && error ? (
        <section className="rounded-lg border border-red-200 bg-red-50 px-6 py-4 text-sm font-medium text-red-700">
          {error}
        </section>
      ) : null}

      {hasHydrated && !loading && !error && reservations.length === 0 ? (
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

      {hasHydrated && !loading && !error && reservationCards.length > 0 ? (
        <>
          {cancelError && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-4">
              {cancelError}
            </p>
          )}

          <section className="grid gap-4">
            {reservationCards.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                onCancel={
                  reservation.status === 'CONFIRMED'
                    ? () => handleCancel(reservation.id)
                    : undefined
                }
                cancelDisabled={cancelling === reservation.id}
                cancelLabel={
                  cancelling === reservation.id
                    ? 'Cancelando...'
                    : 'Cancelar reservación'
                }
              />
            ))}
          </section>
        </>
      ) : null}
    </PageContainer>
  )
}

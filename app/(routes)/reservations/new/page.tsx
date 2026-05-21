'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, type FormEvent, useState } from 'react'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import PageContainer from '@/components/layout/PageContainer'
import { createReservationApi } from '@/features/reservations/reservations.api'
import { ApiError } from '@/lib/api-error'
import { useAuthStore } from '@/store/auth.store'

const today = new Date().toISOString().split('T')[0]

function getApiErrorCode(error: ApiError): string | null {
  const data = error.data

  if (data && typeof data === 'object' && 'code' in data) {
    const code = data.code
    return typeof code === 'string' ? code : null
  }

  return null
}

function getReservationErrorMessage(error: unknown): string {
  if (!(error instanceof ApiError)) {
    return 'Ocurrió un error. Intenta de nuevo.'
  }

  switch (getApiErrorCode(error)) {
    case 'INSUFFICIENT_ADVANCE':
      return 'Debes reservar con más anticipación'
    case 'TOO_FAR_IN_ADVANCE':
      return 'La fecha es demasiado lejana'
    case 'RESTAURANT_CLOSED':
      return 'El restaurante está cerrado ese día'
    case 'OUTSIDE_BUSINESS_HOURS':
      return 'La hora está fuera del horario del restaurante'
    case 'NO_AVAILABILITY':
      return 'No hay disponibilidad para ese horario'
    default:
      return error.message
  }
}

function NewReservationContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const restaurantId = searchParams.get('restaurantId') ?? ''
  const token = useAuthStore((state) => state.token)

  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [numPersons, setNumPersons] = useState(2)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!token) {
      return
    }

    if (!restaurantId) {
      setError('Selecciona un restaurante para continuar.')
      return
    }

    if (!date || !time) {
      setError('Selecciona fecha y hora para continuar.')
      return
    }

    try {
      setLoading(true)
      await createReservationApi(
        {
          restaurantId,
          date,
          time,
          numPersons,
          notes: notes.trim() || undefined,
        },
        token,
      )
      setSuccess(true)
      setTimeout(() => {
        router.push('/reservations')
      }, 2000)
    } catch (submitError) {
      setError(getReservationErrorMessage(submitError))
    } finally {
      setLoading(false)
    }
  }

  if (!restaurantId) {
    return (
      <PageContainer className="bg-[#FAFAF7]">
        <section className="mx-auto max-w-2xl space-y-5 rounded-lg border border-[#E8E4DE] bg-white p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#C4622D]">
            Reserva
          </p>
          <h1 className="text-3xl font-bold text-[#1A3A2A]">
            Falta seleccionar un restaurante
          </h1>
          <p className="leading-7 text-[#5F625D]">
            Para crear una reservación, primero elige un restaurante disponible.
          </p>
          <Link
            href="/restaurants"
            className="inline-flex rounded-lg bg-[#1A3A2A] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#254C39]"
          >
            Volver a restaurantes
          </Link>
        </section>
      </PageContainer>
    )
  }

  return (
    <PageContainer className="space-y-8 bg-[#FAFAF7]">
      <section className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#C4622D]">
          Reserva
        </p>
        <h1 className="text-3xl font-bold text-[#1A3A2A] sm:text-4xl">
          Nueva reservación
        </h1>
        <p className="max-w-2xl leading-7 text-[#5F625D]">
          Completa los datos para enviar tu solicitud al restaurante.
        </p>
      </section>

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl space-y-5 rounded-lg border border-[#E8E4DE] bg-white p-4 shadow-sm sm:p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label
              htmlFor="date"
              className="text-sm font-medium text-[#1A3A2A]"
            >
              Fecha
            </label>
            <input
              id="date"
              name="date"
              type="date"
              min={today}
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="w-full rounded-lg border border-[#E8E4DE] bg-white px-4 py-2.5 text-sm text-[#1A3A2A] focus:outline-none focus:ring-2 focus:ring-[#1A3A2A]/20"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="time"
              className="text-sm font-medium text-[#1A3A2A]"
            >
              Hora
            </label>
            <input
              id="time"
              name="time"
              type="time"
              value={time}
              onChange={(event) => setTime(event.target.value)}
              className="w-full rounded-lg border border-[#E8E4DE] bg-white px-4 py-2.5 text-sm text-[#1A3A2A] focus:outline-none focus:ring-2 focus:ring-[#1A3A2A]/20"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label
            htmlFor="numPersons"
            className="text-sm font-medium text-[#1A3A2A]"
          >
            Personas
          </label>
          <select
            id="numPersons"
            name="numPersons"
            value={numPersons}
            onChange={(event) => setNumPersons(Number(event.target.value))}
            className="w-full rounded-lg border border-[#E8E4DE] bg-white px-4 py-2.5 text-sm text-[#1A3A2A] focus:outline-none focus:ring-2 focus:ring-[#1A3A2A]/20"
          >
            {Array.from({ length: 20 }, (_, index) => index + 1).map(
              (option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ),
            )}
          </select>
        </div>

        <div className="space-y-1">
          <label
            htmlFor="notes"
            className="text-sm font-medium text-[#1A3A2A]"
          >
            Notas opcionales
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            maxLength={500}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            className="w-full rounded-lg border border-[#E8E4DE] bg-white px-4 py-2.5 text-sm text-[#1A3A2A] placeholder:text-[#8A8A8A] focus:outline-none focus:ring-2 focus:ring-[#1A3A2A]/20"
          />
        </div>

        {success ? (
          <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            ¡Reservación enviada! Redirigiendo...
          </p>
        ) : null}

        {error ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading || success}
          className="w-full rounded-lg bg-[#1A3A2A] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#254C39] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A3A2A] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Enviando...' : 'Confirmar reservación'}
        </button>
      </form>
    </PageContainer>
  )
}

export default function NewReservationPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-2xl mx-auto px-6 py-8">
          <p className="text-[#6B6B6B]">Cargando...</p>
        </div>
      }
    >
      <ProtectedRoute>
        <NewReservationContent />
      </ProtectedRoute>
    </Suspense>
  )
}

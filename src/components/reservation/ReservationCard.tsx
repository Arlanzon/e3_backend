import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import type { Reservation } from '@/features/reservations/types'
import { STATUS_COLORS, STATUS_LABELS } from '@/features/reservations/types'

type ReservationCardProps = {
  reservation: Reservation
  onCancel?: () => void
  cancelDisabled?: boolean
  cancelLabel?: string
}

export default function ReservationCard({
  reservation,
  onCancel,
  cancelDisabled = false,
  cancelLabel = 'Cancelar reservación',
}: ReservationCardProps) {
  return (
    <article className="min-w-0 rounded-2xl border border-[#E8E4DE] bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#C4622D]">
            {reservation.restaurantCuisine}
          </p>
          <h3 className="break-words text-lg font-semibold text-[#1A3A2A]">
            {reservation.restaurantName}
          </h3>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#6B6B6B]">
            <span>Fecha: {reservation.date}</span>
            <span>Hora: {reservation.time}</span>
            <span>Personas: {reservation.numPersons}</span>
          </div>
        </div>

        <Badge
          label={STATUS_LABELS[reservation.status]}
          className={STATUS_COLORS[reservation.status]}
        />
      </div>

      <div className="mt-5 grid gap-3 sm:flex sm:flex-wrap">
        <Link
          href={`/restaurants/${reservation.restaurantId}`}
          className="rounded-lg border border-[#E8E4DE] px-4 py-2 text-center text-sm font-medium text-[#1A3A2A] transition hover:border-[#1A3A2A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A3A2A]"
        >
          Ver detalle
        </Link>
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            disabled={cancelDisabled}
            className="rounded-lg border border-[#E8E4DE] px-4 py-2 text-sm font-medium text-[#6B6B6B] transition hover:border-[#C4622D] hover:text-[#C4622D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C4622D] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelLabel}
          </button>
        ) : null}
      </div>
    </article>
  )
}

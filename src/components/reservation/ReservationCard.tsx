import Badge from '@/components/ui/Badge'
import type { Reservation } from '@/features/reservations/types'
import { STATUS_COLORS, STATUS_LABELS } from '@/features/reservations/types'

type ReservationCardProps = {
  reservation: Reservation
}

export default function ReservationCard({ reservation }: ReservationCardProps) {
  return (
    <article className="rounded-2xl border border-[#E8E4DE] bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#C4622D]">
            {reservation.restaurantCuisine}
          </p>
          <h3 className="text-lg font-semibold text-[#1A3A2A]">
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

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded-lg border border-[#E8E4DE] px-4 py-2 text-sm font-medium text-[#1A3A2A] transition hover:border-[#1A3A2A]"
        >
          Ver detalle
        </button>
        <button
          type="button"
          className="rounded-lg border border-[#E8E4DE] px-4 py-2 text-sm font-medium text-[#6B6B6B] transition hover:border-[#C4622D] hover:text-[#C4622D]"
        >
          Cancelar
        </button>
      </div>
    </article>
  )
}

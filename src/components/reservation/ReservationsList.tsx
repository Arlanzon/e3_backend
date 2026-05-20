import ReservationCard from '@/components/reservation/ReservationCard'
import EmptyState from '@/components/ui/EmptyState'
import type { Reservation } from '@/features/reservations/types'

type ReservationsListProps = {
  reservations: Reservation[]
}

export default function ReservationsList({
  reservations,
}: ReservationsListProps) {
  if (reservations.length === 0) {
    return (
      <section className="rounded-2xl border border-[#E8E4DE] bg-white">
        <EmptyState
          title="No tienes reservaciones todavia"
          description="Cuando realices una reservacion, aparecera aqui para que puedas darle seguimiento."
        />
      </section>
    )
  }

  return (
    <section className="grid gap-4">
      {reservations.map((reservation) => (
        <ReservationCard key={reservation.id} reservation={reservation} />
      ))}
    </section>
  )
}

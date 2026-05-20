import PageContainer from '@/components/layout/PageContainer'
import ManagerReservationsTable from '@/components/manager/ManagerReservationsTable'
import { managerReservationsMock } from '@/features/reservations/data/manager-reservations'

export default function ManagerReservationsPage() {
  return (
    <PageContainer className="space-y-8">
      <section className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1A3A2A]">
          Manager
        </p>
        <h1 className="text-3xl font-bold text-[#1C1C1C] sm:text-4xl">
          Reservaciones
        </h1>
        <p className="max-w-2xl leading-7 text-[#6B6B6B]">
          Gestiona el estado de las reservaciones del dia en formato de tabla
          tipo admin panel.
        </p>
      </section>

      <ManagerReservationsTable reservations={managerReservationsMock} />
    </PageContainer>
  )
}

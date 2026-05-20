import PageContainer from '@/components/layout/PageContainer'
import ReservationsHeader from '@/components/reservation/ReservationsHeader'
import ReservationsList from '@/components/reservation/ReservationsList'
import { mockReservations } from '@/features/reservations/data/reservations'

export default function ReservationsPage() {
  return (
    <PageContainer className="space-y-8">
      <ReservationsHeader total={mockReservations.length} />
      <ReservationsList reservations={mockReservations} />
    </PageContainer>
  )
}

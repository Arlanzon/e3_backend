import ProtectedRoute from '@/components/auth/ProtectedRoute'
import PageContainer from '@/components/layout/PageContainer'
import ManagerStatCard from '@/components/manager/ManagerStatCard'
import { buildManagerKpis } from '@/features/reservations/data/manager-kpis'
import {
  getManagedRestaurants,
  managerReservationsMock,
} from '@/features/reservations/data/manager-reservations'

const kpis = buildManagerKpis(managerReservationsMock)
const managedRestaurants = getManagedRestaurants(managerReservationsMock)
const activeRestaurants = managedRestaurants.filter(
  (restaurant) => restaurant.status === 'Activo'
).length
const averageRating = 4.7

const stats = [
  { label: 'Total de reservaciones', value: kpis.total },
  { label: 'Pendientes', value: kpis.pending },
  { label: 'Confirmadas', value: kpis.confirmed },
  { label: 'Rechazadas', value: kpis.rejected },
  { label: 'Completadas', value: kpis.completed },
  { label: 'Canceladas', value: kpis.cancelled },
  { label: 'Restaurantes activos', value: activeRestaurants },
  { label: 'Calificacion promedio', value: averageRating.toFixed(1) },
]

export default function ManagerDashboardPage() {
  return (
    <ProtectedRoute requiredRole="MANAGER">
      <PageContainer className="space-y-8">
      <section className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1A3A2A]">
          Manager
        </p>
        <h1 className="text-3xl font-bold text-[#1C1C1C] sm:text-4xl">
          Panel de control
        </h1>
        <p className="max-w-2xl leading-7 text-[#6B6B6B]">
          Resumen general de reservaciones para monitoreo operativo del panel
          manager.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <ManagerStatCard key={item.label} label={item.label} value={item.value} />
        ))}
      </section>
      </PageContainer>
    </ProtectedRoute>
  )
}

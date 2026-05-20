import PageContainer from '@/components/layout/PageContainer'
import ManagerRestaurantCard from '@/components/manager/ManagerRestaurantCard'
import {
  getManagedRestaurants,
  managerReservationsMock,
} from '@/features/reservations/data/manager-reservations'

const managedRestaurants = getManagedRestaurants(managerReservationsMock)

export default function ManagerRestaurantsPage() {
  return (
    <PageContainer className="space-y-8">
      <section className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1A3A2A]">
          Manager
        </p>
        <h1 className="text-3xl font-bold text-[#1C1C1C] sm:text-4xl">
          Restaurantes
        </h1>
        <p className="max-w-2xl leading-7 text-[#6B6B6B]">
          Consulta los restaurantes administrados, su disponibilidad general y
          capacidad operativa.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {managedRestaurants.map((restaurant) => (
          <ManagerRestaurantCard key={restaurant.name} restaurant={restaurant} />
        ))}
      </section>
    </PageContainer>
  )
}

import type { ManagedRestaurant } from '@/features/reservations/data/manager-reservations'

type ManagerRestaurantCardProps = {
  restaurant: ManagedRestaurant
}

export default function ManagerRestaurantCard({
  restaurant,
}: ManagerRestaurantCardProps) {
  const statusClassName =
    restaurant.status === 'Activo'
      ? 'bg-green-100 text-green-800'
      : 'bg-gray-100 text-gray-700'

  return (
    <article className="rounded-2xl border border-[#E8E4DE] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold text-[#1A3A2A]">{restaurant.name}</h3>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClassName}`}
        >
          {restaurant.status}
        </span>
      </div>

      <dl className="mt-4 space-y-2 text-sm text-[#6B6B6B]">
        <div className="flex justify-between gap-4">
          <dt>Horario</dt>
          <dd className="font-medium text-[#1C1C1C]">{restaurant.schedule}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>Capacidad</dt>
          <dd className="font-medium text-[#1C1C1C]">{restaurant.capacity}</dd>
        </div>
      </dl>
    </article>
  )
}

import type { Restaurant } from '../types'

type RestaurantCardProps = {
  restaurant: Restaurant
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <article className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-zinc-950">{restaurant.name}</h2>
          <p className="mt-1 text-sm text-zinc-600">{restaurant.category}</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
          {restaurant.rating.toFixed(1)}
        </span>
      </div>

      <p className="mt-4 text-sm text-zinc-700">{restaurant.description}</p>

      <div className="mt-5 flex items-center justify-between text-sm text-zinc-500">
        <span>{restaurant.location}</span>
        <span>{restaurant.priceRange}</span>
      </div>
    </article>
  )
}

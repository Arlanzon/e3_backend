import Link from 'next/link'

export type RestaurantCardProps = {
  id: string
  name: string
  cuisine: string
  neighborhood: string
  description: string
  rating: number
  priceRange: string
  featured?: boolean
}

export default function RestaurantCard({
  id,
  name,
  cuisine,
  neighborhood,
  description,
  rating,
  priceRange,
  featured = false,
}: RestaurantCardProps) {
  return (
    <article className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="relative h-44 bg-[linear-gradient(135deg,#0f766e,#f59e0b)]">
        <div className="absolute inset-0 bg-black/10" />
        {featured ? (
          <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-800">
            Destacado
          </span>
        ) : null}
      </div>

      <div className="space-y-4 p-5">
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-semibold text-stone-950">{name}</h3>
            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
              {rating.toFixed(1)}
            </span>
          </div>
          <p className="text-sm font-medium text-emerald-700">
            {cuisine} · {priceRange}
          </p>
          <p className="text-sm text-stone-500">{neighborhood}</p>
        </div>

        <p className="line-clamp-3 text-sm leading-6 text-stone-600">
          {description}
        </p>

        <Link
          href={`/restaurants/${id}`}
          className="inline-flex rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-800 transition hover:border-emerald-700 hover:text-emerald-800"
        >
          Ver detalle
        </Link>
      </div>
    </article>
  )
}

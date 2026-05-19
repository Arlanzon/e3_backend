import Image from 'next/image'
import Link from 'next/link'

export type RestaurantCardProps = {
  id: string
  name: string
  cuisine: string
  neighborhood: string
  description: string
  rating: number
  priceRange: string
  imageUrl?: string
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
  imageUrl = '/images/restaurants/fallback-restaurant.png',
  featured = false,
}: RestaurantCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#E8E4DE] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="relative h-44 overflow-hidden bg-zinc-100">
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-[#1A3A2A]/20" />
        {featured ? (
          <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#1A3A2A]">
            Destacado
          </span>
        ) : null}
        <div className="absolute bottom-4 left-4 right-4">
          <span className="w-fit rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#1A3A2A]">
            {priceRange}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-semibold leading-6 text-[#1A3A2A]">
              {name}
            </h3>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#C4622D]">
              {cuisine}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-[#FAFAF7] px-3 py-1 text-sm font-medium text-[#C4622D]">
            ★ {rating.toFixed(1)}
          </span>
        </div>

        <p className="mt-4 line-clamp-3 flex-1 text-sm leading-6 text-[#6B6B6B]">
          {description}
        </p>

        <div className="mt-5 flex items-center justify-between gap-4 text-sm text-[#6B6B6B]">
          <span className="min-w-0 truncate">{neighborhood}</span>
          <Link
            href={`/restaurants/${id}`}
            className="shrink-0 rounded-xl bg-[#1A3A2A] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2D5A3D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A3A2A]"
          >
            Ver detalle
          </Link>
        </div>
      </div>
    </article>
  )
}

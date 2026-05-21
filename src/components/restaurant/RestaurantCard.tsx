import Image from 'next/image'
import Link from 'next/link'

interface RestaurantCardProps {
  id: string
  name: string
  cuisineType: string
  address: string
  ratingAvg: number | null
  ratingCount: number
  photoUrl?: string
  featured?: boolean
}

const fallbackPhotoUrl = '/images/restaurants/fallback-restaurant.png'

export default function RestaurantCard({
  id,
  name,
  cuisineType,
  address,
  ratingAvg,
  ratingCount,
  photoUrl,
  featured = false,
}: RestaurantCardProps) {
  return (
    <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[#E8E4DE] bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#FAFAF7] sm:aspect-[16/11]">
        <Image
          src={photoUrl ?? fallbackPhotoUrl}
          alt={name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
        {featured ? (
          <span className="absolute left-3 top-3 rounded-full bg-[#C4622D] px-2 py-1 text-xs text-white">
            Destacado
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs uppercase tracking-wide text-[#C4622D]">
          {cuisineType}
        </p>
        <h3 className="mt-1 line-clamp-2 text-base font-semibold text-[#1A3A2A]">
          {name}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-[#6B6B6B]">
          <span aria-hidden="true">📍</span> {address}
        </p>

        <div className="mt-3">
          {ratingAvg !== null ? (
            <p className="text-sm text-[#6B6B6B]">
              <span className="font-semibold text-[#C4622D]">★</span>{' '}
              <span className="font-medium text-[#1C1C1C]">
                {ratingAvg.toFixed(1)}
              </span>{' '}
              ({ratingCount} reseñas)
            </p>
          ) : (
            <p className="text-xs text-[#6B6B6B]">Sin reseñas aún</p>
          )}
        </div>

        <Link
          href={`/restaurants/${id}`}
          className="mt-auto block w-full rounded-xl bg-[#1A3A2A] py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-[#2D5A3D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A3A2A]"
        >
          Ver detalle
        </Link>
      </div>
    </article>
  )
}

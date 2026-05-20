import Image from 'next/image'
import Link from 'next/link'
import type { RestaurantDetail } from '@/data/restaurant-details'

const fallbackImage = '/images/fallback-restaurant.png'

type RestaurantCardProps = {
  restaurant: RestaurantDetail
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const id = restaurant.id
  const imageUrl = restaurant.imageUrl ?? fallbackImage

  return (
    <article className="restaurant-card">
      <div className="restaurant-card-image-wrap">
        <Image
          alt={restaurant.name}
          className="restaurant-card-image"
          src={imageUrl}
          width={720}
          height={480}
        />

        {restaurant.featured && (
          <span className="restaurant-card-badge">Destacado</span>
        )}
      </div>

      <div className="restaurant-card-content">
        <div className="restaurant-card-heading">
          <div>
            <p>{restaurant.category}</p>
            <h3>{restaurant.name}</h3>
          </div>

          <strong>{restaurant.rating}</strong>
        </div>

        <p className="restaurant-card-description">{restaurant.description}</p>

        <div className="restaurant-card-meta">
          <span>{restaurant.location}</span>
          <span>{restaurant.price}</span>
          <span>{restaurant.distance}</span>
        </div>

        <Link className="restaurant-card-action" href={`/restaurants/${id}`}>
          Ver detalle
        </Link>
      </div>
    </article>
  )
}

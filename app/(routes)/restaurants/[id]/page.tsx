import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import '../../../global_css/restaurant-detail.css'
import {
  getRestaurantBySlug,
  restaurantDetails,
} from '@/data/restaurant-details'

const fallbackImage = '/images/fallback-restaurant.png'

type RestaurantDetailPageProps = {
  params: Promise<{
    id: string
  }>
}

export function generateStaticParams() {
  return restaurantDetails.map((restaurant) => ({
    id: restaurant.id,
  }))
}

export default async function RestaurantDetailPage({
  params,
}: RestaurantDetailPageProps) {
  const { id } = await params
  const restaurant = getRestaurantBySlug(id)

  if (!restaurant) {
    notFound()
  }

  const imageUrl = restaurant.imageUrl ?? fallbackImage

  return (
    <main className="restaurant-detail-page">
      <header className="restaurant-detail-header">
        <Link href="/restaurants">Volver a restaurantes</Link>
        <Link href="/">Inicio</Link>
      </header>

      <section className="restaurant-detail-hero">
        <div className="restaurant-detail-copy">
          <p>{restaurant.category}</p>
          <h1>{restaurant.name}</h1>
          <span>{restaurant.longDescription}</span>

          <div className="restaurant-detail-stats">
            <strong>{restaurant.rating} rating</strong>
            <strong>{restaurant.price}</strong>
            <strong>{restaurant.distance}</strong>
          </div>

          <Link className="restaurant-detail-reserve" href="/reservations/new">
            Reservar
          </Link>
        </div>

        <Image
          className="restaurant-detail-image"
          src={imageUrl}
          alt={restaurant.name}
          width={960}
          height={640}
          priority
        />
      </section>

      <section className="restaurant-detail-layout">
        <div className="restaurant-detail-info">
          <article className="detail-panel">
            <h2>Informacion</h2>
            <dl className="detail-list">
              <div>
                <dt>Zona</dt>
                <dd>{restaurant.location}</dd>
              </div>
              <div>
                <dt>Direccion</dt>
                <dd>{restaurant.address}</dd>
              </div>
              <div>
                <dt>Telefono</dt>
                <dd>{restaurant.phone}</dd>
              </div>
              <div>
                <dt>Precio</dt>
                <dd>{restaurant.price}</dd>
              </div>
            </dl>
          </article>

          <article className="detail-panel">
            <h2>Horarios</h2>
            <div className="hours-list">
              {restaurant.hours.map((hour) => (
                <div key={hour.day}>
                  <span>{hour.day}</span>
                  <strong>{hour.time}</strong>
                </div>
              ))}
            </div>
          </article>

          <article className="detail-panel">
            <h2>Etiquetas y servicios</h2>
            <div className="specialties-list">
              {[...restaurant.specialties, ...restaurant.services].map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </article>

          <article className="detail-panel">
            <h2>Resenas</h2>
            <div className="reviews-list">
              {restaurant.reviews.map((review) => (
                <div className="review-item" key={review.author}>
                  <div>
                    <strong>{review.author}</strong>
                    <span>{review.rating}</span>
                  </div>
                  <p>{review.comment}</p>
                </div>
              ))}
            </div>
          </article>
        </div>

        <aside className="reservation-panel">
          <span>Reserva de mesa</span>
          <h2>Planea tu visita</h2>
          <p>
            La reserva es solo visual por ahora. El flujo real puede conectarse
            despues.
          </p>
          <Link href="/reservations/new">Reservar</Link>
        </aside>
      </section>
    </main>
  )
}

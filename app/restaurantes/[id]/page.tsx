import { notFound } from 'next/navigation'
import '../../global_css/restaurant-detail.css'
import {
  getRestaurantBySlug,
  restaurantDetails,
} from '../../../frontend/data/restaurant-details'

type RestaurantDetailPageProps = {
  params: Promise<{
    id: string
  }>
}

export function generateStaticParams() {
  return restaurantDetails.map((restaurant) => ({
    id: restaurant.slug,
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

  return (
    <main className="restaurant-detail-page">
      <header className="restaurant-detail-header">
        <a href="/restaurantes">Volver a restaurantes</a>
        <a href="/">Inicio</a>
      </header>

      <section className="restaurant-detail-hero">
        <div className="restaurant-detail-copy">
          <p>{restaurant.category}</p>
          <h1>{restaurant.name}</h1>
          <span>{restaurant.longDescription}</span>

          <div className="restaurant-detail-stats">
            <strong>{restaurant.rating}</strong>
            <strong>{restaurant.distance}</strong>
            <strong>{restaurant.price}</strong>
          </div>
        </div>

        <img
          className="restaurant-detail-image"
          src="/images/mejores-restaurantes-oaxaca-pitiona.jpg"
          alt={restaurant.name}
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
            <h2>Especialidades</h2>
            <div className="specialties-list">
              {restaurant.specialties.map((specialty) => (
                <span key={specialty}>{specialty}</span>
              ))}
            </div>
          </article>
        </div>

        <aside className="reservation-panel">
          <span>Reserva de mesa</span>
          <h2>Planea tu visita</h2>
          <form>
            <label>
              Fecha
              <input type="date" />
            </label>

            <label>
              Hora
              <input type="time" />
            </label>

            <label>
              Personas
              <select defaultValue="2">
                <option value="1">1 persona</option>
                <option value="2">2 personas</option>
                <option value="3">3 personas</option>
                <option value="4">4 personas</option>
                <option value="5">5 personas</option>
                <option value="6">6 personas</option>
              </select>
            </label>

            <label>
              Nombre
              <input placeholder="Tu nombre" type="text" />
            </label>

            <label>
              Telefono
              <input placeholder="951 000 0000" type="tel" />
            </label>

            <button type="submit">Solicitar reservacion</button>
          </form>
        </aside>
      </section>
    </main>
  )
}

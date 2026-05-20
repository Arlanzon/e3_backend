import '../../global_css/restaurantes.css'
import { RestaurantCard } from '@/components/restaurant/RestaurantCard'
import { restaurantDetails } from '@/data/restaurant-details'

const filters = [
  'Todos',
  'Comida tradicional',
  'Cafeterias',
  'Antojitos',
  'Mejor calificados',
  'Economico',
]

const restaurants = restaurantDetails

export default function RestaurantsPage() {
  return (
    <main className="restaurants-page">
      <header className="restaurants-header">
        <a className="restaurants-logo" href="/">
          Oaxaca Centro
        </a>
        <nav className="restaurants-nav">
          <a href="/">Inicio</a>
          <a href="/login">Iniciar sesion</a>
        </nav>
      </header>

      <section className="restaurants-toolbar">
        <div>
          <span>Directorio local</span>
          <h1>Restaurantes para elegir hoy</h1>
          <p>
            Explora mesas cercanas por cocina, zona, precio y calificacion.
          </p>
        </div>

        <label className="restaurants-search">
          <span>Buscar</span>
          <input placeholder="Nombre, zona o tipo de comida" type="search" />
        </label>
      </section>

      <section className="restaurants-filter-strip" aria-label="Filtros">
        {filters.map((filter) => (
          <button key={filter} type="button">
            {filter}
          </button>
        ))}
      </section>

      <section className="restaurants-layout">
        <aside className="restaurants-sidebar">
          <h2>Resumen</h2>

          <div className="restaurants-summary">
            <span>Zona actual</span>
            <strong>Centro historico</strong>
            <p>{restaurants.length} lugares encontrados con datos mock.</p>
          </div>

          <div className="restaurants-sidebar-note">
            <span>Orden visual</span>
            <strong>Mejor balance entre rating, precio y cercania.</strong>
          </div>
        </aside>

        <section className="restaurants-results">
          <div className="restaurants-results-heading">
            <div>
              <span>Mocks existentes</span>
              <h2>Opciones destacadas</h2>
            </div>
            <p>{restaurants.length} resultados</p>
          </div>

          <div className="restaurants-grid">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        </section>
      </section>
    </main>
  )
}

import '../global_css/restaurantes.css'
import { restaurantDetails } from '../../frontend/data/restaurant-details'

const filters = ['Todos', 'Abierto ahora', 'Cerca de mi', 'Mejor calificados']

const restaurants = restaurantDetails

export default function RestaurantesPage() {
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
          <h1>Restaurantes cercanos</h1>
        </div>
        <div className="restaurants-search">
          <input placeholder="Buscar por nombre, zona o comida" type="search" />
        </div>
      </section>

      <section className="restaurants-layout">
        <aside className="restaurants-sidebar">
          <h2>Filtros</h2>
          <div className="restaurants-filter-group">
            {filters.map((filter) => (
              <button key={filter} type="button">
                {filter}
              </button>
            ))}
          </div>

          <div className="restaurants-summary">
            <span>Zona actual</span>
            <strong>Centro historico</strong>
            <p>{restaurants.length} lugares encontrados cerca de ti.</p>
          </div>
        </aside>

        <section className="restaurants-results">
          <div className="restaurants-results-heading">
            <div>
              <span>Ordenados por calificacion</span>
              <h2>Opciones para visitar</h2>
            </div>
            <p>{restaurants.length} resultados</p>
          </div>

          <div className="restaurants-list">
            {restaurants.map((restaurant) => (
              <a
                className="restaurant-row"
                href={`/restaurantes/${restaurant.slug}`}
                key={restaurant.name}
              >
                <div className="restaurant-row-image" />
                <div className="restaurant-row-content">
                  <div className="restaurant-row-top">
                    <div>
                      <h3>{restaurant.name}</h3>
                      <p>{restaurant.category}</p>
                    </div>
                    <span>{restaurant.rating}</span>
                  </div>
                  <p className="restaurant-row-description">
                    {restaurant.description}
                  </p>
                  <div className="restaurant-row-meta">
                    <span>{restaurant.location}</span>
                    <span>{restaurant.distance}</span>
                    <span>{restaurant.price}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        <aside className="restaurants-map">
          <div className="map-pin pin-one">1</div>
          <div className="map-pin pin-two">2</div>
          <div className="map-pin pin-three">3</div>
          <div className="map-label">
            <span>Vista de zona</span>
            <strong>Centro y alrededores</strong>
          </div>
        </aside>
      </section>
    </main>
  )
}

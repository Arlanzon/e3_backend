'use client'

import './global_css/main.css'
import { restaurantDetails } from '../frontend/data/restaurant-details'
import { useEffect, useState } from 'react'

const categories = [
  'Tacos',
  'Pizza',
  'Sushi',
  'Cafe',
  'Postres',
  'Oaxaqueña',
]

const restaurants =
  restaurantDetails.slice(0, 3)

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] =
    useState(false)

  useEffect(() => {
    const logged =
      localStorage.getItem(
        'isLoggedIn'
      )

    if (logged === 'true') {
      setIsLoggedIn(true)
    }
  }, [])

  const cerrarSesion = () => {
    localStorage.removeItem(
      'isLoggedIn'
    )

    window.location.reload()
  }

  return (
    <main className="main-page">
      <header className="main-header">
        <div>
          <h1 className="main-location">
            Oaxaca Centro
          </h1>
        </div>

        <nav className="main-nav">
          <a href="/restaurantes">
            Restaurantes
          </a>

          {isLoggedIn && (
            <a href="/mis-reservaciones">
              Mis reservaciones
            </a>
          )}

          {!isLoggedIn ? (
            <>
              <a href="/registrarse">
                Registrarse
              </a>

              <a href="/login">
                Iniciar sesion
              </a>
            </>
          ) : (
            <button
              onClick={cerrarSesion}
              style={{
                border: 'none',
                background:
                  'transparent',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              Cerrar sesion
            </button>
          )}
        </nav>
      </header>

      <section className="hero-section">
        <div className="hero-content">
          <p className="hero-kicker">
            Restaurantes cerca de ti
          </p>

          <h2>
            Descubre restaurantes cerca
            de tu ubicacion
          </h2>

          <p>
            Explora restaurantes en
            Oaxaca, revisa zonas,
            calificaciones y encuentra
            nuevos lugares para visitar.
          </p>

          <div className="search-box">
            <input
              placeholder="Buscar restaurante"
              type="search"
            />
          </div>
        </div>

        <img
          className="hero-image"
          src="/images/mejores-restaurantes-oaxaca-pitiona.jpg"
          alt="Restaurante en Oaxaca"
        />
      </section>

      <section className="categories-section">
        {categories.map((category) => (
          <button
            className="category-chip"
            key={category}
            type="button"
          >
            {category}
          </button>
        ))}
      </section>

      <section className="restaurants-section">
        <div className="section-heading">
          <div>
            <span>
              Populares cerca de ti
            </span>

            <h2>
              Restaurantes destacados
            </h2>
          </div>

          <a href="/restaurantes">
            Ver todos
          </a>
        </div>

        <div className="restaurant-grid">
          {restaurants.map(
            (restaurant) => (
              <a
                className="restaurant-card"
                href={`/restaurantes/${restaurant.slug}`}
                key={
                  restaurant.name
                }
              >
                <div className="restaurant-cover" />

                <div className="restaurant-info">
                  <div>
                    <h3>
                      {restaurant.name}
                    </h3>

                    <p>
                      {
                        restaurant.category
                      }
                    </p>
                  </div>

                  <span className="rating">
                    {
                      restaurant.rating
                    }
                  </span>
                </div>

                <div className="restaurant-meta">
                  <span>
                    {
                      restaurant.location
                    }
                  </span>

                  <span>
                    {
                      restaurant.distance
                    }
                  </span>
                </div>
              </a>
            )
          )}
        </div>
      </section>
    </main>
  )
}
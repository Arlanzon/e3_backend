'use client'

import '../../global_css/registrase.css'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()

  const handleRegister = (
    e: React.FormEvent
  ) => {
    e.preventDefault()

    // Simula registro e inicio de sesión
    localStorage.setItem(
      'isLoggedIn',
      'true'
    )

    router.push('/')
  }

  return (
    <main className="register-page">
      <section className="register-shell">
        <div className="register-visual">
          <img
            className="register-image"
            src="/images/mejores-restaurantes-oaxaca-pitiona.jpg"
            alt="Restaurante Oaxaca"
          />

          <div className="register-visual-card">
            <span>Oaxaca Centro</span>

            <strong>
              Crea tu cuenta y descubre
              nuevos lugares
            </strong>
          </div>
        </div>

        <form
          className="register-form"
          onSubmit={handleRegister}
        >
          <a
            className="register-back"
            href="/"
          >
            Volver al inicio
          </a>

          <p className="register-eyebrow">
            Crear cuenta
          </p>

          <h1 className="register-title">
            Registrarse
          </h1>

          <p className="register-copy">
            Guarda reservaciones y explora
            restaurantes en Oaxaca.
          </p>

          <label className="register-field">
            <span>Nombre</span>

            <input
              className="register-input"
              placeholder="Tu nombre"
              type="text"
            />
          </label>

          <label className="register-field">
            <span>Correo</span>

            <input
              className="register-input"
              placeholder="correo@ejemplo.com"
              type="email"
            />
          </label>

          <label className="register-field">
            <span>Contrasena</span>

            <input
              className="register-input"
              placeholder="Tu contrasena"
              type="password"
            />
          </label>

          <button
            className="register-button"
            type="submit"
          >
            Crear cuenta
          </button>

          <p className="register-login">
            Ya tienes cuenta?{' '}
            <a href="/login">
              Iniciar sesion
            </a>
          </p>
        </form>
      </section>
    </main>
  )
}

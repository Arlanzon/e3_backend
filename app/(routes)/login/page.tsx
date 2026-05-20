'use client'

import '../../global_css/login.css'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  const handleLogin = (
    e: React.FormEvent
  ) => {
    e.preventDefault()

    localStorage.setItem(
      'isLoggedIn',
      'true'
    )

    router.push('/')
  }

  return (
    <main className="login-page">
      <section className="login-shell">
        <div className="login-visual">
          <img
            className="login-image"
            src="/images/mejores-restaurantes-oaxaca-pitiona.jpg"
            alt="Restaurante"
          />

          <div className="login-visual-card">
            <span>Oaxaca Centro</span>

            <strong>
              Encuentra restaurantes cerca
              de ti
            </strong>
          </div>
        </div>

        <form
          className="login-form"
          onSubmit={handleLogin}
        >
          <a
            className="login-back"
            href="/"
          >
            Volver al inicio
          </a>

          <p className="login-eyebrow">
            Acceso a tu cuenta
          </p>

          <h1 className="login-title">
            Iniciar sesion
          </h1>

          <p className="login-copy">
            Guarda tus restaurantes favoritos
            y consulta reservaciones.
          </p>

          <label className="login-field">
            <span className="login-label">
              Correo
            </span>

            <input
              className="login-input"
              type="email"
              placeholder="correo@ejemplo.com"
            />
          </label>

          <label className="login-field">
            <span className="login-label">
              Contrasena
            </span>

            <input
              className="login-input"
              type="password"
              placeholder="Tu contrasena"
            />
          </label>

          <button
            className="login-button"
            type="submit"
          >
            Entrar
          </button>

          <p className="login-register">
            No tienes cuenta?{' '}
            <a href="/registrarse">
              Registrarse
            </a>
          </p>
        </form>
      </section>
    </main>
  )
}

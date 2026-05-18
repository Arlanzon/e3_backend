export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-4 py-12">
      <section className="rounded-lg border border-stone-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
          Acceso
        </p>
        <h1 className="mt-3 text-3xl font-bold text-stone-950">Login</h1>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          Pantalla base para iniciar sesion. La autenticacion real se conectara
          mas adelante.
        </p>
      </section>
    </main>
  )
}

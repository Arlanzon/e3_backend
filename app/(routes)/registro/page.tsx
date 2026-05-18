export default function RegistroPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-4 py-12">
      <section className="rounded-lg border border-stone-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
          Cuenta
        </p>
        <h1 className="mt-3 text-3xl font-bold text-stone-950">Registro</h1>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          Pantalla base para crear una cuenta. Por ahora funciona como maqueta
          visual sin conexion al backend.
        </p>
      </section>
    </main>
  )
}

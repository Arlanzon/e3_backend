type ReservationsHeaderProps = {
  total: number
}

export default function ReservationsHeader({ total }: ReservationsHeaderProps) {
  return (
    <section className="space-y-4">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1A3A2A]">
        Reservaciones
      </p>
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h1 className="text-3xl font-bold text-[#1C1C1C] sm:text-4xl">
            Mis reservaciones
          </h1>
          <p className="mt-3 max-w-2xl leading-7 text-[#6B6B6B]">
            Consulta tus reservas actuales y revisa su estado antes de tu
            visita.
          </p>
        </div>
        <div className="w-fit rounded-full border border-[#E8E4DE] bg-white px-4 py-2 text-sm text-[#6B6B6B]">
          {total} reservaciones
        </div>
      </div>
    </section>
  )
}

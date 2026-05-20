import "../../global_css/mis-reservaciones.css";

export default function MisReservacionesPage() {
  const reservaciones = [
    {
      id: "#R001",
      restaurante: "Cafe Santo Domingo",
      fecha: "20 Mayo 2026",
      hora: "7:00 PM",
      personas: 2,
      estado: "Confirmada",
    },
    {
      id: "#R002",
      restaurante: "Casa Oaxaca",
      fecha: "22 Mayo 2026",
      hora: "2:00 PM",
      personas: 4,
      estado: "Pendiente",
    },
    {
      id: "#R003",
      restaurante: "Origen Oaxaca",
      fecha: "25 Mayo 2026",
      hora: "8:30 PM",
      personas: 3,
      estado: "Finalizada",
    },
  ];

  return (
    <main className="reservaciones-page">
      <div className="reservaciones-container">

        {/* Volver */}
        <a className="volver-inicio" href="/">
          ← Volver al inicio
        </a>

        {/* Header */}
        <section className="reservaciones-header">
          <div>
            <p>MIS RESERVACIONES</p>
            <h1>Gestiona tus visitas</h1>
            <span>
              Consulta tus reservaciones activas y pasadas.
            </span>
          </div>
        </section>

        {/* Lista */}
        <section className="reservaciones-grid">
          {reservaciones.map((reserva) => (
            <article
              key={reserva.id}
              className="reservacion-card"
            >
              <div className="card-header">
                <div>
                  <p className="categoria">
                    RESERVACIÓN
                  </p>

                  <h2>{reserva.restaurante}</h2>
                </div>

                <span
                  className={`estado ${reserva.estado.toLowerCase()}`}
                >
                  {reserva.estado}
                </span>
              </div>

              <div className="card-info">
                <div>
                  <strong>Fecha</strong>
                  <span>{reserva.fecha}</span>
                </div>

                <div>
                  <strong>Hora</strong>
                  <span>{reserva.hora}</span>
                </div>

                <div>
                  <strong>Personas</strong>
                  <span>{reserva.personas}</span>
                </div>

                <div>
                  <strong>Folio</strong>
                  <span>{reserva.id}</span>
                </div>
              </div>

              <button className="detalle-btn">
                Ver detalles
              </button>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}

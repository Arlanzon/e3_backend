'use client'

import { useState } from 'react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import type { ManagerReservation } from '@/features/reservations/data/manager-reservations'
import { STATUS_COLORS, STATUS_LABELS } from '@/features/reservations/types'

type ManagerReservationsTableProps = {
  reservations: ManagerReservation[]
}

export default function ManagerReservationsTable({
  reservations,
}: ManagerReservationsTableProps) {
  const [rows, setRows] = useState<ManagerReservation[]>(reservations)

  function updateStatus(id: string, nextStatus: 'CONFIRMED' | 'REJECTED') {
    setRows((currentRows) =>
      currentRows.map((row) =>
        row.id === id ? { ...row, status: nextStatus } : row
      )
    )
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-[#E8E4DE] bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-[#FAFAF7]">
            <tr className="border-b border-[#E8E4DE] text-xs uppercase tracking-[0.08em] text-[#6B6B6B]">
              <th className="px-4 py-3 font-semibold">Cliente</th>
              <th className="px-4 py-3 font-semibold">Restaurante</th>
              <th className="px-4 py-3 font-semibold">Fecha</th>
              <th className="px-4 py-3 font-semibold">Hora</th>
              <th className="px-4 py-3 font-semibold">Personas</th>
              <th className="px-4 py-3 font-semibold">Estado</th>
              <th className="px-4 py-3 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((reservation) => (
              <tr key={reservation.id} className="border-b border-[#F2EFE9]">
                <td className="px-4 py-4 text-sm text-[#1C1C1C]">
                  {reservation.customerName}
                </td>
                <td className="px-4 py-4 text-sm text-[#1C1C1C]">
                  {reservation.restaurantName}
                </td>
                <td className="px-4 py-4 text-sm text-[#6B6B6B]">
                  {reservation.date}
                </td>
                <td className="px-4 py-4 text-sm text-[#6B6B6B]">
                  {reservation.time}
                </td>
                <td className="px-4 py-4 text-sm text-[#6B6B6B]">
                  {reservation.people}
                </td>
                <td className="px-4 py-4">
                  <Badge
                    label={STATUS_LABELS[reservation.status]}
                    className={STATUS_COLORS[reservation.status]}
                  />
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => updateStatus(reservation.id, 'CONFIRMED')}
                    >
                      Confirmar
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(reservation.id, 'REJECTED')}
                    >
                      Rechazar
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

import type { ManagerReservation } from './manager-reservations'

export type ManagerKpis = {
  total: number
  pending: number
  confirmed: number
  rejected: number
  completed: number
  cancelled: number
}

export function buildManagerKpis(
  reservations: ManagerReservation[]
): ManagerKpis {
  return reservations.reduce(
    (acc, reservation) => {
      acc.total += 1

      if (reservation.status === 'PENDING') acc.pending += 1
      if (reservation.status === 'CONFIRMED') acc.confirmed += 1
      if (reservation.status === 'REJECTED') acc.rejected += 1
      if (reservation.status === 'COMPLETED') acc.completed += 1
      if (reservation.status === 'CANCELLED') acc.cancelled += 1

      return acc
    },
    {
      total: 0,
      pending: 0,
      confirmed: 0,
      rejected: 0,
      completed: 0,
      cancelled: 0,
    } satisfies ManagerKpis
  )
}

export type ReservationStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'COMPLETED'
  | 'EXPIRED'

export const STATUS_LABELS: Record<ReservationStatus, string> = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmada',
  REJECTED: 'Rechazada',
  CANCELLED: 'Cancelada',
  COMPLETED: 'Completada',
  EXPIRED: 'Expirada',
}

export const STATUS_COLORS: Record<ReservationStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-gray-100 text-gray-600',
  COMPLETED: 'bg-blue-100 text-blue-800',
  EXPIRED: 'bg-orange-100 text-orange-800',
}

export interface Reservation {
  id: string
  restaurantId: string
  restaurantName: string
  restaurantCuisine: string
  date: string
  time: string
  numPersons: number
  status: ReservationStatus
  notes: string | null
  rejectionReason: string | null
  confirmedAt: string | null
  cancelledAt: string | null
  completedAt: string | null
  expiredAt: string | null
  rejectedAt: string | null
  createdAt: string
}

export interface CreateReservationInput {
  restaurantId: string
  date: string
  time: string
  numPersons: number
  notes?: string
}

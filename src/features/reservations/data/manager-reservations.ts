import type { ReservationStatus } from '@/features/reservations/types'

export type ManagerReservation = {
  id: string
  customerName: string
  restaurantName: string
  date: string
  time: string
  people: number
  status: ReservationStatus
  restaurantStatus: 'Activo' | 'Pausado'
  restaurantSchedule: string
  restaurantCapacity: number
}

export const managerReservationsMock: ManagerReservation[] = [
  {
    id: 'mgr-res-0001',
    customerName: 'Sofia Martinez',
    restaurantName: 'El Fogon de la Abuela',
    date: '2026-05-20',
    time: '19:00',
    people: 4,
    status: 'PENDING',
    restaurantStatus: 'Activo',
    restaurantSchedule: '08:00 - 22:00',
    restaurantCapacity: 48,
  },
  {
    id: 'mgr-res-0002',
    customerName: 'Diego Ramos',
    restaurantName: 'Cafe Nube de Cacao',
    date: '2026-05-20',
    time: '10:30',
    people: 2,
    status: 'CONFIRMED',
    restaurantStatus: 'Activo',
    restaurantSchedule: '07:00 - 19:00',
    restaurantCapacity: 32,
  },
  {
    id: 'mgr-res-0003',
    customerName: 'Ana Torres',
    restaurantName: 'Tlayudas La Calenda',
    date: '2026-05-21',
    time: '14:00',
    people: 3,
    status: 'REJECTED',
    restaurantStatus: 'Activo',
    restaurantSchedule: '12:00 - 23:00',
    restaurantCapacity: 40,
  },
  {
    id: 'mgr-res-0004',
    customerName: 'Carlos Jimenez',
    restaurantName: 'Mezcaleria El Chapulin',
    date: '2026-05-21',
    time: '20:00',
    people: 5,
    status: 'COMPLETED',
    restaurantStatus: 'Activo',
    restaurantSchedule: '16:00 - 01:00',
    restaurantCapacity: 55,
  },
  {
    id: 'mgr-res-0005',
    customerName: 'Lucia Hernandez',
    restaurantName: 'Fonda Las Bugambilias',
    date: '2026-05-22',
    time: '13:00',
    people: 2,
    status: 'CANCELLED',
    restaurantStatus: 'Pausado',
    restaurantSchedule: '09:00 - 18:00',
    restaurantCapacity: 28,
  },
  {
    id: 'mgr-res-0006',
    customerName: 'Miguel Cruz',
    restaurantName: 'Asador Tierra del Sol',
    date: '2026-05-22',
    time: '21:00',
    people: 6,
    status: 'PENDING',
    restaurantStatus: 'Activo',
    restaurantSchedule: '13:00 - 00:00',
    restaurantCapacity: 60,
  },
]

export type ManagedRestaurant = {
  name: string
  status: 'Activo' | 'Pausado'
  schedule: string
  capacity: number
}

export function getManagedRestaurants(
  reservations: ManagerReservation[]
): ManagedRestaurant[] {
  const map = new Map<string, ManagedRestaurant>()

  reservations.forEach((reservation) => {
    if (map.has(reservation.restaurantName)) {
      return
    }

    map.set(reservation.restaurantName, {
      name: reservation.restaurantName,
      status: reservation.restaurantStatus,
      schedule: reservation.restaurantSchedule,
      capacity: reservation.restaurantCapacity,
    })
  })

  return Array.from(map.values())
}

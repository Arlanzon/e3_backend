import { prisma } from '@/lib/prisma'
import type { ReservationStatus } from '@prisma/client'

export async function createReservation(data: {
  userId: string
  restaurantId: string
  date: Date
  timeMin: number
  numPersons: number
  notes?: string
}) {
  return prisma.reservation.create({
    data,
    include: {
      restaurant: { select: { name: true, timezone: true } },
    },
  })
}

export async function findReservationById(id: string) {
  return prisma.reservation.findUnique({
    where: { id },
    include: {
      user:       { select: { id: true, name: true, email: true } },
      restaurant: { select: { id: true, name: true, timezone: true } },
    },
  })
}

export async function findReservationsByUser(
  userId: string,
  status?: ReservationStatus,
  page  = 1,
  limit = 20
) {
  const where = { userId, ...(status ? { status } : {}) }
  const skip  = (page - 1) * limit

  const [reservations, total] = await Promise.all([
    prisma.reservation.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        restaurant: { select: { id: true, name: true, cuisineType: true } },
      },
    }),
    prisma.reservation.count({ where }),
  ])

  return { reservations, total, page, limit }
}

export async function findReservationsByRestaurant(
  restaurantId: string,
  status?: ReservationStatus,
  page  = 1,
  limit = 20
) {
  const where = { restaurantId, ...(status ? { status } : {}) }
  const skip  = (page - 1) * limit

  const [reservations, total] = await Promise.all([
    prisma.reservation.findMany({
      where,
      skip,
      take: limit,
      orderBy: { date: 'asc' },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    }),
    prisma.reservation.count({ where }),
  ])

  return { reservations, total, page, limit }
}

export async function checkOverlap(
  restaurantId: string,
  date: Date,
  timeMin: number,
  durationMin: number
): Promise<number> {
  const timeEnd = timeMin + durationMin

  const result = await prisma.reservation.aggregate({
    where: {
      restaurantId,
      date,
      status: { in: ['CONFIRMED', 'PENDING'] },
      AND: [
        { timeMin: { lt: timeEnd } },
        { timeMin: { gte: timeMin - durationMin } },
      ],
    },
    _sum: { numPersons: true },
  })

  return result._sum.numPersons ?? 0
}

export async function updateReservationStatus(
  id: string,
  data: {
    status: ReservationStatus
    rejectionReason?: string
    snapshotCapacityTotal?: number
    snapshotCapacityFactor?: number
    snapshotDurationMin?: number
    confirmedAt?: Date
    rejectedAt?: Date
    cancelledAt?: Date
    completedAt?: Date
  }
) {
  return prisma.reservation.update({
    where: { id },
    data,
  })
}

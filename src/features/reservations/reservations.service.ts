import {
    createReservation,
    findReservationById,
    findReservationsByUser,
    findReservationsByRestaurant,
    checkOverlap,
    updateReservationStatus,
  } from './reservations.repository'
  import { prisma } from '@/lib/prisma'
  import { AppError } from '@/lib/errors'
  import { timeToMinutes, minutesToTime } from '@/utils/time'
  import type {
    CreateReservationInput,
    RejectReservationInput,
    ListReservationsInput,
  } from './reservations.schema'
  import type { ReservationStatus } from '@prisma/client'
  
  // ── Helper interno ─────────────────────────────────────────────────────────
  
  function parseDate(dateStr: string): Date {
    const [year, month, day] = dateStr.split('-').map(Number)
    return new Date(Date.UTC(year!, month! - 1, day!))
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function formatReservation(r: any) {
    return {
      ...r,
      time:    minutesToTime(r.timeMin as number),
      timeMin: undefined,
    }
  }
  
  // ── Crear reservacion ──────────────────────────────────────────────────────
  
  export async function createReservationService(
    input: CreateReservationInput,
    userId: string
  ) {
    const restaurant = await prisma.restaurant.findUnique({
      where:   { id: input.restaurantId },
      include: { businessHours: true },
    })
  
    if (!restaurant) {
      throw new AppError('RESTAURANT_NOT_FOUND', 'Restaurante no encontrado', 404)
    }
  
    if (restaurant.status !== 'ACTIVE') {
      throw new AppError('RESTAURANT_INACTIVE', 'El restaurante no esta activo', 400)
    }
  
    const date    = parseDate(input.date)
    const timeMin = timeToMinutes(input.time)
    const now     = new Date()
  
    // Anticipacion minima
    const reservationDateTime = new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        Math.floor(timeMin / 60),
        timeMin % 60
      )
    )
  
    const diffHours = (reservationDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)
  
    if (diffHours < restaurant.minAdvanceHours) {
      throw new AppError(
        'INSUFFICIENT_ADVANCE',
        `Debes reservar con al menos ${restaurant.minAdvanceHours} horas de anticipacion`,
        400
      )
    }
  
    if (diffHours / 24 > restaurant.maxAdvanceDays) {
      throw new AppError(
        'TOO_FAR_IN_ADVANCE',
        `No puedes reservar con mas de ${restaurant.maxAdvanceDays} dias de anticipacion`,
        400
      )
    }
  
    // Horario del dia
    const days = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY']
    const dayOfWeek   = days[date.getUTCDay()]!
    const businessHour = restaurant.businessHours.find((h) => h.dayOfWeek === dayOfWeek)
  
    if (!businessHour || businessHour.isClosed) {
      throw new AppError('RESTAURANT_CLOSED', 'El restaurante esta cerrado ese dia', 400)
    }
  
    const lastSlot = businessHour.closeTimeMin - restaurant.reservationDurationMin
  
    if (timeMin < businessHour.openTimeMin || timeMin > lastSlot) {
      throw new AppError(
        'OUTSIDE_BUSINESS_HOURS',
        `El restaurante atiende de ${minutesToTime(businessHour.openTimeMin)} a ${minutesToTime(businessHour.closeTimeMin)}. Ultimo slot: ${minutesToTime(lastSlot)}`,
        400
      )
    }
  
    // Cierre especial
    const closure = await prisma.specialClosure.findUnique({
      where: { restaurantId_date: { restaurantId: restaurant.id, date } },
    })
  
    if (closure) {
      if (closure.isClosed) {
        throw new AppError('RESTAURANT_CLOSED', 'El restaurante tiene un cierre especial ese dia', 400)
      }
      if (closure.openTimeMin != null && closure.closeTimeMin != null) {
        const lastSlotClosure = closure.closeTimeMin - restaurant.reservationDurationMin
        if (timeMin < closure.openTimeMin || timeMin > lastSlotClosure) {
          throw new AppError('OUTSIDE_BUSINESS_HOURS', 'Fuera del horario especial de ese dia', 400)
        }
      }
    }
  
    // Capacidad disponible
    const capacityReservable = Math.floor(
      restaurant.capacity * Number(restaurant.reservationCapacityFactor)
    )
  
    const occupied = await checkOverlap(
      restaurant.id,
      date,
      timeMin,
      restaurant.reservationDurationMin
    )
  
    if (occupied + input.numPersons > capacityReservable) {
      throw new AppError('NO_AVAILABILITY', 'No hay disponibilidad para ese horario', 409)
    }
  
    const reservation = await createReservation({
      userId,
      restaurantId: restaurant.id,
      date,
      timeMin,
      numPersons: input.numPersons,
      notes:      input.notes,
    })
  
    return formatReservation(reservation)
  }
  
  // ── Listar mis reservaciones ───────────────────────────────────────────────
  
  export async function listMyReservationsService(
    userId: string,
    input: ListReservationsInput
  ) {
    const result = await findReservationsByUser(
      userId,
      input.status as ReservationStatus | undefined,
      input.page,
      input.limit
    )
  
    return {
      ...result,
      reservations: result.reservations.map(formatReservation),
    }
  }
  
  // ── Listar reservaciones del restaurante ──────────────────────────────────
  
  export async function listRestaurantReservationsService(
    restaurantId: string,
    userId: string,
    input: ListReservationsInput
  ) {
    const membership = await prisma.userRestaurant.findUnique({
      where: { userId_restaurantId: { userId, restaurantId } },
    })
  
    if (!membership || !membership.active) {
      throw new AppError('FORBIDDEN', 'No tienes permiso', 403)
    }
  
    const result = await findReservationsByRestaurant(
      restaurantId,
      input.status as ReservationStatus | undefined,
      input.page,
      input.limit
    )
  
    return {
      ...result,
      reservations: result.reservations.map(formatReservation),
    }
  }
  
  // ── Ver detalle ────────────────────────────────────────────────────────────
  
  export async function getReservationService(
    reservationId: string,
    userId: string
  ) {
    const reservation = await findReservationById(reservationId)
  
    if (!reservation) {
      throw new AppError('RESERVATION_NOT_FOUND', 'Reservacion no encontrada', 404)
    }
  
    const isOwner  = reservation.userId === userId
    const membership = await prisma.userRestaurant.findUnique({
      where: { userId_restaurantId: { userId, restaurantId: reservation.restaurantId } },
    })
  
    if (!isOwner && (!membership || !membership.active)) {
      throw new AppError('FORBIDDEN', 'No tienes permiso para ver esta reservacion', 403)
    }
  
    return formatReservation(reservation)
  }
  
  // ── Confirmar ──────────────────────────────────────────────────────────────
  
  export async function confirmReservationService(
    reservationId: string,
    userId: string
  ) {
    const reservation = await findReservationById(reservationId)
  
    if (!reservation) {
      throw new AppError('RESERVATION_NOT_FOUND', 'Reservacion no encontrada', 404)
    }
  
    if (reservation.status !== 'PENDING') {
      throw new AppError('INVALID_STATUS', 'Solo se pueden confirmar reservaciones pendientes', 400)
    }
  
    const membership = await prisma.userRestaurant.findUnique({
      where: { userId_restaurantId: { userId, restaurantId: reservation.restaurantId } },
    })
  
    if (!membership || !membership.active) {
      throw new AppError('FORBIDDEN', 'No tienes permiso', 403)
    }
  
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: reservation.restaurantId },
    })
  
    if (!restaurant) {
      throw new AppError('RESTAURANT_NOT_FOUND', 'Restaurante no encontrado', 404)
    }
  
    // Revalidar capacidad al confirmar
    const capacityReservable = Math.floor(
      restaurant.capacity * Number(restaurant.reservationCapacityFactor)
    )
  
    const occupied = await checkOverlap(
      reservation.restaurantId,
      reservation.date,
      reservation.timeMin,
      restaurant.reservationDurationMin
    )
  
    // La reservacion misma esta en PENDING y ya fue contada
    // restamos su propio numPersons para no contarla doble
    const occupiedOthers = occupied - reservation.numPersons
  
    if (occupiedOthers + reservation.numPersons > capacityReservable) {
      throw new AppError('NO_AVAILABILITY', 'No hay capacidad suficiente para confirmar', 409)
    }
  
    const updated = await updateReservationStatus(reservationId, {
      status:                'CONFIRMED',
      confirmedAt:           new Date(),
      snapshotCapacityTotal:  restaurant.capacity,
      snapshotCapacityFactor: Number(restaurant.reservationCapacityFactor),
      snapshotDurationMin:    restaurant.reservationDurationMin,
    })
  
    return formatReservation(updated)
  }
  
  // ── Rechazar ───────────────────────────────────────────────────────────────
  
  export async function rejectReservationService(
    reservationId: string,
    userId: string,
    input: RejectReservationInput
  ) {
    const reservation = await findReservationById(reservationId)
  
    if (!reservation) {
      throw new AppError('RESERVATION_NOT_FOUND', 'Reservacion no encontrada', 404)
    }
  
    if (reservation.status !== 'PENDING') {
      throw new AppError('INVALID_STATUS', 'Solo se pueden rechazar reservaciones pendientes', 400)
    }
  
    const membership = await prisma.userRestaurant.findUnique({
      where: { userId_restaurantId: { userId, restaurantId: reservation.restaurantId } },
    })
  
    if (!membership || !membership.active) {
      throw new AppError('FORBIDDEN', 'No tienes permiso', 403)
    }
  
    const updated = await updateReservationStatus(reservationId, {
      status:          'REJECTED',
      rejectionReason: input.rejectionReason,
      rejectedAt:      new Date(),
    })
  
    return formatReservation(updated)
  }
  
  // ── Cancelar ───────────────────────────────────────────────────────────────
  
  export async function cancelReservationService(
    reservationId: string,
    userId: string
  ) {
    const reservation = await findReservationById(reservationId)
  
    if (!reservation) {
      throw new AppError('RESERVATION_NOT_FOUND', 'Reservacion no encontrada', 404)
    }
  
    if (reservation.userId !== userId) {
      throw new AppError('FORBIDDEN', 'Solo puedes cancelar tus propias reservaciones', 403)
    }
  
    if (reservation.status !== 'CONFIRMED') {
      throw new AppError('INVALID_STATUS', 'Solo se pueden cancelar reservaciones confirmadas', 400)
    }
  
    const now = new Date()
    const reservationDateTime = new Date(
      Date.UTC(
        reservation.date.getUTCFullYear(),
        reservation.date.getUTCMonth(),
        reservation.date.getUTCDate(),
        Math.floor(reservation.timeMin / 60),
        reservation.timeMin % 60
      )
    )
  
    const diffHours = (reservationDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)
  
    if (diffHours < 2) {
      throw new AppError(
        'CANCELLATION_TOO_LATE',
        'No puedes cancelar con menos de 2 horas de anticipacion',
        400
      )
    }
  
    const updated = await updateReservationStatus(reservationId, {
      status:      'CANCELLED',
      cancelledAt: now,
    })
  
    return formatReservation(updated)
  }
import {
    findReviewByReservationId,
    findReviewById,
    findVisibleReviewsByRestaurant,
    createReview,
    updateReview,
    updateRestaurantRating,
    findResponseByReviewId,
    createResponse,
    updateResponse,
  } from './reviews.repository'
  import { prisma } from '@/lib/prisma'
  import { AppError } from '@/lib/errors'
  import type {
    CreateReviewInput,
    UpdateReviewInput,
    CreateResponseInput,
    UpdateResponseInput,
  } from './reviews.schema'
  
  // ── Crear reseña ───────────────────────────────────────────────────────────
  
  export async function createReviewService(
    input: CreateReviewInput,
    userId: string
  ) {
    // La reservacion debe existir y pertenecer al usuario
    const reservation = await prisma.reservation.findUnique({
      where: { id: input.reservationId },
    })
  
    if (!reservation) {
      throw new AppError('RESERVATION_NOT_FOUND', 'Reservacion no encontrada', 404)
    }
  
    if (reservation.userId !== userId) {
      throw new AppError('FORBIDDEN', 'Solo puedes resenar tus propias reservaciones', 403)
    }
  
    if (reservation.status !== 'COMPLETED') {
      throw new AppError(
        'RESERVATION_NOT_COMPLETED',
        'Solo puedes resenar reservaciones completadas',
        400
      )
    }
  
    // Ventana de 30 dias para resenar
    const thirtyDaysAfter = new Date(reservation.date)
    thirtyDaysAfter.setUTCDate(thirtyDaysAfter.getUTCDate() + 30)
  
    if (new Date() > thirtyDaysAfter) {
      throw new AppError(
        'REVIEW_WINDOW_EXPIRED',
        'El periodo para dejar una resena ha expirado (30 dias)',
        400
      )
    }
  
    // Una sola reseña por reservacion
    const existing = await findReviewByReservationId(input.reservationId)
    if (existing) {
      throw new AppError(
        'REVIEW_ALREADY_EXISTS',
        'Ya existe una resena para esta reservacion',
        409
      )
    }
  
    // editable_until = ahora + 7 dias
    const editableUntil = new Date()
    editableUntil.setUTCDate(editableUntil.getUTCDate() + 7)
  
    const review = await createReview({
      reservationId: input.reservationId,
      userId,
      restaurantId:  reservation.restaurantId,
      rating:        input.rating,
      comment:       input.comment,
      editableUntil,
    })
  
    await updateRestaurantRating(reservation.restaurantId)
  
    return review
  }
  
  // ── Editar reseña ──────────────────────────────────────────────────────────
  
  export async function updateReviewService(
    reviewId: string,
    input: UpdateReviewInput,
    userId: string
  ) {
    const review = await findReviewById(reviewId)
  
    if (!review) {
      throw new AppError('REVIEW_NOT_FOUND', 'Resena no encontrada', 404)
    }
  
    if (review.userId !== userId) {
      throw new AppError('FORBIDDEN', 'Solo puedes editar tus propias resenas', 403)
    }
  
    if (review.status !== 'VISIBLE') {
      throw new AppError('REVIEW_NOT_EDITABLE', 'Esta resena no se puede editar', 400)
    }
  
    if (new Date() > review.editableUntil) {
      throw new AppError(
        'REVIEW_EDIT_EXPIRED',
        'El periodo de edicion ha expirado (7 dias)',
        400
      )
    }
  
    const updated = await updateReview(reviewId, input)
    await updateRestaurantRating(review.restaurantId)
  
    return updated
  }
  
  // ── Listar reseñas visibles del restaurante ────────────────────────────────
  
  export async function listReviewsService(
    restaurantId: string,
    page  = 1,
    limit = 20
  ) {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    })
  
    if (!restaurant) {
      throw new AppError('RESTAURANT_NOT_FOUND', 'Restaurante no encontrado', 404)
    }
  
    return findVisibleReviewsByRestaurant(restaurantId, page, limit)
  }

  async function ensureCanRespondReview(userId: string, restaurantId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    })

    if (!user || (user.role !== 'OWNER' && user.role !== 'MANAGER')) {
      throw new AppError(
        'FORBIDDEN',
        'Solo propietarios o encargados pueden responder resenas',
        403
      )
    }

    const membership = await prisma.userRestaurant.findUnique({
      where: {
        userId_restaurantId: { userId, restaurantId },
      },
    })

    if (!membership || !membership.active) {
      throw new AppError('FORBIDDEN', 'No tienes permiso para responder esta resena', 403)
    }
  }
  
  // ── Responder reseña ───────────────────────────────────────────────────────
  
  export async function createResponseService(
    reviewId: string,
    input: CreateResponseInput,
    userId: string
  ) {
    const review = await findReviewById(reviewId)
  
    if (!review) {
      throw new AppError('REVIEW_NOT_FOUND', 'Resena no encontrada', 404)
    }
  
    if (review.status !== 'VISIBLE') {
      throw new AppError('REVIEW_NOT_VISIBLE', 'Solo se pueden responder resenas visibles', 400)
    }
  
    await ensureCanRespondReview(userId, review.restaurantId)
  
    // Solo una respuesta por reseña
    const existing = await findResponseByReviewId(reviewId)
    if (existing) {
      throw new AppError(
        'RESPONSE_ALREADY_EXISTS',
        'Ya existe una respuesta para esta resena. Usa PATCH para editarla',
        409
      )
    }
  
    return createResponse({
      reviewId,
      responderId:  userId,
      restaurantId: review.restaurantId,
      content:      input.content,
    })
  }
  
  // ── Editar respuesta ───────────────────────────────────────────────────────
  
  export async function updateResponseService(
    reviewId: string,
    input: UpdateResponseInput,
    userId: string
  ) {
    const review = await findReviewById(reviewId)
  
    if (!review) {
      throw new AppError('REVIEW_NOT_FOUND', 'Resena no encontrada', 404)
    }
  
    if (review.status !== 'VISIBLE') {
      throw new AppError('REVIEW_NOT_VISIBLE', 'Solo se pueden editar respuestas de resenas visibles', 400)
    }
  
    await ensureCanRespondReview(userId, review.restaurantId)
  
    const existing = await findResponseByReviewId(reviewId)
    if (!existing) {
      throw new AppError('RESPONSE_NOT_FOUND', 'No existe respuesta para editar', 404)
    }
  
    return updateResponse(reviewId, input.content)
  }

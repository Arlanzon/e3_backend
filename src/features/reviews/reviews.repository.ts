import { prisma } from '@/lib/prisma'

export async function findReviewByReservationId(reservationId: string) {
  return prisma.review.findUnique({
    where: { reservationId },
  })
}

export async function findReviewById(id: string) {
  return prisma.review.findUnique({
    where: { id },
    include: {
      user:     { select: { id: true, name: true } },
      response: true,
    },
  })
}

export async function findVisibleReviewsByRestaurant(
  restaurantId: string,
  page  = 1,
  limit = 20
) {
  const skip = (page - 1) * limit

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where:   { restaurantId, status: 'VISIBLE' },
      skip,
      take:    limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user:     { select: { id: true, name: true } },
        response: true,
      },
    }),
    prisma.review.count({
      where: { restaurantId, status: 'VISIBLE' },
    }),
  ])

  return { reviews, total, page, limit }
}

export async function createReview(data: {
  reservationId: string
  userId:        string
  restaurantId:  string
  rating:        number
  comment?:      string
  editableUntil: Date
}) {
  return prisma.review.create({
    data,
    include: {
      user: { select: { id: true, name: true } },
    },
  })
}

export async function updateReview(
  id: string,
  data: { rating?: number; comment?: string }
) {
  return prisma.review.update({
    where: { id },
    data,
  })
}

export async function updateRestaurantRating(restaurantId: string) {
  const result = await prisma.review.aggregate({
    where: { restaurantId, status: 'VISIBLE' },
    _avg:   { rating: true },
    _count: { rating: true },
  })

  await prisma.restaurant.update({
    where: { id: restaurantId },
    data: {
      ratingAvg:   result._avg.rating ?? null,
      ratingCount: result._count.rating,
    },
  })
}

export async function findResponseByReviewId(reviewId: string) {
  return prisma.reviewResponse.findUnique({
    where: { reviewId },
  })
}

export async function createResponse(data: {
  reviewId:     string
  responderId:  string
  restaurantId: string
  content:      string
}) {
  return prisma.reviewResponse.create({ data })
}

export async function updateResponse(reviewId: string, content: string) {
  return prisma.reviewResponse.update({
    where: { reviewId },
    data:  { content, isEdited: true },
  })
}
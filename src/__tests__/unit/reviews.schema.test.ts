import { describe, expect, it } from 'vitest'

import { createReviewSchema } from '@/features/reviews/reviews.schema'

const validReview = {
  reservationId: '550e8400-e29b-41d4-a716-446655440000',
  rating: 5,
  comment: 'Excelente servicio',
}

describe('createReviewSchema', () => {
  it('accepts valid ratings from 1 to 5', () => {
    expect(createReviewSchema.safeParse({ ...validReview, rating: 1 }).success).toBe(true)
    expect(createReviewSchema.safeParse({ ...validReview, rating: 5 }).success).toBe(true)
  })

  it('rejects ratings outside the allowed range', () => {
    expect(createReviewSchema.safeParse({ ...validReview, rating: 0 }).success).toBe(false)
    expect(createReviewSchema.safeParse({ ...validReview, rating: 6 }).success).toBe(false)
  })

  it('rejects invalid reservationId values', () => {
    expect(createReviewSchema.safeParse({ ...validReview, reservationId: 'invalid-id' }).success).toBe(false)
  })

  it('requires reservationId and rating', () => {
    expect(createReviewSchema.safeParse({ rating: 5 }).success).toBe(false)
    expect(createReviewSchema.safeParse({ reservationId: validReview.reservationId }).success).toBe(false)
  })
})

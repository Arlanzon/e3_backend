import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    restaurant: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}))

vi.mock('@/lib/prisma', () => ({
  prisma: prismaMock,
}))

vi.mock('@/lib/jwt', () => ({
  extractToken: vi.fn(),
  verifyToken: vi.fn(),
}))

import { GET } from '../../../app/api/v1/restaurants/route'

const createRequest = (url: string) => new NextRequest(url)

const restaurant = {
  id: 'restaurant-1',
  name: 'Casa Test',
  slug: 'casa-test',
  cuisineType: 'Mexicana',
  address: 'Calle Test 123',
  lat: 19.4326,
  lng: -99.1332,
  phone: '5555555555',
  status: 'ACTIVE',
  ratingAvg: 4.5,
  ratingCount: 10,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
}

describe('GET /api/v1/restaurants', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns restaurants with meta when called without params', async () => {
    prismaMock.restaurant.findMany.mockResolvedValue([restaurant])
    prismaMock.restaurant.count.mockResolvedValue(1)

    const response = await GET(createRequest('http://localhost/api/v1/restaurants'))
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.success).toBe(true)
    expect(body.data).toHaveLength(1)
    expect(body.meta).toEqual({
      total: 1,
      page: 1,
      limit: 20,
      pages: 1,
    })
  })

  it('returns an empty list with total 0', async () => {
    prismaMock.restaurant.findMany.mockResolvedValue([])
    prismaMock.restaurant.count.mockResolvedValue(0)

    const response = await GET(createRequest('http://localhost/api/v1/restaurants'))
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.success).toBe(true)
    expect(body.data).toEqual([])
    expect(body.meta.total).toBe(0)
  })

  it('uses page and limit from query params', async () => {
    prismaMock.restaurant.findMany.mockResolvedValue([restaurant])
    prismaMock.restaurant.count.mockResolvedValue(25)

    const response = await GET(createRequest('http://localhost/api/v1/restaurants?page=2&limit=10'))
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.success).toBe(true)
    expect(body.meta.page).toBe(2)
    expect(body.meta.limit).toBe(10)
  })
})

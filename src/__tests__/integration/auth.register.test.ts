import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const { hashMock, prismaMock } = vi.hoisted(() => ({
  hashMock: vi.fn(),
  prismaMock: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}))

vi.mock('@/lib/prisma', () => ({
  prisma: prismaMock,
}))

vi.mock('bcryptjs', () => ({
  default: {
    hash: hashMock,
  },
}))

import { POST } from '../../../app/api/v1/auth/register/route'

const createJsonRequest = (body: unknown) =>
  new NextRequest('http://localhost/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'content-type': 'application/json',
    },
  })

const validPayload = {
  name: 'Fernando Test',
  email: 'fernando@test.com',
  password: '12345678',
}

const createdUser = {
  id: 'user-1',
  name: 'Fernando Test',
  email: 'fernando@test.com',
  role: 'CUSTOMER',
  active: true,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
}

describe('POST /api/v1/auth/register', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates a user with valid data', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null)
    prismaMock.user.create.mockResolvedValue(createdUser)
    hashMock.mockResolvedValue('hashed-password')

    const response = await POST(createJsonRequest(validPayload))
    const body = await response.json()

    expect(response.status).toBe(201)
    expect(body.success).toBe(true)
    expect(body.data.email).toBe(validPayload.email)
    expect(hashMock).toHaveBeenCalledWith(validPayload.password, 12)
  })

  it('returns 409 when the email already exists', async () => {
    prismaMock.user.findUnique.mockResolvedValue(createdUser)

    const response = await POST(createJsonRequest(validPayload))
    const body = await response.json()

    expect(response.status).toBe(409)
    expect(body.success).toBe(false)
    expect(body.error.code).toBe('EMAIL_ALREADY_EXISTS')
  })

  it('returns 400 for invalid data', async () => {
    const response = await POST(createJsonRequest({ name: 'F', email: 'invalid', password: '123' }))
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body.success).toBe(false)
    expect(body.error.code).toBe('VALIDATION_ERROR')
  })
})

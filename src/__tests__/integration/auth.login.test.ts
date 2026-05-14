import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const { compareMock, prismaMock, signTokenMock } = vi.hoisted(() => ({
  compareMock: vi.fn(),
  prismaMock: {
    user: {
      findUnique: vi.fn(),
    },
  },
  signTokenMock: vi.fn(),
}))

vi.mock('@/lib/prisma', () => ({
  prisma: prismaMock,
}))

vi.mock('bcryptjs', () => ({
  default: {
    compare: compareMock,
  },
}))

vi.mock('@/lib/jwt', () => ({
  signToken: signTokenMock,
}))

import { POST } from '../../../app/api/v1/auth/login/route'

const createJsonRequest = (body: unknown) =>
  new NextRequest('http://localhost/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'content-type': 'application/json',
    },
  })

const loginPayload = {
  email: 'fernando@test.com',
  password: '12345678',
}

const user = {
  id: 'user-1',
  name: 'Fernando Test',
  email: 'fernando@test.com',
  passwordHash: 'hashed-password',
  role: 'CUSTOMER',
  active: true,
}

describe('POST /api/v1/auth/login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns a token for valid credentials', async () => {
    prismaMock.user.findUnique.mockResolvedValue(user)
    compareMock.mockResolvedValue(true)
    signTokenMock.mockResolvedValue('jwt-token')

    const response = await POST(createJsonRequest(loginPayload))
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.success).toBe(true)
    expect(body.data.token).toBe('jwt-token')
    expect(body.data.user.email).toBe(loginPayload.email)
    expect(signTokenMock).toHaveBeenCalledWith({
      sub: user.id,
      email: user.email,
      role: user.role,
    })
  })

  it('returns 401 when the password is incorrect', async () => {
    prismaMock.user.findUnique.mockResolvedValue(user)
    compareMock.mockResolvedValue(false)

    const response = await POST(createJsonRequest(loginPayload))
    const body = await response.json()

    expect(response.status).toBe(401)
    expect(body.success).toBe(false)
    expect(body.error.code).toBe('INVALID_CREDENTIALS')
  })

  it('returns 401 when the user does not exist', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null)

    const response = await POST(createJsonRequest(loginPayload))
    const body = await response.json()

    expect(response.status).toBe(401)
    expect(body.success).toBe(false)
    expect(body.error.code).toBe('INVALID_CREDENTIALS')
  })

  it('returns 403 when the account is disabled', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ ...user, active: false })

    const response = await POST(createJsonRequest(loginPayload))
    const body = await response.json()

    expect(response.status).toBe(403)
    expect(body.success).toBe(false)
    expect(body.error.code).toBe('ACCOUNT_DISABLED')
  })
})

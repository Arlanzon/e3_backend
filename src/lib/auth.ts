import { NextRequest } from 'next/server'
import { extractToken, verifyToken } from '@/lib/jwt'
import { AppError } from '@/lib/errors'
import type { JWTPayload } from '@/lib/jwt'
import type { UserRole } from '@prisma/client'

export async function getAuthUser(
  req: NextRequest
): Promise<JWTPayload | null> {
  const token = extractToken(req.headers.get('authorization'))
  if (!token) return null

  try {
    return await verifyToken(token)
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[getAuthUser] Token inválido:', error)
    }
    return null
  }
}

export async function requireAuth(
  req: NextRequest
): Promise<JWTPayload> {
  const user = await getAuthUser(req)
  if (!user) {
    throw new AppError('UNAUTHORIZED', 'No autenticado', 401)
  }
  return user
}

export async function requireRole(
  req: NextRequest,
  roles: UserRole[]
): Promise<JWTPayload> {
  const user = await requireAuth(req)
  if (!roles.includes(user.role)) {
    throw new AppError('FORBIDDEN', 'No autorizado', 403)
  }
  return user
}
import { SignJWT, jwtVerify } from 'jose'
import type { UserRole } from '@prisma/client'

const jwtSecret = process.env.JWT_SECRET

if (!jwtSecret) {
  throw new Error('JWT_SECRET no está definido en las variables de entorno')
}

const secret = new TextEncoder().encode(jwtSecret)

export interface JWTPayload {
  sub: string
  email: string
  role: UserRole
  iat?: number
  exp?: number
}

export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ email: payload.email, role: payload.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXPIRES_IN ?? '30m')
    .sign(secret)
}

export async function verifyToken(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, secret)

  return {
    sub: payload.sub as string,
    email: payload.email as string,
    role: payload.role as UserRole,
    iat: payload.iat,
    exp: payload.exp,
  }
}

export function extractToken(authHeader: string | null): string | null {
  if (!authHeader?.startsWith('Bearer ')) return null
  return authHeader.slice(7)
}
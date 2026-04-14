import bcrypt from 'bcryptjs'
import { findUserByEmail, findUserById, createUser } from './users.repository'
import { AppError } from '@/lib/errors'
import type { RegisterInput, LoginInput } from './users.schema'

export async function registerUser(input: RegisterInput) {
  const email = input.email.trim().toLowerCase()

  const existing = await findUserByEmail(email)
  if (existing) {
    throw new AppError('EMAIL_ALREADY_EXISTS', 'El email ya está registrado', 409)
  }

  const passwordHash = await bcrypt.hash(input.password, 12)

  return createUser({
    name: input.name.trim(),
    email,
    passwordHash,
    role: 'CUSTOMER',
  })
}

export async function validateCredentials(input: LoginInput) {
  const email = input.email.trim().toLowerCase()

  const user = await findUserByEmail(email)
  if (!user) {
    throw new AppError('INVALID_CREDENTIALS', 'Email o contraseña incorrectos', 401)
  }

  if (!user.active) {
    throw new AppError('ACCOUNT_DISABLED', 'La cuenta está desactivada', 403)
  }

  const valid = await bcrypt.compare(input.password, user.passwordHash)
  if (!valid) {
    throw new AppError('INVALID_CREDENTIALS', 'Email o contraseña incorrectos', 401)
  }

  return user
}

export async function getUserById(id: string) {
  const user = await findUserById(id)
  if (!user) {
    throw new AppError('USER_NOT_FOUND', 'Usuario no encontrado', 404)
  }
  if (!user.active) {
    throw new AppError('ACCOUNT_DISABLED', 'La cuenta está desactivada', 403)
  }
  return user
}
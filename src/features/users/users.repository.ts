import { prisma } from '@/lib/prisma'

type UserRole = 'CUSTOMER' | 'OWNER' | 'MANAGER' | 'ADMIN'

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  })
}

export async function findUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
      photoUrl: true,
      createdAt: true,
      updatedAt: true,
    },
  })
}

export async function createUser(data: {
  name: string
  email: string
  passwordHash: string
  role: UserRole
}) {
  return prisma.user.create({
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
      createdAt: true,
    },
  })
}

import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import type { CreateRestaurantInput, UpdateRestaurantInput, ListRestaurantsInput } from './restaurants.schema'
import type { BusinessHourDTO } from './restaurants.schema'

type RestaurantStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'

export async function findRestaurantBySlug(slug: string) {
  return prisma.restaurant.findUnique({
    where: { slug },
  })
}

export async function findRestaurantById(id: string) {
  return prisma.restaurant.findUnique({
    where: { id },
    include: {
      businessHours: true,
      staff: {
        where: { active: true },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      },
    },
  })
}

export async function findRestaurants(input: ListRestaurantsInput) {
  const { cuisine, status, page, limit } = input
  const skip = (page - 1) * limit

  const where = {
    ...(cuisine ? { cuisineType: { contains: cuisine, mode: 'insensitive' as const } } : {}),
    ...(status ? { status: status as RestaurantStatus } : { status: 'ACTIVE' as RestaurantStatus }),
  }

  const [restaurants, total] = await Promise.all([
    prisma.restaurant.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        slug: true,
        cuisineType: true,
        address: true,
        lat: true,
        lng: true,
        phone: true,
        status: true,
        ratingAvg: true,
        ratingCount: true,
        createdAt: true,
      },
    }),
    prisma.restaurant.count({ where }),
  ])

  return { restaurants, total, page, limit }
}

export async function createRestaurant(
  data: CreateRestaurantInput & { userId: string }
) {
  const { userId, ...restaurantData } = data

  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const restaurant = await tx.restaurant.create({
      data: restaurantData,
    })

    await tx.userRestaurant.create({
      data: {
        userId,
        restaurantId: restaurant.id,
        permissionRole: 'OWNER',
      },
    })

    return restaurant
  })
}

export async function updateRestaurant(
  id: string,
  data: UpdateRestaurantInput
) {
  return prisma.restaurant.update({
    where: { id },
    data,
  })
}

export async function findUserRestaurant(userId: string, restaurantId: string) {
  return prisma.userRestaurant.findUnique({
    where: {
      userId_restaurantId: { userId, restaurantId },
    },
  })
}

export async function upsertBusinessHours(
  restaurantId: string,
  hours: BusinessHourDTO[]
) {
  return prisma.$transaction(
    hours.map((hour) =>
      prisma.businessHour.upsert({
        where: {
          restaurantId_dayOfWeek: {
            restaurantId,
            dayOfWeek: hour.dayOfWeek,
          },
        },
        update: {
          openTimeMin: hour.openTimeMin,
          closeTimeMin: hour.closeTimeMin,
          isClosed: hour.isClosed,
        },
        create: {
          restaurantId,
          dayOfWeek: hour.dayOfWeek,
          openTimeMin: hour.openTimeMin,
          closeTimeMin: hour.closeTimeMin,
          isClosed: hour.isClosed,
        },
      })
    )
  )
}

export async function findBusinessHours(restaurantId: string) {
  return prisma.businessHour.findMany({
    where: { restaurantId },
    orderBy: { dayOfWeek: 'asc' },
  })
}

// Cierres especiales

export async function createClosure(
  restaurantId: string,
  data: {
    date: Date
    isClosed: boolean
    openTimeMin?: number
    closeTimeMin?: number
    reason?: string
  }
) {
  return prisma.specialClosure.create({
    data: { restaurantId, ...data },
  })
}

export async function findClosures(restaurantId: string) {
  return prisma.specialClosure.findMany({
    where: { restaurantId },
    orderBy: { date: 'asc' },
  })
}

export async function findClosureById(id: string) {
  return prisma.specialClosure.findUnique({ where: { id } })
}

export async function deleteClosure(id: string) {
  return prisma.specialClosure.delete({ where: { id } })
}

export async function findClosureByRestaurantAndDate(
  restaurantId: string,
  date: Date
) {
  return prisma.specialClosure.findUnique({
    where: {
      restaurantId_date: {
        restaurantId,
        date,
      },
    },
  })
}

// Fotos

export async function createPhoto(
  restaurantId: string,
  data: { url: string; isPrimary: boolean; order: number }
) {
  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    if (data.isPrimary) {
      await tx.restaurantPhoto.updateMany({
        where: { restaurantId },
        data: { isPrimary: false },
      })
    }

    return tx.restaurantPhoto.create({
      data: { restaurantId, ...data },
    })
  })
}

export async function findPhotos(restaurantId: string) {
  return prisma.restaurantPhoto.findMany({
    where: { restaurantId },
    orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
  })
}

export async function findPhotoById(id: string) {
  return prisma.restaurantPhoto.findUnique({ where: { id } })
}

export async function countPhotosByRestaurant(restaurantId: string) {
  return prisma.restaurantPhoto.count({
    where: { restaurantId },
  })
}

export async function updatePhoto(
  id: string,
  restaurantId: string,
  data: { isPrimary?: boolean; order?: number }
) {
  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    if (data.isPrimary) {
      await tx.restaurantPhoto.updateMany({
        where: { restaurantId },
        data: { isPrimary: false },
      })
    }

    return tx.restaurantPhoto.update({
      where: { id },
      data,
    })
  })
}

export async function deletePhoto(id: string, restaurantId: string) {
  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const photo = await tx.restaurantPhoto.findUnique({
      where: { id },
    })

    await tx.restaurantPhoto.delete({
      where: { id },
    })

    if (photo?.isPrimary) {
      const next = await tx.restaurantPhoto.findFirst({
        where: { restaurantId },
        orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
      })

      if (next) {
        await tx.restaurantPhoto.update({
          where: { id: next.id },
          data: { isPrimary: true },
        })
      }
    }
  })
}

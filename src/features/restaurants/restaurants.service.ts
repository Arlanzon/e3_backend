import {
    findRestaurantBySlug,
    findRestaurantById,
    findRestaurants,
    createRestaurant,
    updateRestaurant,
    findUserRestaurant,
    upsertBusinessHours,
    findBusinessHours,
    createClosure,
    findClosures,
    findClosureById,
    deleteClosure,
    findClosureByRestaurantAndDate,
    createPhoto,
    findPhotos,
    findPhotoById,
    countPhotosByRestaurant,
    updatePhoto,
    deletePhoto,
  } from './restaurants.repository'
  import type { BusinessHourDTO } from './restaurants.schema'
  import { AppError } from '@/lib/errors'
  import type {
    CreateRestaurantInput,
    UpdateRestaurantInput,
    ListRestaurantsInput,
  } from './restaurants.schema'

  import type { CreateClosureInput } from './closures.schema'
  import type { CreatePhotoInput, UpdatePhotoInput } from './photos.schema'
  import { timeToMinutes } from '@/utils/time'

  
  export async function createRestaurantService(
    input: CreateRestaurantInput,
    userId: string
  ) {
    const existing = await findRestaurantBySlug(input.slug)
    if (existing) {
      throw new AppError('SLUG_ALREADY_EXISTS', 'El slug ya está en uso', 409)
    }
  
    return createRestaurant({ ...input, userId })
  }
  
  export async function getRestaurantService(id: string) {
    const restaurant = await findRestaurantById(id)
    if (!restaurant) {
      throw new AppError('RESTAURANT_NOT_FOUND', 'Restaurante no encontrado', 404)
    }
    return restaurant
  }
  
  export async function listRestaurantsService(input: ListRestaurantsInput) {
    return findRestaurants(input)
  }
  
  export async function updateRestaurantService(
    id: string,
    input: UpdateRestaurantInput,
    userId: string
  ) {
    const restaurant = await findRestaurantById(id)
    if (!restaurant) {
      throw new AppError('RESTAURANT_NOT_FOUND', 'Restaurante no encontrado', 404)
    }
  
    const membership = await findUserRestaurant(userId, id)
    if (!membership || !membership.active) {
      throw new AppError('FORBIDDEN', 'No tienes permiso para editar este restaurante', 403)
    }
  
    if (input.slug && input.slug !== restaurant.slug) {
      const slugExists = await findRestaurantBySlug(input.slug)
      if (slugExists) {
        throw new AppError('SLUG_ALREADY_EXISTS', 'El slug ya está en uso', 409)
      }
    }
  
    return updateRestaurant(id, input)
  }

  export async function setBusinessHoursService(
    restaurantId: string,
    hours: BusinessHourDTO[],
    userId: string
  ) {
    const restaurant = await findRestaurantById(restaurantId)
    if (!restaurant) {
      throw new AppError('RESTAURANT_NOT_FOUND', 'Restaurante no encontrado', 404)
    }
  
    const membership = await findUserRestaurant(userId, restaurantId)
    if (!membership || !membership.active) {
      throw new AppError('FORBIDDEN', 'No tienes permiso para editar este restaurante', 403)
    }
  
    // Validar que apertura < cierre en días no cerrados
    for (const hour of hours) {
      if (!hour.isClosed && hour.openTimeMin >= hour.closeTimeMin) {
        throw new AppError(
          'INVALID_BUSINESS_HOURS',
          `La hora de apertura debe ser menor que la de cierre`,
          400
        )
      }
    }
  
    return upsertBusinessHours(restaurantId, hours)
  }
  
  export async function getBusinessHoursService(restaurantId: string) {
    const restaurant = await findRestaurantById(restaurantId)
    if (!restaurant) {
      throw new AppError('RESTAURANT_NOT_FOUND', 'Restaurante no encontrado', 404)
    }
    return findBusinessHours(restaurantId)
  }

  // Cierres especiales

export async function createClosureService(
  restaurantId: string,
  input: CreateClosureInput,
  userId: string
) {
  const restaurant = await findRestaurantById(restaurantId)

  if (!restaurant) {
    throw new AppError('RESTAURANT_NOT_FOUND', 'Restaurante no encontrado', 404)
  }

  const membership = await findUserRestaurant(userId, restaurantId)

  if (!membership || !membership.active) {
    throw new AppError('FORBIDDEN', 'No tienes permiso', 403)
  }

  const [year, month, day] = input.date.split('-').map(Number)
  const date = new Date(Date.UTC(year!, month! - 1, day!))

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todayUtc = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  )

  if (date < todayUtc) {
    throw new AppError(
      'CLOSURE_DATE_IN_PAST',
      'La fecha no puede ser en el pasado',
      400
    )
  }

  const existing = await findClosureByRestaurantAndDate(restaurantId, date)

  if (existing) {
    throw new AppError(
      'CLOSURE_ALREADY_EXISTS',
      'Ya existe un cierre para esa fecha',
      409
    )
  }

  return createClosure(restaurantId, {
    date,
    isClosed: input.isClosed,
    openTimeMin: input.openTime ? timeToMinutes(input.openTime) : undefined,
    closeTimeMin: input.closeTime ? timeToMinutes(input.closeTime) : undefined,
    reason: input.reason,
  })
}

export async function getClosuresService(restaurantId: string) {
  const restaurant = await findRestaurantById(restaurantId)

  if (!restaurant) {
    throw new AppError('RESTAURANT_NOT_FOUND', 'Restaurante no encontrado', 404)
  }

  return findClosures(restaurantId)
}

export async function deleteClosureService(
  restaurantId: string,
  closureId: string,
  userId: string
) {
  const membership = await findUserRestaurant(userId, restaurantId)

  if (!membership || !membership.active) {
    throw new AppError('FORBIDDEN', 'No tienes permiso', 403)
  }

  const closure = await findClosureById(closureId)

  if (!closure || closure.restaurantId !== restaurantId) {
    throw new AppError('CLOSURE_NOT_FOUND', 'Cierre no encontrado', 404)
  }

  return deleteClosure(closureId)
}

// Fotos

export async function createPhotoService(
  restaurantId: string,
  input: CreatePhotoInput,
  userId: string
) {
  const restaurant = await findRestaurantById(restaurantId)

  if (!restaurant) {
    throw new AppError('RESTAURANT_NOT_FOUND', 'Restaurante no encontrado', 404)
  }

  const membership = await findUserRestaurant(userId, restaurantId)

  if (!membership || !membership.active) {
    throw new AppError('FORBIDDEN', 'No tienes permiso', 403)
  }

  return createPhoto(restaurantId, input)
}

export async function getPhotosService(restaurantId: string) {
  const restaurant = await findRestaurantById(restaurantId)

  if (!restaurant) {
    throw new AppError('RESTAURANT_NOT_FOUND', 'Restaurante no encontrado', 404)
  }

  return findPhotos(restaurantId)
}

export async function updatePhotoService(
  restaurantId: string,
  photoId: string,
  input: UpdatePhotoInput,
  userId: string
) {
  const membership = await findUserRestaurant(userId, restaurantId)

  if (!membership || !membership.active) {
    throw new AppError('FORBIDDEN', 'No tienes permiso', 403)
  }

  const photo = await findPhotoById(photoId)

  if (!photo || photo.restaurantId !== restaurantId) {
    throw new AppError('PHOTO_NOT_FOUND', 'Foto no encontrada', 404)
  }

  return updatePhoto(photoId, restaurantId, input)
}

export async function deletePhotoService(
  restaurantId: string,
  photoId: string,
  userId: string
) {
  const membership = await findUserRestaurant(userId, restaurantId)

  if (!membership || !membership.active) {
    throw new AppError('FORBIDDEN', 'No tienes permiso', 403)
  }

  const photo = await findPhotoById(photoId)

  if (!photo || photo.restaurantId !== restaurantId) {
    throw new AppError('PHOTO_NOT_FOUND', 'Foto no encontrada', 404)
  }

  const totalPhotos = await countPhotosByRestaurant(restaurantId)

  if (totalPhotos === 1) {
    throw new AppError(
      'CANNOT_DELETE_ONLY_PHOTO',
      'No puedes eliminar la unica foto del restaurante',
      400
    )
  }

  return deletePhoto(photoId, restaurantId)
}
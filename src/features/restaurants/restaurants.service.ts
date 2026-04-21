import {
    findRestaurantBySlug,
    findRestaurantById,
    findRestaurants,
    createRestaurant,
    updateRestaurant,
    findUserRestaurant,
    upsertBusinessHours,
    findBusinessHours,
  } from './restaurants.repository'
  import type { BusinessHourDTO } from './restaurants.schema'
  import { AppError } from '@/lib/errors'
  import type {
    CreateRestaurantInput,
    UpdateRestaurantInput,
    ListRestaurantsInput,
  } from './restaurants.schema'
  
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
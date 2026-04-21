import { z } from 'zod'

export const createRestaurantSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(150),
  slug: z
    .string()
    .min(2)
    .max(160)
    .regex(/^[a-z0-9-]+$/, 'El slug solo puede contener letras minúsculas, números y guiones'),
  description: z.string().max(1000).optional(),
  cuisineType: z
    .string()
    .min(2, 'El tipo de cocina es requerido')
    .max(80),
  address: z.string().min(5, 'La dirección es requerida'),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  phone: z.string().max(20).optional(),
  capacity: z
    .number()
    .int()
    .min(1, 'La capacidad debe ser al menos 1'),
  reservationCapacityFactor: z
    .number()
    .min(0.10)
    .max(1.00)
    .default(0.70),
  reservationDurationMin: z
    .number()
    .int()
    .min(15)
    .max(480)
    .default(90),
  minAdvanceHours: z
    .number()
    .int()
    .min(0)
    .max(72)
    .default(2),
  maxAdvanceDays: z
    .number()
    .int()
    .min(1)
    .max(365)
    .default(30),
  timezone: z
    .string()
    .default('America/Mexico_City'),
})

export const updateRestaurantSchema = createRestaurantSchema.partial()

export const listRestaurantsSchema = z.object({
  cuisine: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
})

export type CreateRestaurantInput = z.infer<typeof createRestaurantSchema>
export type UpdateRestaurantInput = z.infer<typeof updateRestaurantSchema>
export type ListRestaurantsInput = z.infer<typeof listRestaurantsSchema>


import { DayOfWeek } from '@prisma/client'
import { timeToMinutes } from '@/utils/time'

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/

export const businessHourInputSchema = z.object({
  dayOfWeek: z.nativeEnum(DayOfWeek),
  openTime: z.string().regex(timeRegex, 'Hora de apertura invalida HH:MM'),
  closeTime: z.string().regex(timeRegex, 'Hora de cierre invalida HH:MM'),
  isClosed: z.boolean().default(false),
})

export const setBusinessHoursSchema = z.object({
  hours: z.array(businessHourInputSchema).min(1).max(7),
})

export type BusinessHourInput = z.infer<typeof businessHourInputSchema>

export type BusinessHourDTO = {
  dayOfWeek: DayOfWeek
  openTimeMin: number
  closeTimeMin: number
  isClosed: boolean
}

export function toBusinessHourDTO(input: BusinessHourInput): BusinessHourDTO {
  return {
    dayOfWeek: input.dayOfWeek,
    openTimeMin: timeToMinutes(input.openTime),
    closeTimeMin: timeToMinutes(input.closeTime),
    isClosed: input.isClosed,
  }
}

export type SetBusinessHoursInput = z.infer<typeof setBusinessHoursSchema>
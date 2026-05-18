import { z } from 'zod'

const dateRegex = /^\d{4}-\d{2}-\d{2}$/
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/

export const createReservationSchema = z.object({
  restaurantId: z.string().uuid('ID de restaurante invalido'),
  date: z.string().regex(dateRegex, 'Fecha debe ser YYYY-MM-DD'),
  time: z.string().regex(timeRegex, 'Hora invalida HH:MM'),
  numPersons: z
    .number()
    .int()
    .min(1, 'Minimo 1 persona')
    .max(20, 'Maximo 20 personas'),
  notes: z.string().max(500).optional(),
})

export const rejectReservationSchema = z.object({
  rejectionReason: z
    .string()
    .min(1, 'El motivo de rechazo es obligatorio')
    .max(500),
})

export const listReservationsSchema = z.object({
  status: z
    .enum(['PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED', 'COMPLETED', 'EXPIRED'])
    .optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
})

export type CreateReservationInput  = z.infer<typeof createReservationSchema>
export type RejectReservationInput  = z.infer<typeof rejectReservationSchema>
export type ListReservationsInput   = z.infer<typeof listReservationsSchema>
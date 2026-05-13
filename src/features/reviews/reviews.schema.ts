import { z } from 'zod'

export const createReviewSchema = z.object({
  reservationId: z.string().uuid('ID de reservacion invalido'),
  rating: z
    .number()
    .int()
    .min(1, 'La calificacion minima es 1')
    .max(5, 'La calificacion maxima es 5'),
  comment: z.string().max(1000).optional(),
})

export const updateReviewSchema = z.object({
  rating: z
    .number()
    .int()
    .min(1, 'La calificacion minima es 1')
    .max(5, 'La calificacion maxima es 5')
    .optional(),
  comment: z.string().max(1000).optional(),
}).refine(
  (data) => data.rating !== undefined || data.comment !== undefined,
  { message: 'Debes enviar al menos rating o comment para actualizar' }
)

export const createResponseSchema = z.object({
  content: z
    .string()
    .min(1, 'La respuesta no puede estar vacia')
    .max(1000),
})

export const updateResponseSchema = z.object({
  content: z
    .string()
    .min(1, 'La respuesta no puede estar vacia')
    .max(1000),
})

export type CreateReviewInput    = z.infer<typeof createReviewSchema>
export type UpdateReviewInput    = z.infer<typeof updateReviewSchema>
export type CreateResponseInput  = z.infer<typeof createResponseSchema>
export type UpdateResponseInput  = z.infer<typeof updateResponseSchema>
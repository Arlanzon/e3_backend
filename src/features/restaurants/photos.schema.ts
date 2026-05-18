import { z } from 'zod'

export const createPhotoSchema = z.object({
  url: z.string().url('URL invalida'),
  isPrimary: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
})

export const updatePhotoSchema = z
  .object({
    isPrimary: z.boolean().optional(),
    order: z.number().int().min(0).optional(),
  })
  .refine(
    (data) => data.isPrimary !== undefined || data.order !== undefined,
    {
      message: 'Debes enviar al menos isPrimary o order para actualizar',
    }
  )

export type CreatePhotoInput = z.infer<typeof createPhotoSchema>
export type UpdatePhotoInput = z.infer<typeof updatePhotoSchema>
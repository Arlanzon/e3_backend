import { z } from 'zod'
import { timeToMinutes } from '@/utils/time'

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/

export const createClosureSchema = z
  .object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha debe ser YYYY-MM-DD'),
    isClosed: z.boolean().default(true),
    openTime: z.string().regex(timeRegex, 'Hora invalida HH:MM').optional(),
    closeTime: z.string().regex(timeRegex, 'Hora invalida HH:MM').optional(),
    reason: z.string().max(500).optional(),
  })
  .refine(
    (data) => {
      if (!data.isClosed && (!data.openTime || !data.closeTime)) {
        return false
      }
      return true
    },
    {
      message: 'Si el dia no esta cerrado debes indicar openTime y closeTime',
    }
  )
  .refine(
    (data) => {
      if (!data.isClosed && data.openTime && data.closeTime) {
        return timeToMinutes(data.openTime) < timeToMinutes(data.closeTime)
      }
      return true
    },
    {
      message: 'La hora de apertura debe ser menor que la de cierre',
    }
  )

export type CreateClosureInput = z.infer<typeof createClosureSchema>
import { NextRequest, NextResponse } from 'next/server'
import { setBusinessHoursSchema, toBusinessHourDTO } from '@/features/restaurants/restaurants.schema'
import { setBusinessHoursService, getBusinessHoursService } from '@/features/restaurants/restaurants.service'
import { requireAuth } from '@/lib/auth'
import { handleError } from '@/lib/handle-error'
import { minutesToTime } from '@/utils/time'

/**
 * @swagger
 * /restaurants/{id}/hours:
 *   get:
 *     tags: [Restaurants]
 *     summary: Obtener horarios del restaurante
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Horarios de la semana
 *       404:
 *         description: Restaurante no encontrado
 *   put:
 *     tags: [Restaurants]
 *     summary: Establecer horarios del restaurante
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hours:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     dayOfWeek:
 *                       type: string
 *                       enum: [MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY,SUNDAY]
 *                     openTime:
 *                       type: string
 *                       example: "08:00"
 *                     closeTime:
 *                       type: string
 *                       example: "22:00"
 *                     isClosed:
 *                       type: boolean
 *     responses:
 *       200:
 *         description: Horarios actualizados
 *       400:
 *         description: Datos invalidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permiso
 *       404:
 *         description: Restaurante no encontrado
 */

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const hours = await getBusinessHoursService(id)

    // Convertir minutos de vuelta a HH:MM para la respuesta
    const formatted = hours.map((h) => ({
      id: h.id,
      dayOfWeek: h.dayOfWeek,
      openTime: minutesToTime(h.openTimeMin),
      closeTime: minutesToTime(h.closeTimeMin),
      isClosed: h.isClosed,
    }))

    return NextResponse.json({ success: true, data: formatted }, { status: 200 })
  } catch (error) {
    return handleError(error, 'GET /api/v1/restaurants/:id/hours')
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const claims = await requireAuth(req)
    const { id } = await params

    let body: unknown
    try {
      body = await req.json()
    } catch {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_JSON', message: 'JSON invalido' } },
        { status: 400 }
      )
    }

    const parsed = setBusinessHoursSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: parsed.error.issues[0]?.message ?? 'Datos invalidos',
            details: parsed.error.issues,
          },
        },
        { status: 400 }
      )
    }

    // Transformar HH:MM → minutos (conversión en el Route, antes del Service)
    const dtos = parsed.data.hours.map(toBusinessHourDTO)

    const hours = await setBusinessHoursService(id, dtos, claims.sub)

    // Convertir minutos de vuelta a HH:MM para la respuesta
    const formatted = hours.map((h) => ({
      id: h.id,
      dayOfWeek: h.dayOfWeek,
      openTime: minutesToTime(h.openTimeMin),
      closeTime: minutesToTime(h.closeTimeMin),
      isClosed: h.isClosed,
    }))

    return NextResponse.json({ success: true, data: formatted }, { status: 200 })
  } catch (error) {
    return handleError(error, 'PUT /api/v1/restaurants/:id/hours')
  }
}
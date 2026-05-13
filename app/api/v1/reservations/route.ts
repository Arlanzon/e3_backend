import { NextRequest, NextResponse } from 'next/server'
import { createReservationSchema, listReservationsSchema } from '@/features/reservations/reservations.schema'
import { createReservationService, listMyReservationsService } from '@/features/reservations/reservations.service'
import { requireAuth } from '@/lib/auth'
import { handleError } from '@/lib/handle-error'

/**
 * @swagger
 * /reservations:
 *   get:
 *     tags: [Reservations]
 *     summary: Listar mis reservaciones
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING,CONFIRMED,REJECTED,CANCELLED,COMPLETED,EXPIRED]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Lista de reservaciones del usuario
 *       401:
 *         description: No autenticado
 *   post:
 *     tags: [Reservations]
 *     summary: Crear reservacion
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [restaurantId, date, time, numPersons]
 *             properties:
 *               restaurantId:
 *                 type: string
 *                 format: uuid
 *               date:
 *                 type: string
 *                 example: "2026-05-15"
 *               time:
 *                 type: string
 *                 example: "19:00"
 *               numPersons:
 *                 type: integer
 *                 example: 4
 *               notes:
 *                 type: string
 *                 example: "Mesa cerca de la ventana"
 *     responses:
 *       201:
 *         description: Reservacion creada en estado PENDING
 *       400:
 *         description: Datos invalidos o restricciones de horario
 *       401:
 *         description: No autenticado
 *       404:
 *         description: Restaurante no encontrado
 *       409:
 *         description: Sin disponibilidad
 */

export async function GET(req: NextRequest) {
  try {
    const claims = await requireAuth(req)
    const { searchParams } = new URL(req.url)

    const parsed = listReservationsSchema.safeParse({
      status: searchParams.get('status') ?? undefined,
      page:   searchParams.get('page'),
      limit:  searchParams.get('limit'),
    })

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code:    'VALIDATION_ERROR',
            message: parsed.error.issues[0]?.message ?? 'Parametros invalidos',
          },
        },
        { status: 400 }
      )
    }

    const result = await listMyReservationsService(claims.sub, parsed.data)

    return NextResponse.json(
      {
        success: true,
        data:    result.reservations,
        meta: {
          total: result.total,
          page:  result.page,
          limit: result.limit,
          pages: Math.ceil(result.total / result.limit),
        },
      },
      { status: 200 }
    )
  } catch (error) {
    return handleError(error, 'GET /api/v1/reservations')
  }
}

export async function POST(req: NextRequest) {
  try {
    const claims = await requireAuth(req)

    let body: unknown
    try {
      body = await req.json()
    } catch {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_JSON', message: 'JSON invalido' } },
        { status: 400 }
      )
    }

    const parsed = createReservationSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code:    'VALIDATION_ERROR',
            message: parsed.error.issues[0]?.message ?? 'Datos invalidos',
            details: parsed.error.issues,
          },
        },
        { status: 400 }
      )
    }

    const reservation = await createReservationService(parsed.data, claims.sub)
    return NextResponse.json({ success: true, data: reservation }, { status: 201 })
  } catch (error) {
    return handleError(error, 'POST /api/v1/reservations')
  }
}
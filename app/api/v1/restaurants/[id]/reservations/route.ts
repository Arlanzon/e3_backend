import { NextRequest, NextResponse } from 'next/server'
import { listReservationsSchema } from '@/features/reservations/reservations.schema'
import { listRestaurantReservationsService } from '@/features/reservations/reservations.service'
import { requireAuth } from '@/lib/auth'
import { handleError } from '@/lib/handle-error'

/**
 * @swagger
 * /restaurants/{id}/reservations:
 *   get:
 *     tags: [Restaurants]
 *     summary: Listar reservaciones del restaurante
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
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
 *         description: Lista de reservaciones del restaurante
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
    const claims = await requireAuth(req)
    const { id } = await params
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

    const result = await listRestaurantReservationsService(
      id,
      claims.sub,
      parsed.data
    )

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
    return handleError(error, 'GET /api/v1/restaurants/:id/reservations')
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { createReviewSchema } from '@/features/reviews/reviews.schema'
import { createReviewService } from '@/features/reviews/reviews.service'
import { requireAuth } from '@/lib/auth'
import { handleError } from '@/lib/handle-error'

/**
 * @swagger
 * /reviews:
 *   post:
 *     tags: [Reviews]
 *     summary: Crear resena
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [reservationId, rating]
 *             properties:
 *               reservationId:
 *                 type: string
 *                 format: uuid
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: "Excelente comida y servicio"
 *     responses:
 *       201:
 *         description: Resena creada
 *       400:
 *         description: Reservacion no completada o ventana expirada
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permiso
 *       404:
 *         description: Reservacion no encontrada
 *       409:
 *         description: Ya existe una resena para esta reservacion
 */

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

    const parsed = createReviewSchema.safeParse(body)
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

    const review = await createReviewService(parsed.data, claims.sub)
    return NextResponse.json({ success: true, data: review }, { status: 201 })
  } catch (error) {
    return handleError(error, 'POST /api/v1/reviews')
  }
}
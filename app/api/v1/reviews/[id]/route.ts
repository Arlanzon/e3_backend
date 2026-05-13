import { NextRequest, NextResponse } from 'next/server'
import { updateReviewSchema } from '@/features/reviews/reviews.schema'
import { updateReviewService } from '@/features/reviews/reviews.service'
import { requireAuth } from '@/lib/auth'
import { handleError } from '@/lib/handle-error'

/**
 * @swagger
 * /reviews/{id}:
 *   patch:
 *     tags: [Reviews]
 *     summary: Editar resena propia dentro de 7 dias
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
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Resena actualizada
 *       400:
 *         description: Periodo de edicion expirado
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permiso
 *       404:
 *         description: Resena no encontrada
 */

export async function PATCH(
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

    const parsed = updateReviewSchema.safeParse(body)
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

    const review = await updateReviewService(id, parsed.data, claims.sub)
    return NextResponse.json({ success: true, data: review }, { status: 200 })
  } catch (error) {
    return handleError(error, 'PATCH /api/v1/reviews/:id')
  }
}
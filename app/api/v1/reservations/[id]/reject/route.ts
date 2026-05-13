import { NextRequest, NextResponse } from 'next/server'
import { rejectReservationSchema } from '@/features/reservations/reservations.schema'
import { rejectReservationService } from '@/features/reservations/reservations.service'
import { requireAuth } from '@/lib/auth'
import { handleError } from '@/lib/handle-error'

/**
 * @swagger
 * /reservations/{id}/reject:
 *   patch:
 *     tags: [Reservations]
 *     summary: Rechazar reservacion pendiente
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
 *             required: [rejectionReason]
 *             properties:
 *               rejectionReason:
 *                 type: string
 *                 example: "No tenemos mesa disponible para ese horario"
 *     responses:
 *       200:
 *         description: Reservacion rechazada
 *       400:
 *         description: Estado invalido o motivo faltante
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permiso
 *       404:
 *         description: Reservacion no encontrada
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

    const parsed = rejectReservationSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code:    'VALIDATION_ERROR',
            message: parsed.error.issues[0]?.message ?? 'Datos invalidos',
          },
        },
        { status: 400 }
      )
    }

    const reservation = await rejectReservationService(id, claims.sub, parsed.data)
    return NextResponse.json({ success: true, data: reservation }, { status: 200 })
  } catch (error) {
    return handleError(error, 'PATCH /api/v1/reservations/:id/reject')
  }
}
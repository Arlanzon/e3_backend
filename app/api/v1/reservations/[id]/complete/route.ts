import { NextRequest, NextResponse } from 'next/server'
import { completeReservationService } from '@/features/reservations/reservations.service'
import { requireAuth } from '@/lib/auth'
import { handleError } from '@/lib/handle-error'

/**
 * @swagger
 * /reservations/{id}/complete:
 *   patch:
 *     tags: [Reservations]
 *     summary: Marcar reservacion confirmada como completada
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Reservacion completada
 *       400:
 *         description: Estado invalido
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
    const reservation = await completeReservationService(id, claims.sub)
    return NextResponse.json({ success: true, data: reservation }, { status: 200 })
  } catch (error) {
    return handleError(error, 'PATCH /api/v1/reservations/:id/complete')
  }
}

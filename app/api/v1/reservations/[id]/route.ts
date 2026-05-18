import { NextRequest, NextResponse } from 'next/server'
import { getReservationService } from '@/features/reservations/reservations.service'
import { requireAuth } from '@/lib/auth'
import { handleError } from '@/lib/handle-error'

/**
 * @swagger
 * /reservations/{id}:
 *   get:
 *     tags: [Reservations]
 *     summary: Ver detalle de una reservacion
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
 *         description: Detalle de la reservacion
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permiso
 *       404:
 *         description: Reservacion no encontrada
 */

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const claims = await requireAuth(req)
    const { id } = await params
    const reservation = await getReservationService(id, claims.sub)
    return NextResponse.json({ success: true, data: reservation }, { status: 200 })
  } catch (error) {
    return handleError(error, 'GET /api/v1/reservations/:id')
  }
}
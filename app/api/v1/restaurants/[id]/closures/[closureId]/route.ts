import { NextRequest, NextResponse } from 'next/server'
import { deleteClosureService } from '@/features/restaurants/restaurants.service'
import { requireAuth } from '@/lib/auth'
import { handleError } from '@/lib/handle-error'

/**
 * @swagger
 * /restaurants/{id}/closures/{closureId}:
 *   delete:
 *     tags: [Restaurants]
 *     summary: Eliminar cierre especial
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: closureId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Cierre eliminado
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permiso
 *       404:
 *         description: Cierre no encontrado
 */

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; closureId: string }> }
) {
  try {
    const claims = await requireAuth(req)
    const { id, closureId } = await params

    await deleteClosureService(id, closureId, claims.sub)

    return NextResponse.json(
      {
        success: true,
        data: { message: 'Cierre eliminado correctamente' },
      },
      { status: 200 }
    )
  } catch (error) {
    return handleError(error, 'DELETE /api/v1/restaurants/:id/closures/:closureId')
  }
}
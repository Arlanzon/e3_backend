import { NextRequest, NextResponse } from 'next/server'
import { updatePhotoSchema } from '@/features/restaurants/photos.schema'
import {
  deletePhotoService,
  updatePhotoService,
} from '@/features/restaurants/restaurants.service'
import { requireAuth } from '@/lib/auth'
import { handleError } from '@/lib/handle-error'

/**
 * @swagger
 * /restaurants/{id}/photos/{photoId}:
 *   patch:
 *     tags: [Restaurants]
 *     summary: Actualizar foto del restaurante
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
 *         name: photoId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isPrimary:
 *                 type: boolean
 *               order:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Foto actualizada
 *       400:
 *         description: Datos invalidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permiso
 *       404:
 *         description: Foto no encontrada
 *   delete:
 *     tags: [Restaurants]
 *     summary: Eliminar foto del restaurante
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
 *         name: photoId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Foto eliminada
 *       400:
 *         description: No se puede eliminar la unica foto del restaurante
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permiso
 *       404:
 *         description: Foto no encontrada
 */

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; photoId: string }> }
) {
  try {
    const claims = await requireAuth(req)
    const { id, photoId } = await params

    let body: unknown
    try {
      body = await req.json()
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'INVALID_JSON', message: 'JSON invalido' },
        },
        { status: 400 }
      )
    }

    const parsed = updatePhotoSchema.safeParse(body)

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

    const photo = await updatePhotoService(id, photoId, parsed.data, claims.sub)

    return NextResponse.json({ success: true, data: photo }, { status: 200 })
  } catch (error) {
    return handleError(error, 'PATCH /api/v1/restaurants/:id/photos/:photoId')
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; photoId: string }> }
) {
  try {
    const claims = await requireAuth(req)
    const { id, photoId } = await params

    await deletePhotoService(id, photoId, claims.sub)

    return NextResponse.json(
      {
        success: true,
        data: { message: 'Foto eliminada correctamente' },
      },
      { status: 200 }
    )
  } catch (error) {
    return handleError(error, 'DELETE /api/v1/restaurants/:id/photos/:photoId')
  }
}
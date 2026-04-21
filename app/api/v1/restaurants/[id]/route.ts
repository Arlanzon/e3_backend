import { NextRequest, NextResponse } from 'next/server'
import { updateRestaurantSchema } from '@/features/restaurants/restaurants.schema'
import { getRestaurantService, updateRestaurantService } from '@/features/restaurants/restaurants.service'
import { requireAuth } from '@/lib/auth'
import { handleError } from '@/lib/handle-error'

/**
 * @swagger
 * /restaurants/{id}:
 *   get:
 *     tags: [Restaurants]
 *     summary: Obtener restaurante por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Datos del restaurante
 *       404:
 *         description: Restaurante no encontrado
 *   patch:
 *     tags: [Restaurants]
 *     summary: Actualizar restaurante
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
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Restaurant'
 *     responses:
 *       200:
 *         description: Restaurante actualizado
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
    const restaurant = await getRestaurantService(id)

    return NextResponse.json(
      { success: true, data: restaurant },
      { status: 200 }
    )
  } catch (error) {
    return handleError(error, 'GET /api/v1/restaurants/:id')
  }
}

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
        {
          success: false,
          error: { code: 'INVALID_JSON', message: 'JSON inválido' },
        },
        { status: 400 }
      )
    }

    const parsed = updateRestaurantSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: parsed.error.issues[0]?.message ?? 'Datos inválidos',
            details: parsed.error.issues,
          },
        },
        { status: 400 }
      )
    }

    const restaurant = await updateRestaurantService(id, parsed.data, claims.sub)

    return NextResponse.json(
      { success: true, data: restaurant },
      { status: 200 }
    )
  } catch (error) {
    return handleError(error, 'PATCH /api/v1/restaurants/:id')
  }
}
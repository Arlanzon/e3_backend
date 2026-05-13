import { NextRequest, NextResponse } from 'next/server'
import { createResponseSchema, updateResponseSchema } from '@/features/reviews/reviews.schema'
import { createResponseService, updateResponseService } from '@/features/reviews/reviews.service'
import { requireAuth } from '@/lib/auth'
import { handleError } from '@/lib/handle-error'

/**
 * @swagger
 * /reviews/{id}/response:
 *   post:
 *     tags: [Reviews]
 *     summary: Responder resena como propietario o encargado
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
 *             required: [content]
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Gracias por tu visita, esperamos verte pronto"
 *     responses:
 *       201:
 *         description: Respuesta creada
 *       400:
 *         description: Resena no visible
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permiso
 *       404:
 *         description: Resena no encontrada
 *       409:
 *         description: Ya existe una respuesta
 *   patch:
 *     tags: [Reviews]
 *     summary: Editar respuesta existente
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
 *             required: [content]
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Respuesta actualizada
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permiso
 *       404:
 *         description: Resena o respuesta no encontrada
 */

export async function POST(
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

    const parsed = createResponseSchema.safeParse(body)
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

    const response = await createResponseService(id, parsed.data, claims.sub)
    return NextResponse.json({ success: true, data: response }, { status: 201 })
  } catch (error) {
    return handleError(error, 'POST /api/v1/reviews/:id/response')
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
        { success: false, error: { code: 'INVALID_JSON', message: 'JSON invalido' } },
        { status: 400 }
      )
    }

    const parsed = updateResponseSchema.safeParse(body)
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

    const response = await updateResponseService(id, parsed.data, claims.sub)
    return NextResponse.json({ success: true, data: response }, { status: 200 })
  } catch (error) {
    return handleError(error, 'PATCH /api/v1/reviews/:id/response')
  }
}
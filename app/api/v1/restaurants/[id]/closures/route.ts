import { NextRequest, NextResponse } from 'next/server'
import { createClosureSchema } from '@/features/restaurants/closures.schema'
import {
  createClosureService,
  getClosuresService,
} from '@/features/restaurants/restaurants.service'
import { requireAuth } from '@/lib/auth'
import { handleError } from '@/lib/handle-error'
import { minutesToTime } from '@/utils/time'

/**
 * @swagger
 * /restaurants/{id}/closures:
 *   get:
 *     tags: [Restaurants]
 *     summary: Listar cierres especiales del restaurante
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
 *         description: Lista de cierres especiales
 *       401:
 *         description: No autenticado
 *       404:
 *         description: Restaurante no encontrado
 *   post:
 *     tags: [Restaurants]
 *     summary: Registrar cierre especial
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
 *             required: [date]
 *             properties:
 *               date:
 *                 type: string
 *                 example: "2026-12-25"
 *               isClosed:
 *                 type: boolean
 *                 default: true
 *               openTime:
 *                 type: string
 *                 example: "10:00"
 *               closeTime:
 *                 type: string
 *                 example: "18:00"
 *               reason:
 *                 type: string
 *                 example: "Dia festivo"
 *     responses:
 *       201:
 *         description: Cierre registrado
 *       400:
 *         description: Datos invalidos o fecha en el pasado
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permiso
 *       409:
 *         description: Ya existe cierre para esa fecha
 */

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(req)

    const { id } = await params
    const closures = await getClosuresService(id)

    type ClosureItem = Awaited<ReturnType<typeof getClosuresService>>[number]

    const formatted = closures.map((c: ClosureItem) => ({
      id: c.id,
      date: c.date,
      isClosed: c.isClosed,
      openTime: c.openTimeMin != null ? minutesToTime(c.openTimeMin) : null,
      closeTime: c.closeTimeMin != null ? minutesToTime(c.closeTimeMin) : null,
      reason: c.reason,
      createdAt: c.createdAt,
    }))

    return NextResponse.json({ success: true, data: formatted }, { status: 200 })
  } catch (error) {
    return handleError(error, 'GET /api/v1/restaurants/:id/closures')
  }
}

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
        {
          success: false,
          error: { code: 'INVALID_JSON', message: 'JSON invalido' },
        },
        { status: 400 }
      )
    }

    const parsed = createClosureSchema.safeParse(body)

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

    const closure = await createClosureService(id, parsed.data, claims.sub)

    return NextResponse.json({ success: true, data: closure }, { status: 201 })
  } catch (error) {
    return handleError(error, 'POST /api/v1/restaurants/:id/closures')
  }
}

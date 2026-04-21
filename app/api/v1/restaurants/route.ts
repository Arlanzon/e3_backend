import { NextRequest, NextResponse } from 'next/server'
import { createRestaurantSchema, listRestaurantsSchema } from '@/features/restaurants/restaurants.schema'
import { createRestaurantService, listRestaurantsService } from '@/features/restaurants/restaurants.service'
import { requireAuth, requireRole } from '@/lib/auth'
import { handleError } from '@/lib/handle-error'

/**
 * @swagger
 * /restaurants:
 *   get:
 *     tags: [Restaurants]
 *     summary: Listar restaurantes activos
 *     parameters:
 *       - in: query
 *         name: cuisine
 *         schema:
 *           type: string
 *         description: Filtrar por tipo de cocina
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Lista de restaurantes con paginacion
 *   post:
 *     tags: [Restaurants]
 *     summary: Crear nuevo restaurante
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Restaurant'
 *     responses:
 *       201:
 *         description: Restaurante creado
 *       401:
 *         description: No autenticado
 *       409:
 *         description: Slug ya en uso
 */

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const parsed = listRestaurantsSchema.safeParse({
    cuisine: searchParams.get('cuisine') || undefined,
    status: searchParams.get('status') || undefined,
    page: searchParams.get('page') || undefined,
    limit: searchParams.get('limit') || undefined,
    })

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: parsed.error.issues[0]?.message ?? 'Parámetros inválidos',
          },
        },
        { status: 400 }
      )
    }

    const result = await listRestaurantsService(parsed.data)

    return NextResponse.json(
      {
        success: true,
        data: result.restaurants,
        meta: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          pages: Math.ceil(result.total / result.limit),
        },
      },
      { status: 200 }
    )
  } catch (error) {
    return handleError(error, 'GET /api/v1/restaurants')
  }
}

export async function POST(req: NextRequest) {
  try {
    const claims = await requireAuth(req)

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

    const parsed = createRestaurantSchema.safeParse(body)
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

    const restaurant = await createRestaurantService(parsed.data, claims.sub)

    return NextResponse.json(
      { success: true, data: restaurant },
      { status: 201 }
    )
  } catch (error) {
    return handleError(error, 'POST /api/v1/restaurants')
  }
}
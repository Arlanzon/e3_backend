import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { listReviewsService } from '@/features/reviews/reviews.service'
import { handleError } from '@/lib/handle-error'

const listReviewsQuerySchema = z.object({
  page:  z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
})

/**
 * @swagger
 * /restaurants/{id}/reviews:
 *   get:
 *     tags: [Reviews]
 *     summary: Listar resenas visibles del restaurante
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
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
 *         description: Lista de resenas visibles
 *       400:
 *         description: Parametros invalidos
 *       404:
 *         description: Restaurante no encontrado
 */

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(req.url)

    const parsed = listReviewsQuerySchema.safeParse({
      page:  searchParams.get('page'),
      limit: searchParams.get('limit'),
    })

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code:    'VALIDATION_ERROR',
            message: parsed.error.issues[0]?.message ?? 'Parametros invalidos',
          },
        },
        { status: 400 }
      )
    }

    const result = await listReviewsService(id, parsed.data.page, parsed.data.limit)

    return NextResponse.json(
      {
        success: true,
        data:    result.reviews,
        meta: {
          total: result.total,
          page:  result.page,
          limit: result.limit,
          pages: Math.ceil(result.total / result.limit),
        },
      },
      { status: 200 }
    )
  } catch (error) {
    return handleError(error, 'GET /api/v1/restaurants/:id/reviews')
  }
}

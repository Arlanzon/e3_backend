import { NextRequest, NextResponse } from 'next/server'
import { createPhotoSchema } from '@/features/restaurants/photos.schema'
import {
  createPhotoService,
  getPhotosService,
} from '@/features/restaurants/restaurants.service'
import { requireAuth } from '@/lib/auth'
import { handleError } from '@/lib/handle-error'

/**
 * @swagger
 * /restaurants/{id}/photos:
 *   get:
 *     tags: [Restaurants]
 *     summary: Listar fotos del restaurante
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Lista de fotos
 *       404:
 *         description: Restaurante no encontrado
 *   post:
 *     tags: [Restaurants]
 *     summary: Agregar foto al restaurante
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
 *             required: [url]
 *             properties:
 *               url:
 *                 type: string
 *                 example: "https://res.cloudinary.com/demo/image/upload/sample.jpg"
 *               isPrimary:
 *                 type: boolean
 *                 default: false
 *               order:
 *                 type: integer
 *                 default: 0
 *     responses:
 *       201:
 *         description: Foto agregada
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permiso
 */

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const photos = await getPhotosService(id)

    return NextResponse.json({ success: true, data: photos }, { status: 200 })
  } catch (error) {
    return handleError(error, 'GET /api/v1/restaurants/:id/photos')
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

    const parsed = createPhotoSchema.safeParse(body)

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

    const photo = await createPhotoService(id, parsed.data, claims.sub)

    return NextResponse.json({ success: true, data: photo }, { status: 201 })
  } catch (error) {
    return handleError(error, 'POST /api/v1/restaurants/:id/photos')
  }
}
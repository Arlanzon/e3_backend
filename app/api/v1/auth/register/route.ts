import { NextRequest, NextResponse } from 'next/server'
import { registerSchema } from '@/features/users/users.schema'
import { registerUser } from '@/features/users/users.service'
import { handleError } from '@/lib/handle-error'

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Registrar nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Fernando Arlanzon
 *               email:
 *                 type: string
 *                 format: email
 *                 example: fernando@test.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: "12345678"
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Datos invalidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Email ya registrado
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const parsed = registerSchema.safeParse(body)
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

    const user = await registerUser(parsed.data)

    return NextResponse.json({ success: true, data: user }, { status: 201 })
  } catch (error) {
    return handleError(error, 'POST /api/v1/auth/register')
  }
}
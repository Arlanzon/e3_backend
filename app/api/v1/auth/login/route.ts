import { NextRequest, NextResponse } from 'next/server'
import { loginSchema } from '@/features/users/users.schema'
import { validateCredentials } from '@/features/users/users.service'
import { signToken } from '@/lib/jwt'
import { handleError } from '@/lib/handle-error'

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Iniciar sesion
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: fernando@test.com
 *               password:
 *                 type: string
 *                 example: "12345678"
 *     responses:
 *       200:
 *         description: Login exitoso — devuelve token JWT
 *       401:
 *         description: Credenciales incorrectas
 *       403:
 *         description: Cuenta desactivada
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const parsed = loginSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: parsed.error.issues[0]?.message ?? 'Datos inválidos',
          },
        },
        { status: 400 }
      )
    }

    const user = await validateCredentials(parsed.data)

    const token = await signToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    })

    return NextResponse.json(
      {
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        },
      },
      { status: 200 }
    )
  } catch (error) {
    return handleError(error, 'POST /api/v1/auth/login')
  }
}
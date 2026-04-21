import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getUserById } from '@/features/users/users.service'
import { handleError } from '@/lib/handle-error'

/**
 * @swagger
 * /users/me:
 *   get:
 *     tags: [Users]
 *     summary: Obtener perfil del usuario autenticado desde BD
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos actuales del usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Cuenta desactivada
 *       404:
 *         description: Usuario no encontrado
 */

export async function GET(req: NextRequest) {
  try {
    const claims = await requireAuth(req)
    const user = await getUserById(claims.sub)
    return NextResponse.json({ success: true, data: user }, { status: 200 })
  } catch (error) {
    return handleError(error, 'GET /api/v1/users/me')
  }
}
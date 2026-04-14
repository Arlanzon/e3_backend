import { NextRequest, NextResponse } from 'next/server'
import { loginSchema } from '@/features/users/users.schema'
import { validateCredentials } from '@/features/users/users.service'
import { signToken } from '@/lib/jwt'
import { handleError } from '@/lib/handle-error'

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
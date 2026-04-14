import { NextRequest, NextResponse } from 'next/server'
import { registerSchema } from '@/features/users/users.schema'
import { registerUser } from '@/features/users/users.service'
import { handleError } from '@/lib/handle-error'

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
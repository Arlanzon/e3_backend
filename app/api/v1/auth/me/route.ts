import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { handleError } from '@/lib/handle-error'

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req)

    return NextResponse.json(
      {
        success: true,
        data: user,
      },
      { status: 200 }
    )
  } catch (error) {
    return handleError(error, 'GET /api/v1/auth/me')
  }
}
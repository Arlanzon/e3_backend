import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getUserById } from '@/features/users/users.service'
import { handleError } from '@/lib/handle-error'

export async function GET(req: NextRequest) {
  try {
    const claims = await requireAuth(req)
    const user = await getUserById(claims.sub)
    return NextResponse.json({ success: true, data: user }, { status: 200 })
  } catch (error) {
    return handleError(error, 'GET /api/v1/users/me')
  }
}
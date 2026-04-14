import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { handleError } from '@/lib/handle-error'

export async function GET(req: NextRequest) {
  try {
    await requireRole(req, ['ADMIN'])

    // TODO: implementar listado de usuarios
    return NextResponse.json({ success: true, data: [] }, { status: 200 })
  } catch (error) {
    return handleError(error, 'GET /api/v1/users')
  }
}

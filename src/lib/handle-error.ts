import { NextResponse } from 'next/server'
import { isAppError } from '@/lib/errors'

export function handleError(error: unknown, context: string) {
  if (isAppError(error)) {
    return NextResponse.json(
      { success: false, error: { code: error.code, message: error.message } },
      { status: error.statusCode }
    )
  }

  console.error(`[${context}]`, error)
  return NextResponse.json(
    { success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno del servidor' } },
    { status: 500 }
  )
}
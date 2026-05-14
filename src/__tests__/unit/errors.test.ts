import { describe, expect, it } from 'vitest'

import { AppError, isAppError } from '@/lib/errors'

describe('AppError', () => {
  it('preserves code, message, and statusCode', () => {
    const error = new AppError('INVALID_INPUT', 'Invalid input', 422)

    expect(error.code).toBe('INVALID_INPUT')
    expect(error.message).toBe('Invalid input')
    expect(error.statusCode).toBe(422)
  })

  it('uses 400 as the default statusCode', () => {
    const error = new AppError('BAD_REQUEST', 'Bad request')

    expect(error.statusCode).toBe(400)
  })

  it('identifies AppError instances', () => {
    expect(isAppError(new AppError('BAD_REQUEST', 'Bad request'))).toBe(true)
    expect(isAppError(new Error('Bad request'))).toBe(false)
  })
})

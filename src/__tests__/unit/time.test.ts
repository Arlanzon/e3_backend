import { describe, expect, it } from 'vitest'

import { minutesToTime, timeToMinutes } from '@/utils/time'

describe('time utilities', () => {
  it('converts HH:mm strings to minutes', () => {
    expect(timeToMinutes('08:00')).toBe(480)
    expect(timeToMinutes('00:00')).toBe(0)
    expect(timeToMinutes('23:59')).toBe(1439)
  })

  it('converts minutes to HH:mm strings', () => {
    expect(minutesToTime(480)).toBe('08:00')
    expect(minutesToTime(0)).toBe('00:00')
    expect(minutesToTime(1439)).toBe('23:59')
  })
})

import { describe, it, expect } from 'vitest'
import { TrafficRowSchema } from '@/lib/schemas/trafficRow'

describe('Traffic Row Normalization', () => {
  it('should validate a complete traffic row', () => {
    const validRow = {
      station: 'WXYZ-TV Boston',
      platform_type: 'TV',
      market: 'Boston',
      isci: 'ABCD1234',
      creative_title: 'Summer Sale :30',
      length_secs: 30,
      flight_start: new Date('2024-06-01'),
      flight_end: new Date('2024-08-31'),
      rotations: 'M-F 6a-10a, Sa-Su 10a-5p',
      additional_notes: 'Priority placement requested',
    }

    const result = TrafficRowSchema.safeParse(validRow)
    expect(result.success).toBe(true)
  })

  it('should extract length from creative title', () => {
    const title = 'Summer Sale :30'
    const length = extractLengthFromTitle(title)
    expect(length).toBe(30)
  })

  it('should handle missing optional fields', () => {
    const row = {
      station: 'WXYZ-TV Boston',
      platform_type: 'TV',
      market: 'Boston',
      isci: 'ABCD1234',
      creative_title: 'Summer Sale :30',
      length_secs: 30,
      flight_start: new Date('2024-06-01'),
      flight_end: new Date('2024-08-31'),
      rotations: 'M-F 6a-10a, Sa-Su 10a-5p',
    }

    const result = TrafficRowSchema.safeParse(row)
    expect(result.success).toBe(true)
  })

  it('should reject invalid platform types', () => {
    const row = {
      station: 'WXYZ-TV Boston',
      platform_type: 'Invalid',
      market: 'Boston',
      isci: 'ABCD1234',
      creative_title: 'Summer Sale :30',
      length_secs: 30,
      flight_start: new Date('2024-06-01'),
      flight_end: new Date('2024-08-31'),
      rotations: 'M-F 6a-10a, Sa-Su 10a-5p',
    }

    const result = TrafficRowSchema.safeParse(row)
    expect(result.success).toBe(false)
  })

  it('should reject invalid date formats', () => {
    const row = {
      station: 'WXYZ-TV Boston',
      platform_type: 'TV',
      market: 'Boston',
      isci: 'ABCD1234',
      creative_title: 'Summer Sale :30',
      length_secs: 30,
      flight_start: 'invalid-date',
      flight_end: new Date('2024-08-31'),
      rotations: 'M-F 6a-10a, Sa-Su 10a-5p',
    }

    const result = TrafficRowSchema.safeParse(row)
    expect(result.success).toBe(false)
  })
}) 
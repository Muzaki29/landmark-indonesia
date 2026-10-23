import { describe, expect, it } from 'vitest'
import { MONAS_CONFIG, MONAS_LEVELS } from './config'

describe('Monas proportions', () => {
  it('preserves the verified 132 metre total height at model scale', () => {
    expect(MONAS_CONFIG.totalHeight).toBeCloseTo(13.2)
    expect(MONAS_LEVELS.flameCenter + MONAS_CONFIG.flameHeight / 2).toBeCloseTo(13.2)
  })

  it('keeps the shaft above the cup platform', () => {
    expect(MONAS_LEVELS.shaftHeight).toBeGreaterThan(9)
    expect(MONAS_LEVELS.shaftBottom).toBe(MONAS_CONFIG.cupTopHeight)
  })
})

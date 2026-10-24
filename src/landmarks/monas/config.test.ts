import { describe, expect, it } from 'vitest'
import { MONAS_CONFIG, MONAS_LEVELS, WORLD_SCALE } from './config'
import heritageModel from '../../../tools/heritage_pipeline/data/monas/heritage-model.json'

describe('Monas proportions', () => {
  it('preserves the verified 132 metre total height at model scale', () => {
    expect(MONAS_CONFIG.totalHeight).toBeCloseTo(13.2)
    expect(MONAS_LEVELS.flameCenter + MONAS_CONFIG.flameHeight / 2).toBeCloseTo(13.2)
  })

  it('keeps the shaft above the cup platform', () => {
    expect(MONAS_LEVELS.shaftHeight).toBeGreaterThan(9)
    expect(MONAS_LEVELS.shaftBottom).toBe(MONAS_CONFIG.cupTopHeight)
  })

  it('keeps the Python interchange aligned with the accepted scene config', () => {
    const dimensions = heritageModel.dimensions
    expect(dimensions.totalHeight.value).toBeCloseTo(MONAS_CONFIG.totalHeight / WORLD_SCALE)
    expect(dimensions.museumWidth.value).toBeCloseTo(MONAS_CONFIG.museumWidth / WORLD_SCALE)
    expect(dimensions.museumHeight.value).toBeCloseTo(MONAS_CONFIG.museumHeight / WORLD_SCALE)
    expect(dimensions.flameHeight.value).toBeCloseTo(MONAS_CONFIG.flameHeight / WORLD_SCALE)
    expect(dimensions.flameWidth.value).toBeCloseTo(MONAS_CONFIG.flameWidth / WORLD_SCALE)
    expect(dimensions.observationWidth.value).toBeCloseTo(MONAS_CONFIG.observationWidth / WORLD_SCALE)
  })
})

import { describe, expect, it } from 'vitest'
import { getProvinces } from './heritage'
import { getHeritageTour } from './tours'

describe('heritage tours', () => {
  it('builds source-backed tours for all active landmarks', () => {
    for (const { landmark } of getProvinces('en')) {
      const tour = getHeritageTour(landmark, 'en')
      expect(tour.steps.length).toBeGreaterThanOrEqual(5)
      for (const step of tour.steps) {
        expect(step.claimIds.length).toBeGreaterThan(0)
        expect(step.sourceIds.length).toBeGreaterThan(0)
        expect(step.sourceIds.every((id) => landmark.sources.some((source) => source.id === id && source.status === 'verified'))).toBe(true)
      }
    }
  })

  it('offers blueprint storytelling only where capability exists', () => {
    const tours = getProvinces('en').map(({ landmark }) => getHeritageTour(landmark, 'en'))
    expect(tours[0].steps.some(({ displayMode }) => displayMode === 'blueprint')).toBe(true)
    expect(tours.slice(1).every((tour) => tour.steps.every(({ displayMode }) => displayMode !== 'blueprint'))).toBe(true)
  })
})

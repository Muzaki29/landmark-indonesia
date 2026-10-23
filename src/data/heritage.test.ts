import { describe, expect, it } from 'vitest'
import { furtherReadings, provinces } from './heritage'

describe('heritage collection data', () => {
  it('contains exactly three landmark provinces', () => {
    expect(provinces).toHaveLength(3)
    expect(provinces.map(({ landmark }) => landmark.slug)).toEqual(['monas', 'tugu-pal-putih', 'jam-gadang'])
  })

  it('keeps every factual claim linked to a verified source in its landmark', () => {
    for (const { landmark } of provinces) {
      const verifiedIds = new Set(landmark.sources.filter(({ status }) => status === 'verified').map(({ id }) => id))
      const claims = [
        { sourceIds: landmark.overviewSourceIds },
        ...landmark.history,
        ...landmark.architecture,
        ...landmark.culturalContext,
        ...landmark.timeline,
        ...landmark.facts,
      ]
      expect(landmark.sources.every(({ url }) => url.startsWith('https://'))).toBe(true)
      expect(claims.every(({ sourceIds }) => sourceIds.length > 0 && sourceIds.every((id) => verifiedIds.has(id)))).toBe(true)
    }
  })

  it('keeps one landmark-specific academic reading per landmark', () => {
    expect(furtherReadings).toHaveLength(3)
    expect(new Set(furtherReadings.map(({ landmarkId }) => landmarkId))).toEqual(new Set(provinces.map(({ landmark }) => landmark.id)))
    expect(furtherReadings.every(({ status, url }) => status === 'further-reading' && url.startsWith('https://'))).toBe(true)
  })
})

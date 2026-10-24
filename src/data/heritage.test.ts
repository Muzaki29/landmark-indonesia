import { describe, expect, it } from 'vitest'
import { furtherReadings, getClaims, getSourcesForClaims, provinces, searchLandmarks } from './heritage'

describe('heritage collection data', () => {
  it('contains exactly three landmark provinces', () => {
    expect(provinces).toHaveLength(3)
    expect(provinces.map(({ landmark }) => landmark.slug)).toEqual(['monas', 'tugu-pal-putih', 'jam-gadang'])
  })

  it('keeps every factual claim linked to a verified source in its landmark', () => {
    for (const { landmark } of provinces) {
      const verifiedIds = new Set(landmark.sources.filter(({ status }) => status === 'verified').map(({ id }) => id))
      const claims = getClaims(landmark)
      expect(landmark.sources.every(({ url }) => url.startsWith('https://'))).toBe(true)
      expect(claims.every(({ sourceIds }) => sourceIds.length > 0 && sourceIds.every((id) => verifiedIds.has(id)))).toBe(true)
      expect(landmark.hotspots.every(({ claimIds }) => getSourcesForClaims(landmark, claimIds).length > 0)).toBe(true)
      expect(landmark.relations.every(({ claimIds }) => getSourcesForClaims(landmark, claimIds).length > 0)).toBe(true)
    }
  })

  it('keeps landmark readings and the unchecked Prijotomo bibliography separate from evidence', () => {
    const landmarkReadings = furtherReadings.filter(({ landmarkId }) => landmarkId)
    expect(landmarkReadings).toHaveLength(3)
    expect(new Set(landmarkReadings.map(({ landmarkId }) => landmarkId))).toEqual(new Set(provinces.map(({ landmark }) => landmark.id)))
    expect(landmarkReadings.every(({ status, url }) => status === 'further-reading' && url?.startsWith('https://'))).toBe(true)
    const uncheckedCollectionReading = furtherReadings.find(({ id }) => id.startsWith('prijotomo'))
    expect(uncheckedCollectionReading).toMatchObject({ status: 'further-reading' })
    expect(uncheckedCollectionReading?.landmarkId).toBeUndefined()
  })

  it('searches verified collection metadata without creating placeholder landmarks', () => {
    expect(searchLandmarks('Bukittinggi').map(({ landmark }) => landmark.slug)).toEqual(['jam-gadang'])
    expect(searchLandmarks('obelisk').map(({ landmark }) => landmark.slug)).toEqual(['monas'])
    expect(searchLandmarks('not in collection')).toEqual([])
  })
})

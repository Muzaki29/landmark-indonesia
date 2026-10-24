import { describe, expect, it } from 'vitest'
import { furtherReadings, getClaims, getFurtherReadings, getProvinces, getSourcesForClaims, provinces, searchLandmarks } from './heritage'
import { indonesianLandmarkCopy } from './heritage.id'

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
    const expected = {
      Monas: 'monas', Jakarta: 'monas', Tugu: 'tugu-pal-putih', Yogyakarta: 'tugu-pal-putih',
      'Jam Gadang': 'jam-gadang', Bukittinggi: 'jam-gadang', 'Sumatera Barat': 'jam-gadang', obelisk: 'monas',
    }
    for (const [query, slug] of Object.entries(expected)) {
      expect(searchLandmarks(query).map(({ landmark }) => landmark.slug)).toEqual([slug])
    }
    expect(searchLandmarks('not in collection')).toEqual([])
  })

  it('composes province filtering with search without duplicating results', () => {
    const yogyakarta = provinces.filter(({ id }) => id === 'province-yogyakarta')
    expect(searchLandmarks('Tugu', yogyakarta).map(({ landmark }) => landmark.slug)).toEqual(['tugu-pal-putih'])
    expect(searchLandmarks('Monas', yogyakarta)).toEqual([])
  })

  it('keeps Indonesian content complete and attached to the same evidence', () => {
    const localized = getProvinces('id')
    for (const [index, province] of provinces.entries()) {
      const landmark = province.landmark
      const copy = indonesianLandmarkCopy[landmark.slug]
      const requiredIds = [...landmark.history, ...landmark.architecture, ...landmark.culturalContext, ...landmark.timeline, ...landmark.facts, ...landmark.hotspots, ...landmark.relations].map(({ id }) => id)
      expect(requiredIds.every((id) => copy.items[id])).toBe(true)
      expect(Object.keys(landmark.comparison).every((key) => copy.comparison[key])).toBe(true)
      expect(getClaims(localized[index].landmark).map(({ id, sourceIds }) => ({ id, sourceIds }))).toEqual(getClaims(landmark).map(({ id, sourceIds }) => ({ id, sourceIds })))
    }
    expect(searchLandmarks('menara jam', localized).map(({ landmark }) => landmark.slug)).toEqual(['jam-gadang'])
    expect(getFurtherReadings('id').find(({ id }) => id.startsWith('prijotomo'))?.scope).toContain('Belum diverifikasi')
  })
})

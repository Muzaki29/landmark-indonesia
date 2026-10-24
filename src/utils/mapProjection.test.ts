import { describe, expect, it } from 'vitest'
import { provinces } from '../data/heritage'
import { INDONESIA_MAP, projectIndonesiaPoint } from './mapProjection'

describe('Indonesia atlas projection', () => {
  const points = Object.fromEntries(provinces.map(({ landmark }) => {
    const coordinates = landmark.coordinates!
    return [landmark.slug, projectIndonesiaPoint(coordinates.longitude, coordinates.latitude)]
  }))

  it('projects every landmark inside the Natural Earth map coordinate space', () => {
    for (const point of Object.values(points)) {
      expect(point.x).toBeGreaterThanOrEqual(0)
      expect(point.x).toBeLessThanOrEqual(INDONESIA_MAP.width)
      expect(point.y).toBeGreaterThanOrEqual(0)
      expect(point.y).toBeLessThanOrEqual(INDONESIA_MAP.height)
    }
  })

  it('preserves the known geographic ordering of the three landmarks', () => {
    expect(points['jam-gadang'].x).toBeLessThan(points.monas.x)
    expect(points['tugu-pal-putih'].x).toBeGreaterThan(points.monas.x)
    expect(points.monas.y).toBeGreaterThan(points['jam-gadang'].y)
    expect(points['tugu-pal-putih'].y).toBeGreaterThan(points['jam-gadang'].y)
  })
})

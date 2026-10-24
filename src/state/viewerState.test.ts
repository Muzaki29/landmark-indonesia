import { describe, expect, it } from 'vitest'
import { getProvinces } from '../data/heritage'
import { getHeritageTour } from '../data/tours'
import { applyTourStep, initialViewerState, readViewerState, switchViewerLandmark, viewerSearch } from './viewerState'

const [jakarta, yogyakarta] = getProvinces('en')

describe('shareable viewer state', () => {
  it('synchronizes a tour step with camera, hotspot and display', () => {
    const tour = getHeritageTour(jakarta.landmark, 'en')
    const index = tour.steps.findIndex(({ hotspotId }) => Boolean(hotspotId))
    const state = applyTourStep(initialViewerState, tour, index, jakarta.landmark)
    expect(state.activeHotspotId).toBe(tour.steps[index].hotspotId)
    expect(state.displayMode).toBe('clay')
    expect(state.sectionCut).toBe(false)
  })

  it('round-trips meaningful URL state and rejects invalid values', () => {
    const state = readViewerState('?display=clay&tour=heritage&step=999&hotspot=missing', jakarta.landmark)
    expect(state.tour?.step).toBe(getHeritageTour(jakarta.landmark, 'en').steps.length - 1)
    expect(state.activeHotspotId).toBeNull()
    expect(viewerSearch(state)).toContain('tour=heritage')
  })

  it('resets transient inspection state when changing landmarks', () => {
    const state = switchViewerLandmark({ ...initialViewerState, sectionCut: true, activeHotspotId: 'monas-base', tour: { id: 'heritage', step: 2, paused: false } }, yogyakarta.landmark)
    expect(state.sectionCut).toBe(false)
    expect(state.activeHotspotId).toBeNull()
    expect(state.tour).toBeNull()
  })
})

import type { CameraView, Landmark } from '../data/heritage'
import { getHeritageTour, type HeritageTour } from '../data/tours'
import { requestedBlueprintView, requestedDisplayMode, resolveDisplayMode } from '../displayModes'
import type { BlueprintView, DisplayMode } from './experienceState'

export interface ViewerState {
  displayMode: DisplayMode
  blueprintView: BlueprintView
  sectionCut: boolean
  sectionAxis: 'x' | 'y' | 'z'
  sectionPosition: number
  activeHotspotId: string | null
  cameraViewId: CameraView['id']
  labels: boolean
  evidenceMode: boolean
  tour: { id: string; step: number; paused: boolean } | null
}

export const initialViewerState: ViewerState = {
  displayMode: 'real', blueprintView: 'FRONT', sectionCut: false, sectionAxis: 'y', sectionPosition: 0,
  activeHotspotId: null, cameraViewId: '3d', labels: false, evidenceMode: false, tour: null,
}

export function applyTourStep(state: ViewerState, tour: HeritageTour, index: number, landmark: Landmark): ViewerState {
  const stepIndex = Math.max(0, Math.min(tour.steps.length - 1, Math.trunc(Number.isFinite(index) ? index : 0)))
  const step = tour.steps[stepIndex]
  if (!step) return state
  return { ...state, tour: { id: tour.id, step: stepIndex, paused: false }, activeHotspotId: step.hotspotId ?? null, cameraViewId: step.camera.id, displayMode: resolveDisplayMode(step.displayMode ?? state.displayMode, landmark.inspectionCapabilities.display), blueprintView: step.blueprintView ?? state.blueprintView, labels: step.labels, sectionCut: false }
}

export function switchViewerLandmark(state: ViewerState, landmark: Landmark): ViewerState {
  return { ...initialViewerState, evidenceMode: state.evidenceMode, displayMode: resolveDisplayMode(state.displayMode, landmark.inspectionCapabilities.display) }
}

export function readViewerState(search: string, landmark: Landmark): ViewerState {
  const params = new URLSearchParams(search)
  let state = { ...initialViewerState, displayMode: resolveDisplayMode(requestedDisplayMode(search), landmark.inspectionCapabilities.display), blueprintView: requestedBlueprintView(search) }
  const tour = getHeritageTour(landmark, 'en')
  if (params.get('tour') === tour.id) state = applyTourStep(state, tour, Number(params.get('step') ?? '1') - 1, landmark)
  const hotspot = landmark.hotspots.find(({ id }) => id === params.get('hotspot'))
  if (hotspot) { state.activeHotspotId = hotspot.id; state.labels = true }
  if (params.has('display')) state.displayMode = resolveDisplayMode(requestedDisplayMode(search), landmark.inspectionCapabilities.display)
  return state
}

export function viewerSearch(state: ViewerState): string {
  const params = new URLSearchParams()
  if (state.displayMode !== 'real') params.set('display', state.displayMode)
  if (state.displayMode === 'blueprint') params.set('view', state.blueprintView.toLowerCase())
  if (state.tour) { params.set('tour', state.tour.id); params.set('step', String(state.tour.step + 1)) }
  if (state.activeHotspotId) params.set('hotspot', state.activeHotspotId)
  return params.size ? `?${params}` : ''
}

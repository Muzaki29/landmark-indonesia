import type { Locale } from '../i18n'
import type { BlueprintView, DisplayMode } from '../state/experienceState'
import { getClaims, getSourcesForClaims, type CameraView, type Landmark } from './heritage'

export interface TourStep {
  id: string
  title: string
  body: string
  camera: CameraView
  hotspotId?: string
  claimIds: string[]
  sourceIds: string[]
  archiveItemIds: string[]
  displayMode?: DisplayMode
  blueprintView?: BlueprintView
  labels: boolean
}

export interface HeritageTour {
  id: string
  landmarkId: string
  title: string
  description: string
  steps: TourStep[]
}

export function getHeritageTour(landmark: Landmark, locale: Locale): HeritageTour {
  const overview = landmark.cameraViews[0]
  const steps: TourStep[] = []
  const add = (step: Omit<TourStep, 'sourceIds' | 'archiveItemIds'>) => {
    const claims = getClaims(landmark).filter((claim) => step.claimIds.includes(claim.id))
    if (!claims.length || claims.some((claim) => claim.verificationStatus !== 'VERIFIED')) return
    const sources = getSourcesForClaims(landmark, step.claimIds)
    if (!sources.length) return
    steps.push({
      ...step,
      sourceIds: sources.map(({ id }) => id),
      archiveItemIds: landmark.archive.filter((item) => item.claimIds?.some((id) => step.claimIds.includes(id))).map(({ id }) => id),
    })
  }

  add({ id: 'introduction', title: landmark.name, body: landmark.shortDescription, camera: overview, claimIds: [landmark.overviewClaimId], displayMode: 'real', labels: false })
  landmark.history.forEach((claim, index) => add({ id: claim.id, title: `${locale === 'id' ? 'Sejarah' : 'History'} · ${index + 1}`, body: claim.text, camera: landmark.cameraViews.find(({ id }) => id === 'front') ?? overview, claimIds: [claim.id], displayMode: 'real', labels: false }))
  landmark.hotspots.forEach((hotspot) => add({ id: hotspot.id, title: hotspot.title, body: hotspot.summary, camera: { ...overview, ...hotspot.targetCamera }, hotspotId: hotspot.id, claimIds: hotspot.claimIds, displayMode: 'clay', labels: true }))
  if (landmark.inspectionCapabilities.display.blueprint.status !== 'UNAVAILABLE') add({ id: 'model-study', title: locale === 'id' ? 'Studi model · tampak depan' : 'Model study · front elevation', body: landmark.inspectionCapabilities.display.blueprint.description[locale], camera: landmark.cameraViews.find(({ id }) => id === 'front') ?? overview, claimIds: landmark.inspectionCapabilities.display.blueprint.evidenceIds, displayMode: 'blueprint', blueprintView: 'FRONT', labels: false })
  landmark.culturalContext.forEach((claim) => add({ id: claim.id, title: locale === 'id' ? 'Konteks wilayah' : 'Regional context', body: claim.text, camera: overview, claimIds: [claim.id], displayMode: 'real', labels: false }))
  return { id: 'heritage', landmarkId: landmark.id, title: locale === 'id' ? 'Tur Warisan' : 'Guided Tour', description: landmark.modelNote, steps }
}

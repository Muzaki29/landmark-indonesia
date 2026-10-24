import { lazy, Suspense } from 'react'
import type { CameraView, Hotspot, Landmark } from '../data/heritage'
import type { ViewerCommand } from '../scenes/CameraControls'
import type { ExploreMode } from '../state/experienceState'

const LandmarkViewer = lazy(() =>
  import('./LandmarkViewer').then((module) => ({ default: module.LandmarkViewer })),
)

interface LandmarkExperienceProps {
  landmark: Landmark
  onReady: () => void
  resetNonce: number
  mode: ExploreMode
  activeHotspot: Hotspot | null
  onHotspot: (id: string) => void
  cameraView: CameraView | null
  command: ViewerCommand | null
  labels: boolean
}

export function LandmarkExperience({ landmark, onReady, resetNonce, mode, activeHotspot, onHotspot, cameraView, command, labels }: LandmarkExperienceProps) {
  return (
    <div className="viewer" aria-busy="false">
      <Suspense fallback={null}>
        <LandmarkViewer key={landmark.slug} landmark={landmark} onReady={onReady} resetNonce={resetNonce} mode={mode} activeHotspot={activeHotspot} onHotspot={onHotspot} cameraView={cameraView} command={command} labels={labels} />
      </Suspense>
    </div>
  )
}

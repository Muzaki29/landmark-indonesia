import { lazy, Suspense } from 'react'
import type { Landmark } from '../data/heritage'

const LandmarkViewer = lazy(() =>
  import('./LandmarkViewer').then((module) => ({ default: module.LandmarkViewer })),
)

interface LandmarkExperienceProps {
  landmark: Landmark
  onReady: () => void
  resetNonce: number
}

export function LandmarkExperience({ landmark, onReady, resetNonce }: LandmarkExperienceProps) {
  return (
    <div className="viewer" aria-busy="false">
      <Suspense fallback={null}>
        <LandmarkViewer key={landmark.slug} landmarkSlug={landmark.slug} landmarkName={landmark.name} onReady={onReady} resetNonce={resetNonce} />
      </Suspense>
    </div>
  )
}

import { lazy, Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three'
import { SceneErrorBoundary } from './SceneErrorBoundary'
import { ViewerFallback } from './ViewerFallback'
import { LandmarkHotspots } from './LandmarkHotspots'
import type { CameraView, Hotspot, Landmark } from '../data/heritage'
import type { ExploreMode } from '../state/experienceState'
import type { ViewerCommand } from '../scenes/CameraControls'
import { useI18n } from '../i18n'

const landmarkScenes = {
  monas: lazy(() => import('../scenes/LandmarkScene')),
  'tugu-pal-putih': lazy(() => import('../scenes/TuguScene')),
  'jam-gadang': lazy(() => import('../scenes/JamGadangScene')),
}

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

interface LandmarkViewerProps {
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

export function LandmarkViewer({ landmark, onReady, resetNonce, mode, activeHotspot, onHotspot, cameraView, command, labels }: LandmarkViewerProps) {
  const { t } = useI18n()
  const [webglSupported] = useState(supportsWebGL)
  const LandmarkScene = landmarkScenes[landmark.slug]

  const fallback = <ViewerFallback title={t('viewUnavailable')} message={t('viewUnavailableBody')} />

  if (!webglSupported) return fallback

  return (
    <SceneErrorBoundary fallback={fallback}>
      <Canvas
        shadows="soft"
        dpr={[1, 1.5]}
        frameloop="demand"
        camera={{ fov: 36, near: 0.1, far: 80, position: [19.5, 15.5, 22] }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        fallback={fallback}
        onCreated={({ gl }) => {
          gl.outputColorSpace = SRGBColorSpace
          gl.toneMapping = ACESFilmicToneMapping
          gl.toneMappingExposure = 1.05
        }}
        aria-label={`${t('interactiveMiniature')} ${landmark.name}`}
      >
        <Suspense fallback={null}>
          <LandmarkScene onReady={onReady} resetNonce={resetNonce} focus={activeHotspot} cameraView={cameraView} command={command} />
          <LandmarkHotspots hotspots={landmark.hotspots} activeId={activeHotspot?.id} visible={mode === 'architecture' || labels} labels={labels} onSelect={onHotspot} focusLabel={t('focus')} />
        </Suspense>
      </Canvas>
    </SceneErrorBoundary>
  )
}

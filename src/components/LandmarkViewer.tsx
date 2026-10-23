import { lazy, Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three'
import { SceneErrorBoundary } from './SceneErrorBoundary'
import { ViewerFallback } from './ViewerFallback'

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
  landmarkSlug: keyof typeof landmarkScenes
  landmarkName: string
  onReady: () => void
  resetNonce: number
}

export function LandmarkViewer({ landmarkSlug, landmarkName, onReady, resetNonce }: LandmarkViewerProps) {
  const [webglSupported] = useState(supportsWebGL)
  const LandmarkScene = landmarkScenes[landmarkSlug]

  if (!webglSupported) return <ViewerFallback />

  return (
    <SceneErrorBoundary>
      <Canvas
        shadows="soft"
        dpr={[1, 1.5]}
        frameloop="demand"
        camera={{ fov: 36, near: 0.1, far: 80, position: [19.5, 15.5, 22] }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        fallback={<ViewerFallback />}
        onCreated={({ gl }) => {
          gl.outputColorSpace = SRGBColorSpace
          gl.toneMapping = ACESFilmicToneMapping
          gl.toneMappingExposure = 1.05
        }}
        aria-label={`Interactive 3D miniature of ${landmarkName}`}
      >
        <Suspense fallback={null}>
          <LandmarkScene onReady={onReady} resetNonce={resetNonce} />
        </Suspense>
      </Canvas>
    </SceneErrorBoundary>
  )
}

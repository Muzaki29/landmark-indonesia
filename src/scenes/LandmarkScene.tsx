import { ContactShadows } from '@react-three/drei'
import { DioramaEnvironment } from '../environment/DioramaEnvironment'
import { Monument } from '../landmarks/monas/Monument'
import { CameraControls } from './CameraControls'
import { Lighting } from './Lighting'
import { SceneTelemetry } from './SceneTelemetry'
import type { CameraView, Hotspot } from '../data/heritage'
import type { ViewerCommand } from './CameraControls'

interface LandmarkSceneProps {
  onReady: () => void
  resetNonce: number
  focus?: Hotspot | null
  cameraView?: CameraView | null
  command?: ViewerCommand | null
}

export default function LandmarkScene({ onReady, resetNonce, focus, cameraView, command }: LandmarkSceneProps) {
  return (
    <>
      <fog attach="fog" args={['#766445', 25, 48]} />
      <Lighting />
      <DioramaEnvironment />
      <Monument />
      <ContactShadows position={[0, 0.01, 0]} opacity={0.54} scale={18} blur={2.5} far={15} frames={1} color="#111813" />
      <CameraControls landmark="monas" resetNonce={resetNonce} focus={focus} cameraView={cameraView} command={command} />
      <SceneTelemetry landmark="monas" onReady={onReady} />
    </>
  )
}

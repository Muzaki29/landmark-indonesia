import { ContactShadows } from '@react-three/drei'
import { DioramaEnvironment } from '../environment/DioramaEnvironment'
import { Monument } from '../landmarks/monas/Monument'
import { CameraControls } from './CameraControls'
import { Lighting } from './Lighting'
import { SceneTelemetry } from './SceneTelemetry'

interface LandmarkSceneProps {
  onReady: () => void
  resetNonce: number
}

export default function LandmarkScene({ onReady, resetNonce }: LandmarkSceneProps) {
  return (
    <>
      <color attach="background" args={['#d5d6c8']} />
      <fog attach="fog" args={['#d5d6c8', 26, 48]} />
      <Lighting />
      <DioramaEnvironment />
      <Monument />
      <ContactShadows position={[0, 0.01, 0]} opacity={0.42} scale={18} blur={2.4} far={15} frames={1} color="#25322a" />
      <CameraControls resetNonce={resetNonce} />
      <SceneTelemetry landmark="monas" onReady={onReady} />
    </>
  )
}

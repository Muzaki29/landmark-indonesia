import { ContactShadows } from '@react-three/drei'
import { JamGadangEnvironment } from '../environment/JamGadangEnvironment'
import { JamGadang } from '../landmarks/jam-gadang/JamGadang'
import { CameraControls } from './CameraControls'
import { Lighting } from './Lighting'
import { SceneTelemetry } from './SceneTelemetry'

export default function JamGadangScene({ onReady, resetNonce }: { onReady: () => void; resetNonce: number }) {
  return <><color attach="background" args={['#d8d0c0']} /><fog attach="fog" args={['#d8d0c0', 26, 48]} /><Lighting /><JamGadangEnvironment /><JamGadang /><ContactShadows position={[0, 0.02, 0]} opacity={0.48} scale={18} blur={2.2} far={14} frames={1} color="#333128" /><CameraControls resetNonce={resetNonce} /><SceneTelemetry landmark="jam-gadang" onReady={onReady} /></>
}

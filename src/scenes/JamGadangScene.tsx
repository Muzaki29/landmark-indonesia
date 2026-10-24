import { ContactShadows } from '@react-three/drei'
import { JamGadangEnvironment } from '../environment/JamGadangEnvironment'
import { JamGadang } from '../landmarks/jam-gadang/JamGadang'
import { CameraControls } from './CameraControls'
import { Lighting } from './Lighting'
import { SceneTelemetry } from './SceneTelemetry'
import type { CameraView, Hotspot } from '../data/heritage'
import type { ViewerCommand } from './CameraControls'

export default function JamGadangScene({ onReady, resetNonce, focus, cameraView, command }: { onReady: () => void; resetNonce: number; focus?: Hotspot | null; cameraView?: CameraView | null; command?: ViewerCommand | null }) {
  return <><fog attach="fog" args={['#72583b', 25, 48]} /><Lighting /><JamGadangEnvironment /><JamGadang /><ContactShadows position={[0, 0.02, 0]} opacity={0.56} scale={18} blur={2.3} far={14} frames={1} color="#111813" /><CameraControls landmark="jam-gadang" resetNonce={resetNonce} focus={focus} cameraView={cameraView} command={command} /><SceneTelemetry landmark="jam-gadang" onReady={onReady} /></>
}

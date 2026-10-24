import { ContactShadows } from '@react-three/drei'
import { TuguEnvironment } from '../environment/TuguEnvironment'
import { TuguPalPutih } from '../landmarks/tugu/TuguPalPutih'
import { CameraControls } from './CameraControls'
import { Lighting } from './Lighting'
import { SceneTelemetry } from './SceneTelemetry'
import type { CameraView, Hotspot } from '../data/heritage'
import type { ViewerCommand } from './CameraControls'

export default function TuguScene({ onReady, resetNonce, focus, cameraView, command }: { onReady: () => void; resetNonce: number; focus?: Hotspot | null; cameraView?: CameraView | null; command?: ViewerCommand | null }) {
  return <><fog attach="fog" args={['#6d5b42', 25, 48]} /><Lighting /><TuguEnvironment /><group name="inspection-subject"><TuguPalPutih /></group><ContactShadows position={[0, 0.02, 0]} opacity={0.55} scale={18} blur={2.3} far={14} frames={1} color="#111813" /><CameraControls landmark="tugu-pal-putih" resetNonce={resetNonce} focus={focus} cameraView={cameraView} command={command} /><SceneTelemetry landmark="tugu-pal-putih" onReady={onReady} /></>
}

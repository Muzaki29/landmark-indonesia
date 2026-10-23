import { ContactShadows } from '@react-three/drei'
import { TuguEnvironment } from '../environment/TuguEnvironment'
import { TuguPalPutih } from '../landmarks/tugu/TuguPalPutih'
import { CameraControls } from './CameraControls'
import { Lighting } from './Lighting'
import { SceneTelemetry } from './SceneTelemetry'

export default function TuguScene({ onReady, resetNonce }: { onReady: () => void; resetNonce: number }) {
  return <><color attach="background" args={['#cfcabf']} /><fog attach="fog" args={['#cfcabf', 26, 48]} /><Lighting /><TuguEnvironment /><TuguPalPutih /><ContactShadows position={[0, 0.02, 0]} opacity={0.46} scale={18} blur={2.2} far={14} frames={1} color="#28312b" /><CameraControls resetNonce={resetNonce} /><SceneTelemetry landmark="tugu-pal-putih" onReady={onReady} /></>
}

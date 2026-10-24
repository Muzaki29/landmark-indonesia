import { Html } from '@react-three/drei'
import type { Hotspot } from '../data/heritage'

export function LandmarkHotspots({ hotspots, activeId, visible, labels, onSelect, focusLabel }: {
  hotspots: Hotspot[]
  activeId?: string | null
  visible: boolean
  labels: boolean
  onSelect: (id: string) => void
  focusLabel: string
}) {
  if (!visible) return null
  return <group name="Architectural hotspots">{hotspots.map((hotspot, index) => (
    <group key={hotspot.id} position={hotspot.position}>
      <mesh scale={activeId === hotspot.id ? 1.5 : 1}>
        <sphereGeometry args={[0.13, 16, 12]} />
        <meshBasicMaterial color={activeId === hotspot.id ? '#fff0ba' : '#d7ad5b'} transparent opacity={0.88} depthTest={false} />
      </mesh>
      <Html center distanceFactor={9} zIndexRange={[12, 0]}>
        <button className={activeId === hotspot.id ? 'hotspot-marker hotspot-marker--active' : 'hotspot-marker'} type="button" onClick={(event) => { event.stopPropagation(); onSelect(hotspot.id) }} aria-label={`${focusLabel} ${hotspot.title}`}>
          <span>{String(index + 1).padStart(2, '0')}</span>{labels && <strong>{hotspot.title}</strong>}
        </button>
      </Html>
    </group>
  ))}</group>
}

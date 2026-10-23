import { useMemo } from 'react'
import { DoubleSide, Shape } from 'three'
import { MONAS_CONFIG, MONAS_LEVELS } from './config'
import { MATERIALS } from '../../materials/palette'

function createFlameShape() {
  const shape = new Shape()
  shape.moveTo(0, -0.7)
  shape.bezierCurveTo(-0.28, -0.55, -0.34, -0.12, -0.18, 0.16)
  shape.bezierCurveTo(-0.06, 0.37, -0.19, 0.48, -0.1, 0.7)
  shape.bezierCurveTo(0.02, 0.57, 0.08, 0.42, 0.12, 0.28)
  shape.bezierCurveTo(0.32, 0.05, 0.33, -0.32, 0, -0.7)
  return shape
}

export function GoldenFlame() {
  const shape = useMemo(() => createFlameShape(), [])
  const scale = MONAS_CONFIG.flameHeight / 1.4
  const extrude = useMemo(
    () => ({ depth: 0.14, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.055, bevelThickness: 0.055 }),
    [],
  )

  return (
    <group position={[0, MONAS_LEVELS.flameCenter, 0]} scale={[scale, scale, scale]}>
      {[0, Math.PI / 3, (Math.PI * 2) / 3].map((rotation) => (
        <mesh key={rotation} rotation={[0, rotation, 0]} castShadow>
          <extrudeGeometry args={[shape, extrude]} />
          <meshStandardMaterial {...MATERIALS.gold} side={DoubleSide} />
        </mesh>
      ))}
    </group>
  )
}

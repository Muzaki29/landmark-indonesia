import { useMemo } from 'react'
import { RoundedBox } from '@react-three/drei'
import { MathUtils } from 'three'
import { MATERIALS } from '../../materials/palette'
import { createTaperedBoxGeometry } from '../../utils/geometry'
import { GoldenFlame } from './GoldenFlame'
import { MONAS_CONFIG, MONAS_LEVELS } from './config'

function TowerDetails() {
  const y = MONAS_LEVELS.shaftBottom + MONAS_LEVELS.shaftHeight / 2
  return (
    <group position={[0, y, 0]}>
      {[0, Math.PI / 2, Math.PI, -Math.PI / 2].map((rotation) => (
        <mesh key={rotation} rotation={[0, rotation, 0]} position={[0, 0, 0.181]}>
          <boxGeometry args={[0.055, MONAS_LEVELS.shaftHeight * 0.94, 0.012]} />
          <meshStandardMaterial {...MATERIALS.stoneEdge} />
        </mesh>
      ))}
    </group>
  )
}

function BaseDetails() {
  return (
    <group>
      {[0, Math.PI / 2, Math.PI, -Math.PI / 2].map((rotation) => (
        <group key={rotation} rotation={[0, rotation, 0]}>
          <mesh position={[0, 0.55, 2.358]}>
            <boxGeometry args={[0.75, 0.34, 0.018]} />
            <meshStandardMaterial color="#777b73" roughness={0.82} />
          </mesh>
          <mesh position={[0, 0.2, 2.88]} castShadow receiveShadow>
            <boxGeometry args={[1.45, 0.12, 1.05]} />
            <meshStandardMaterial {...MATERIALS.stone} />
          </mesh>
          <mesh position={[0, 0.27, 2.64]} castShadow receiveShadow>
            <boxGeometry args={[1.58, 0.1, 0.58]} />
            <meshStandardMaterial {...MATERIALS.stoneEdge} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export function Monument() {
  const shaftGeometry = useMemo(
    () => createTaperedBoxGeometry(MONAS_CONFIG.towerBottomWidth, MONAS_CONFIG.towerTopWidth, MONAS_LEVELS.shaftHeight),
    [],
  )

  return (
    <group name="Monumen Nasional">
      <RoundedBox args={[5.15, 0.18, 5.15]} radius={0.05} smoothness={3} position={[0, 0.09, 0]} receiveShadow castShadow>
        <meshStandardMaterial {...MATERIALS.stoneEdge} />
      </RoundedBox>
      <RoundedBox args={[4.7, MONAS_CONFIG.museumHeight, 4.7]} radius={0.06} smoothness={3} position={[0, MONAS_LEVELS.museumCenter + 0.18, 0]} receiveShadow castShadow>
        <meshStandardMaterial {...MATERIALS.stone} />
      </RoundedBox>
      <BaseDetails />

      <mesh position={[0, 1.3, 0]} rotation={[0, MathUtils.degToRad(45), 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.15, 3.15, 1.05, 4]} />
        <meshStandardMaterial {...MATERIALS.stone} />
      </mesh>
      <RoundedBox args={[4.75, 0.18, 4.75]} radius={0.04} smoothness={3} position={[0, 1.72, 0]} receiveShadow castShadow>
        <meshStandardMaterial {...MATERIALS.stoneEdge} />
      </RoundedBox>

      <mesh geometry={shaftGeometry} position={[0, MONAS_LEVELS.shaftBottom + MONAS_LEVELS.shaftHeight / 2, 0]} castShadow receiveShadow>
        <meshStandardMaterial {...MATERIALS.stone} />
      </mesh>
      <TowerDetails />

      <RoundedBox args={[1.28, 0.28, 1.28]} radius={0.035} smoothness={3} position={[0, MONAS_LEVELS.observationCenter, 0]} castShadow receiveShadow>
        <meshStandardMaterial {...MATERIALS.stoneEdge} />
      </RoundedBox>
      <RoundedBox args={[0.8, 0.32, 0.8]} radius={0.035} smoothness={3} position={[0, 11.72, 0]} castShadow>
        <meshStandardMaterial {...MATERIALS.stone} />
      </RoundedBox>
      <mesh position={[0, 11.92, 0]} castShadow>
        <cylinderGeometry args={[0.26, 0.34, 0.25, 16]} />
        <meshStandardMaterial {...MATERIALS.gold} />
      </mesh>
      <GoldenFlame />
    </group>
  )
}

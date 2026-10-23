import { useLayoutEffect, useRef } from 'react'
import { RoundedBox } from '@react-three/drei'
import { InstancedMesh, Object3D } from 'three'
import { MATERIALS } from '../materials/palette'
import { MONAS_CONFIG } from '../landmarks/monas/config'
import { Vegetation } from './Vegetation'

const LAMP_POSITIONS = [
  [-1.3, -6.4], [1.3, -6.4], [-1.3, 6.4], [1.3, 6.4],
  [-6.4, -1.3], [-6.4, 1.3], [6.4, -1.3], [6.4, 1.3],
] as const

function PlazaLamps() {
  const posts = useRef<InstancedMesh>(null)
  const lights = useRef<InstancedMesh>(null)

  useLayoutEffect(() => {
    const dummy = new Object3D()
    LAMP_POSITIONS.forEach(([x, z], index) => {
      dummy.position.set(x, 0.47, z)
      dummy.updateMatrix()
      posts.current?.setMatrixAt(index, dummy.matrix)
      dummy.position.set(x, 0.89, z)
      dummy.updateMatrix()
      lights.current?.setMatrixAt(index, dummy.matrix)
    })
    if (posts.current) posts.current.instanceMatrix.needsUpdate = true
    if (lights.current) lights.current.instanceMatrix.needsUpdate = true
  }, [])

  return (
    <group>
      <instancedMesh ref={posts} args={[undefined, undefined, LAMP_POSITIONS.length]} castShadow>
        <cylinderGeometry args={[0.025, 0.04, 0.75, 8]} />
        <meshStandardMaterial {...MATERIALS.lamp} />
      </instancedMesh>
      <instancedMesh ref={lights} args={[undefined, undefined, LAMP_POSITIONS.length]}>
        <sphereGeometry args={[0.085, 10, 8]} />
        <meshStandardMaterial color="#eee4c5" roughness={0.35} emissive="#d6b96f" emissiveIntensity={0.28} />
      </instancedMesh>
    </group>
  )
}

function IndonesianFlag() {
  return (
    <group position={[-3.8, 0.19, -4.5]}>
      <mesh position={[0, 1.05, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.04, 2.1, 10]} />
        <meshStandardMaterial {...MATERIALS.lamp} />
      </mesh>
      <group position={[0.38, 1.73, 0]}>
        <mesh position={[0, 0.13, 0]} castShadow>
          <boxGeometry args={[0.76, 0.26, 0.025]} />
          <meshStandardMaterial color="#b82c2f" roughness={0.82} />
        </mesh>
        <mesh position={[0, -0.13, 0]} castShadow>
          <boxGeometry args={[0.76, 0.26, 0.025]} />
          <meshStandardMaterial color="#f1eee6" roughness={0.84} />
        </mesh>
      </group>
    </group>
  )
}

export function DioramaEnvironment() {
  const lawnCenters = [-4.85, 4.85]

  return (
    <group name="Merdeka Square diorama">
      <RoundedBox args={[MONAS_CONFIG.dioramaSize, 0.72, MONAS_CONFIG.dioramaSize]} radius={0.42} smoothness={5} position={[0, -0.52, 0]} receiveShadow castShadow>
        <meshStandardMaterial {...MATERIALS.pedestal} />
      </RoundedBox>
      <RoundedBox args={[17.2, 0.18, 17.2]} radius={0.26} smoothness={4} position={[0, -0.08, 0]} receiveShadow>
        <meshStandardMaterial {...MATERIALS.plaza} />
      </RoundedBox>

      {lawnCenters.flatMap((x) => lawnCenters.map((z) => (
        <RoundedBox key={`${x}-${z}`} args={[6.95, 0.09, 6.95]} radius={0.48} smoothness={4} position={[x, 0.05, z]} receiveShadow>
          <meshStandardMaterial {...MATERIALS.lawn} />
        </RoundedBox>
      )))}

      <mesh position={[0, 0.12, 0]} receiveShadow>
        <cylinderGeometry args={[5.05, 5.2, 0.14, 64]} />
        <meshStandardMaterial {...MATERIALS.path} />
      </mesh>
      <mesh position={[0, 0.2, 0]} receiveShadow>
        <cylinderGeometry args={[3.6, 3.74, 0.18, 64]} />
        <meshStandardMaterial {...MATERIALS.plaza} />
      </mesh>

      <mesh position={[0, 0.105, 0]} receiveShadow>
        <boxGeometry args={[2.0, 0.13, 17.05]} />
        <meshStandardMaterial {...MATERIALS.path} />
      </mesh>
      <mesh position={[0, 0.11, 0]} receiveShadow>
        <boxGeometry args={[17.05, 0.14, 2.0]} />
        <meshStandardMaterial {...MATERIALS.path} />
      </mesh>

      <Vegetation />
      <PlazaLamps />
      <IndonesianFlag />
    </group>
  )
}

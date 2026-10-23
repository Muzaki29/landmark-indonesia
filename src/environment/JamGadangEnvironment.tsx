import { useLayoutEffect, useRef } from 'react'
import { RoundedBox } from '@react-three/drei'
import { InstancedMesh, Object3D } from 'three'
import { MATERIALS } from '../materials/palette'

const TREE_POSITIONS = [[-6.7, -6.2], [-4.8, -6.8], [5.1, -6.8], [6.8, -5.4], [-6.8, 5.3], [-5.2, 6.8], [5.1, 6.7], [6.8, 5.2]] as const

function PlazaTrees() {
  const trunks = useRef<InstancedMesh>(null)
  const crowns = useRef<InstancedMesh>(null)
  useLayoutEffect(() => {
    const item = new Object3D()
    TREE_POSITIONS.forEach(([x, z], index) => {
      item.position.set(x, 0.5, z); item.updateMatrix(); trunks.current?.setMatrixAt(index, item.matrix)
      item.position.set(x, 1.25, z); item.rotation.y = index * 1.7; item.updateMatrix(); crowns.current?.setMatrixAt(index, item.matrix)
    })
    if (trunks.current) trunks.current.instanceMatrix.needsUpdate = true
    if (crowns.current) crowns.current.instanceMatrix.needsUpdate = true
  }, [])
  return <><instancedMesh ref={trunks} args={[undefined, undefined, TREE_POSITIONS.length]} castShadow><cylinderGeometry args={[0.09, 0.14, 0.82, 7]} /><meshStandardMaterial {...MATERIALS.treeTrunk} /></instancedMesh><instancedMesh ref={crowns} args={[undefined, undefined, TREE_POSITIONS.length]} castShadow><icosahedronGeometry args={[0.68, 2]} /><meshStandardMaterial {...MATERIALS.foliage} /></instancedMesh></>
}

export function JamGadangEnvironment() {
  return (
    <group name="Bukittinggi civic plaza diorama">
      <RoundedBox args={[18, 0.72, 18]} radius={0.42} smoothness={5} position={[0, -0.52, 0]} castShadow receiveShadow><meshStandardMaterial {...MATERIALS.pedestal} /></RoundedBox>
      <RoundedBox args={[17.2, 0.18, 17.2]} radius={0.26} smoothness={4} position={[0, -0.08, 0]} receiveShadow><meshStandardMaterial color="#b5ad9e" roughness={0.94} /></RoundedBox>
      <mesh position={[0, 0.08, 0]} receiveShadow><cylinderGeometry args={[7.1, 7.4, 0.2, 8]} /><meshStandardMaterial color="#c8beaa" roughness={0.92} /></mesh>
      <mesh position={[0, 0.19, 0]} receiveShadow><cylinderGeometry args={[4.25, 4.45, 0.2, 8]} /><meshStandardMaterial color="#aaa293" roughness={0.94} /></mesh>
      {[0, Math.PI / 4, Math.PI / 2, Math.PI * 0.75].map((rotation) => <mesh key={rotation} rotation={[0, rotation, 0]} position={[0, 0.305, 0]} receiveShadow><boxGeometry args={[0.045, 0.012, 8.3]} /><meshStandardMaterial color="#d9d0bd" roughness={1} /></mesh>)}
      {[-6.15, 6.15].flatMap((x) => [-6.15, 6.15].map((z) => <RoundedBox key={`${x}-${z}`} args={[3.7, 0.14, 3.7]} radius={0.35} smoothness={3} position={[x, 0.17, z]} receiveShadow><meshStandardMaterial {...MATERIALS.lawn} /></RoundedBox>))}
      <PlazaTrees />
    </group>
  )
}

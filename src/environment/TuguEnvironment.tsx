import { RoundedBox } from '@react-three/drei'
import { MATERIALS } from '../materials/palette'

function StreetCorner({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <RoundedBox args={[5.8, 0.22, 5.8]} radius={0.28} smoothness={3} position={[0, 0.05, 0]} receiveShadow><meshStandardMaterial color="#b9b2a4" roughness={0.92} /></RoundedBox>
      <RoundedBox args={[4.8, 0.1, 4.8]} radius={0.22} smoothness={3} position={[0, 0.19, 0]} receiveShadow><meshStandardMaterial color="#647054" roughness={1} /></RoundedBox>
      <mesh position={[x > 0 ? -1.9 : 1.9, 0.78, z > 0 ? -1.9 : 1.9]} castShadow><cylinderGeometry args={[0.09, 0.13, 1.25, 8]} /><meshStandardMaterial {...MATERIALS.treeTrunk} /></mesh>
      <mesh position={[x > 0 ? -1.9 : 1.9, 1.55, z > 0 ? -1.9 : 1.9]} castShadow><icosahedronGeometry args={[0.72, 2]} /><meshStandardMaterial {...MATERIALS.foliage} /></mesh>
    </group>
  )
}

export function TuguEnvironment() {
  return (
    <group name="Yogyakarta intersection diorama">
      <RoundedBox args={[18, 0.72, 18]} radius={0.42} smoothness={5} position={[0, -0.52, 0]} castShadow receiveShadow><meshStandardMaterial {...MATERIALS.pedestal} /></RoundedBox>
      <RoundedBox args={[17.2, 0.18, 17.2]} radius={0.25} smoothness={4} position={[0, -0.08, 0]} receiveShadow><meshStandardMaterial color="#4a4c49" roughness={0.94} /></RoundedBox>
      <mesh position={[0, 0.02, 0]} receiveShadow><boxGeometry args={[4.8, 0.08, 17.1]} /><meshStandardMaterial color="#343735" roughness={0.98} /></mesh>
      <mesh position={[0, 0.025, 0]} receiveShadow><boxGeometry args={[17.1, 0.08, 4.8]} /><meshStandardMaterial color="#343735" roughness={0.98} /></mesh>
      {[-5.7, 5.7].flatMap((x) => [-5.7, 5.7].map((z) => <StreetCorner key={`${x}-${z}`} x={x} z={z} />))}
      <mesh position={[0, 0.13, 0]} receiveShadow><cylinderGeometry args={[2.25, 2.34, 0.2, 48]} /><meshStandardMaterial color="#a9a395" roughness={0.9} /></mesh>
      <mesh position={[0, 0.2, 0]} receiveShadow><cylinderGeometry args={[1.72, 1.82, 0.18, 48]} /><meshStandardMaterial color="#6c775d" roughness={1} /></mesh>
      {[0, Math.PI / 2, Math.PI, -Math.PI / 2].map((rotation) => <mesh key={rotation} rotation={[0, rotation, 0]} position={[0, 0.08, 4.85]} receiveShadow><boxGeometry args={[0.07, 0.015, 3.2]} /><meshStandardMaterial color="#d8d0bb" roughness={0.9} /></mesh>)}
    </group>
  )
}

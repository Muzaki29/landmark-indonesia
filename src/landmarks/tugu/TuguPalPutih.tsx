import { useMemo } from 'react'
import { RoundedBox } from '@react-three/drei'
import { createTaperedBoxGeometry } from '../../utils/geometry'
import { TUGU_MODEL } from './config'

const white = { color: '#e8e3d4', roughness: 0.72, metalness: 0.01 }
const whiteEdge = { color: '#c9c1ae', roughness: 0.78, metalness: 0 }
const gold = { color: '#c6a04d', roughness: 0.3, metalness: 0.72 }
const dark = { color: '#353733', roughness: 0.66, metalness: 0.04 }

function FaceDetails() {
  return (
    <>
      {[0, Math.PI / 2, Math.PI, -Math.PI / 2].map((rotation) => (
        <group key={rotation} rotation={[0, rotation, 0]}>
          <mesh position={[0, 1.6, 1.025]} castShadow><boxGeometry args={[0.9, 0.72, 0.035]} /><meshStandardMaterial {...dark} /></mesh>
          <mesh position={[0, 1.61, 1.05]}><boxGeometry args={[0.52, 0.055, 0.02]} /><meshStandardMaterial {...gold} /></mesh>
          <mesh position={[0, 6.95, 0.53]} castShadow><boxGeometry args={[0.56, 0.09, 0.035]} /><meshStandardMaterial {...gold} /></mesh>
        </group>
      ))}
    </>
  )
}

export function TuguPalPutih() {
  const shaft = useMemo(() => createTaperedBoxGeometry(TUGU_MODEL.shaftBottomWidth, TUGU_MODEL.shaftTopWidth, TUGU_MODEL.shaftHeight), [])

  return (
    <group name="Tugu Pal Putih" position={[0, 0.24, 0]}>
      <RoundedBox args={[3.1, 0.24, 3.1]} radius={0.05} smoothness={3} position={[0, 0.12, 0]} castShadow receiveShadow><meshStandardMaterial {...whiteEdge} /></RoundedBox>
      <RoundedBox args={[2.72, 0.26, 2.72]} radius={0.04} smoothness={3} position={[0, 0.37, 0]} castShadow receiveShadow><meshStandardMaterial {...white} /></RoundedBox>
      <RoundedBox args={[2.38, 0.28, 2.38]} radius={0.035} smoothness={3} position={[0, 0.64, 0]} castShadow receiveShadow><meshStandardMaterial {...whiteEdge} /></RoundedBox>
      <RoundedBox args={[2.08, 0.26, 2.08]} radius={0.03} smoothness={3} position={[0, 0.91, 0]} castShadow receiveShadow><meshStandardMaterial {...white} /></RoundedBox>

      <mesh position={[0, 1.5, 0]} castShadow receiveShadow><boxGeometry args={[1.98, 0.92, 1.98]} /><meshStandardMaterial {...white} /></mesh>
      <mesh position={[0, 2.02, 0]} castShadow><boxGeometry args={[1.72, 0.14, 1.72]} /><meshStandardMaterial {...gold} /></mesh>
      <mesh geometry={shaft} position={[0, TUGU_MODEL.shaftBottom + TUGU_MODEL.shaftHeight / 2, 0]} castShadow receiveShadow><meshStandardMaterial {...white} /></mesh>
      <FaceDetails />

      <mesh position={[0, 7.82, 0]} castShadow><boxGeometry args={[1.05, 0.2, 1.05]} /><meshStandardMaterial {...gold} /></mesh>
      <mesh position={[0, 8.08, 0]} castShadow><boxGeometry args={[1.22, 0.34, 1.22]} /><meshStandardMaterial {...whiteEdge} /></mesh>
      <mesh position={[0, 8.39, 0]} castShadow rotation={[0, Math.PI / 4, 0]}><cylinderGeometry args={[0.66, 0.86, 0.42, 4]} /><meshStandardMaterial {...white} /></mesh>
      <mesh position={[0, 8.68, 0]} castShadow><boxGeometry args={[0.82, 0.2, 0.82]} /><meshStandardMaterial {...gold} /></mesh>
      <mesh position={[0, 8.94, 0]} castShadow rotation={[0, Math.PI / 4, 0]}><cylinderGeometry args={[0.48, 0.66, 0.36, 4]} /><meshStandardMaterial {...white} /></mesh>
      <mesh position={[0, 9.3, 0]} castShadow><cylinderGeometry args={[0.2, 0.36, 0.42, 8]} /><meshStandardMaterial {...gold} /></mesh>
      <mesh position={[0, 9.73, 0]} castShadow><coneGeometry args={[0.25, 0.72, 8]} /><meshStandardMaterial {...white} /></mesh>
      <mesh position={[0, 10.13, 0]} castShadow><coneGeometry args={[0.1, 0.42, 10]} /><meshStandardMaterial {...gold} /></mesh>
    </group>
  )
}

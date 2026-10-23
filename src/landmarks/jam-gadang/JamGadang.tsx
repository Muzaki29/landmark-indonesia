import { useMemo } from 'react'
import { RoundedBox } from '@react-three/drei'
import { BufferGeometry, DoubleSide, Float32BufferAttribute } from 'three'
import { JAM_GADANG_MODEL } from './config'

const cream = { color: '#e8dfca', roughness: 0.72, metalness: 0.01 }
const creamEdge = { color: '#c9bda4', roughness: 0.78, metalness: 0 }
const red = { color: '#8f3e2f', roughness: 0.75, metalness: 0 }
const dark = { color: '#202722', roughness: 0.58, metalness: 0.08 }
const gold = { color: '#caa451', roughness: 0.32, metalness: 0.68 }

function ArchedOpening({ y, width = 0.6 }: { y: number; width?: number }) {
  return (
    <group position={[0, y, 1.72]}>
      <mesh castShadow><boxGeometry args={[width, 0.74, 0.055]} /><meshStandardMaterial {...dark} /></mesh>
      <mesh position={[0, 0.37, 0.002]} castShadow><circleGeometry args={[width / 2, 18, 0, Math.PI]} /><meshStandardMaterial {...dark} side={2} /></mesh>
    </group>
  )
}

function ClockFace({ rotation }: { rotation: number }) {
  return (
    <group rotation={[0, rotation, 0]}>
      <mesh position={[0, JAM_GADANG_MODEL.clockCentre, 1.76]} rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.72, 0.72, 0.1, 48]} /><meshStandardMaterial color="#efe9d9" roughness={0.58} /></mesh>
      <mesh position={[0, JAM_GADANG_MODEL.clockCentre, 1.825]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.71, 0.055, 8, 48]} /><meshStandardMaterial {...dark} /></mesh>
      {[[0, 0.52, 0], [0.52, 0, Math.PI / 2], [0, -0.52, 0], [-0.52, 0, Math.PI / 2]].map(([x, y, z], index) => <mesh key={index} position={[x, JAM_GADANG_MODEL.clockCentre + y, 1.89]} rotation={[0, 0, z]}><boxGeometry args={[0.05, 0.16, 0.025]} /><meshStandardMaterial {...dark} /></mesh>)}
      <mesh position={[0.12, JAM_GADANG_MODEL.clockCentre + 0.16, 1.9]} rotation={[0, 0, -0.6]}><boxGeometry args={[0.055, 0.48, 0.025]} /><meshStandardMaterial {...dark} /></mesh>
      <mesh position={[-0.2, JAM_GADANG_MODEL.clockCentre - 0.03, 1.91]} rotation={[0, 0, 1.25]}><boxGeometry args={[0.045, 0.42, 0.025]} /><meshStandardMaterial {...dark} /></mesh>
      <mesh position={[0, JAM_GADANG_MODEL.clockCentre, 1.925]}><sphereGeometry args={[0.075, 12, 8]} /><meshStandardMaterial {...gold} /></mesh>
    </group>
  )
}

function GonjongRoof() {
  const roof = useMemo(() => {
    const geometry = new BufferGeometry()
    const vertices: number[] = []
    const indices: number[] = []
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]]
    directions.forEach(([dx, dz], wing) => {
      const px = dz
      const pz = -dx
      const start = wing * 5
      vertices.push(
        0, 9.05, 0,
        dx * 1.75 + px * 1.72, 8.3, dz * 1.75 + pz * 1.72,
        dx * 2.05, 9.02, dz * 2.05,
        dx * 2.42, 10.15, dz * 2.42,
        dx * 1.75 - px * 1.72, 8.3, dz * 1.75 - pz * 1.72,
      )
      indices.push(start, start + 1, start + 2, start, start + 2, start + 4, start + 2, start + 1, start + 3, start + 2, start + 3, start + 4)
    })
    geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3))
    geometry.setIndex(indices)
    geometry.computeVertexNormals()
    return geometry
  }, [])

  return (
    <mesh geometry={roof} castShadow><meshStandardMaterial {...dark} side={DoubleSide} /></mesh>
  )
}

export function JamGadang() {
  return (
    <group name="Jam Gadang" position={[0, 0.18, 0]}>
      <RoundedBox args={[4.6, 0.28, 4.6]} radius={0.08} smoothness={3} position={[0, 0.14, 0]} receiveShadow><meshStandardMaterial {...creamEdge} /></RoundedBox>
      <RoundedBox args={[4.1, 0.32, 4.1]} radius={0.06} smoothness={3} position={[0, 0.44, 0]} receiveShadow><meshStandardMaterial {...cream} /></RoundedBox>
      <mesh position={[0, 2.18, 0]} castShadow receiveShadow><boxGeometry args={[3.65, 3.15, 3.65]} /><meshStandardMaterial {...cream} /></mesh>
      <mesh position={[0, 3.82, 0]}><boxGeometry args={[3.9, 0.18, 3.9]} /><meshStandardMaterial {...red} /></mesh>
      <mesh position={[0, 4.75, 0]} castShadow receiveShadow><boxGeometry args={[3.35, 1.68, 3.35]} /><meshStandardMaterial {...cream} /></mesh>
      <mesh position={[0, 5.66, 0]}><boxGeometry args={[3.65, 0.16, 3.65]} /><meshStandardMaterial {...red} /></mesh>
      <mesh position={[0, 6.15, 0]} castShadow receiveShadow><boxGeometry args={[3.28, 0.82, 3.28]} /><meshStandardMaterial {...creamEdge} /></mesh>
      {[0, Math.PI / 2, Math.PI, -Math.PI / 2].map((rotation) => <group key={rotation} rotation={[0, rotation, 0]}><ArchedOpening y={1.55} width={0.72} /><ArchedOpening y={2.75} width={0.58} /><ArchedOpening y={4.62} width={0.52} /></group>)}
      <mesh position={[0, 7.22, 0]} castShadow receiveShadow><boxGeometry args={[3.52, 1.95, 3.52]} /><meshStandardMaterial {...cream} /></mesh>
      <mesh position={[0, 8.16, 0]}><boxGeometry args={[3.82, 0.16, 3.82]} /><meshStandardMaterial {...red} /></mesh>
      {[0, Math.PI / 2, Math.PI, -Math.PI / 2].map((rotation) => <ClockFace key={rotation} rotation={rotation} />)}
      <GonjongRoof />
    </group>
  )
}

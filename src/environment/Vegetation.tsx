import { useLayoutEffect, useMemo, useRef } from 'react'
import { InstancedMesh, Object3D } from 'three'
import { MATERIALS } from '../materials/palette'

type Plant = readonly [x: number, z: number, scale: number]

const TREES: Plant[] = [
  [-7.1, -6.6, 1.05], [-5.7, -7.1, 0.8], [-3.9, -6.9, 0.9], [4.1, -6.9, 0.9], [5.8, -7.1, 0.8], [7.1, -6.5, 1.05],
  [-7.2, 6.4, 0.9], [-5.7, 7.1, 1.05], [-4.0, 6.9, 0.82], [4.0, 6.9, 0.82], [5.8, 7.1, 1.05], [7.2, 6.4, 0.9],
  [-7.0, -3.9, 0.8], [-7.1, -2.2, 1], [-7.0, 2.2, 1], [-7.0, 4.0, 0.82],
  [7.0, -4.0, 0.82], [7.1, -2.2, 1], [7.1, 2.2, 1], [7.0, 4.0, 0.8],
]

const SHRUBS: Plant[] = Array.from({ length: 28 }, (_, index) => {
  const angle = (index / 28) * Math.PI * 2
  const radius = 5.25 + (index % 2) * 0.12
  return [Math.cos(angle) * radius, Math.sin(angle) * radius, 0.78 + (index % 3) * 0.08] as const
})

function setInstances(mesh: InstancedMesh, plants: Plant[], y: number, heightScale = 1) {
  const dummy = new Object3D()
  plants.forEach(([x, z, scale], index) => {
    dummy.position.set(x, y * scale, z)
    dummy.scale.set(scale, scale * heightScale, scale)
    dummy.rotation.y = (index * 2.399) % (Math.PI * 2)
    dummy.updateMatrix()
    mesh.setMatrixAt(index, dummy.matrix)
  })
  mesh.instanceMatrix.needsUpdate = true
}

export function Vegetation() {
  const trunks = useRef<InstancedMesh>(null)
  const crowns = useRef<InstancedMesh>(null)
  const crownsUpper = useRef<InstancedMesh>(null)
  const shrubs = useRef<InstancedMesh>(null)
  const treeCount = TREES.length
  const shrubCount = SHRUBS.length
  const crownPlants = useMemo(() => TREES, [])

  useLayoutEffect(() => {
    if (trunks.current) setInstances(trunks.current, TREES, 0.45, 1.25)
    if (crowns.current) setInstances(crowns.current, crownPlants, 1.12, 0.9)
    if (crownsUpper.current) setInstances(crownsUpper.current, crownPlants, 1.55, 0.72)
    if (shrubs.current) setInstances(shrubs.current, SHRUBS, 0.22, 0.85)
  }, [crownPlants])

  return (
    <group>
      <instancedMesh ref={trunks} args={[undefined, undefined, treeCount]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 0.72, 7]} />
        <meshStandardMaterial {...MATERIALS.treeTrunk} />
      </instancedMesh>
      <instancedMesh ref={crowns} args={[undefined, undefined, treeCount]} castShadow receiveShadow>
        <icosahedronGeometry args={[0.48, 1]} />
        <meshStandardMaterial {...MATERIALS.foliage} flatShading />
      </instancedMesh>
      <instancedMesh ref={crownsUpper} args={[undefined, undefined, treeCount]} castShadow>
        <icosahedronGeometry args={[0.34, 1]} />
        <meshStandardMaterial {...MATERIALS.foliageLight} flatShading />
      </instancedMesh>
      <instancedMesh ref={shrubs} args={[undefined, undefined, shrubCount]} castShadow>
        <icosahedronGeometry args={[0.24, 1]} />
        <meshStandardMaterial {...MATERIALS.foliageLight} flatShading />
      </instancedMesh>
    </group>
  )
}

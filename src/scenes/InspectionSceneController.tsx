import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { Mesh, Plane, Vector3, type Material, type WebGLRenderer } from 'three'
import type { DisplayMode } from '../state/experienceState'
import { createDisplayMaterial, restoreMeshState, type OriginalMeshState } from './displayMaterials'

export function InspectionSceneController({ mode, sectionCut, axis, position }: { mode: DisplayMode; sectionCut: boolean; axis: 'x' | 'y' | 'z'; position: number }) {
  const { gl, scene, invalidate } = useThree()
  useEffect(() => {
    const subject = scene.getObjectByName('inspection-subject')
    if (!subject) return
    const originals = new Map<Mesh, OriginalMeshState>()
    const generated = new Set<Material>()
    const materialCopies = new Map<Material, Material>()
    const normal = axis === 'x' ? new Vector3(1, 0, 0) : axis === 'y' ? new Vector3(0, 1, 0) : new Vector3(0, 0, 1)
    const plane = new Plane(normal, -position * 6)
    const override = createDisplayMaterial(mode, sectionCut ? plane : null)
    if (override) generated.add(override)
    setLocalClipping(gl, sectionCut)

    subject.traverse((object) => {
      if (!(object instanceof Mesh)) return
      originals.set(object, { material: object.material, castShadow: object.castShadow, renderOrder: object.renderOrder })
      if (override) {
        object.material = override
        object.castShadow = mode === 'clay'
        object.renderOrder = mode === 'xray' ? 2 : object.renderOrder
      } else if (sectionCut) {
        object.material = copyWithClipping(object.material, plane, materialCopies, generated)
      }
    })
    invalidate()
    return () => {
      for (const [mesh, original] of originals) {
        restoreMeshState(mesh, original)
      }
      generated.forEach((material) => material.dispose())
      setLocalClipping(gl, false)
      invalidate()
    }
  }, [axis, gl, invalidate, mode, position, scene, sectionCut])
  return null
}

function copyWithClipping(material: Material | Material[], plane: Plane, copies: Map<Material, Material>, generated: Set<Material>): Material | Material[] {
  const copy = (source: Material) => {
    const existing = copies.get(source)
    if (existing) return existing
    const next = source.clone()
    next.clippingPlanes = [plane]
    copies.set(source, next)
    generated.add(next)
    return next
  }
  return Array.isArray(material) ? material.map(copy) : copy(material)
}

function setLocalClipping(renderer: WebGLRenderer, enabled: boolean) {
  renderer.localClippingEnabled = enabled
}

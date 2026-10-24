import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { Mesh, Plane, Vector3, type Material, type WebGLRenderer } from 'three'
import type { InspectionMode } from '../state/experienceState'

export function InspectionSceneController({ mode, axis, position }: { mode: InspectionMode; axis: 'x' | 'y' | 'z'; position: number }) {
  const { gl, scene, invalidate } = useThree()
  useEffect(() => {
    const subject = scene.getObjectByName('inspection-subject')
    if (!subject) return
    const originals = new Map<Mesh, Material | Material[]>()
    const normal = axis === 'x' ? new Vector3(1, 0, 0) : axis === 'y' ? new Vector3(0, 1, 0) : new Vector3(0, 0, 1)
    const plane = new Plane(normal, -position * 6)
    setLocalClipping(gl, mode === 'section-cut')
    subject.traverse((object) => {
      if (!(object instanceof Mesh)) return
      originals.set(object, object.material)
      const cloned = (Array.isArray(object.material) ? object.material : [object.material]).map((material) => {
        const next = material.clone()
        if (mode === 'xray') { next.transparent = true; next.opacity = 0.28; next.depthWrite = false }
        if (mode === 'section-cut') next.clippingPlanes = [plane]
        if (mode === 'blueprint' && 'wireframe' in next) {
          next.wireframe = true
          if ('color' in next && next.color) next.color.set('#e8c98a')
        }
        return next
      })
      object.material = Array.isArray(object.material) ? cloned : cloned[0]
    })
    invalidate()
    return () => {
      for (const [mesh, material] of originals) {
        ;(Array.isArray(mesh.material) ? mesh.material : [mesh.material]).forEach((item) => item.dispose())
        mesh.material = material
      }
      setLocalClipping(gl, false)
      invalidate()
    }
  }, [axis, gl, invalidate, mode, position, scene])
  return null
}

function setLocalClipping(renderer: WebGLRenderer, enabled: boolean) {
  renderer.localClippingEnabled = enabled
}

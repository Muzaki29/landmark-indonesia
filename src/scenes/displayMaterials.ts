import { DoubleSide, Mesh, MeshBasicMaterial, MeshStandardMaterial, Plane, type Material } from 'three'
import type { DisplayMode } from '../state/experienceState'

export type OriginalMeshState = { material: Material | Material[]; castShadow: boolean; renderOrder: number }

export function createDisplayMaterial(mode: DisplayMode, plane: Plane | null): Material | null {
  if (mode === 'real') return null
  if (mode === 'clay') return new MeshStandardMaterial({ color: '#d8cbb2', roughness: 0.88, metalness: 0, clippingPlanes: plane ? [plane] : [] })
  if (mode === 'xray') return new MeshStandardMaterial({ color: '#b9d5c8', emissive: '#183c35', emissiveIntensity: 0.18, roughness: 0.72, metalness: 0, transparent: true, opacity: 0.3, depthWrite: false, side: DoubleSide, clippingPlanes: plane ? [plane] : [] })
  return new MeshBasicMaterial({ color: '#e5c47d', wireframe: true, transparent: true, opacity: 0.82, clippingPlanes: [] })
}

export function restoreMeshState(mesh: Mesh, original: OriginalMeshState) {
  mesh.material = original.material
  mesh.castShadow = original.castShadow
  mesh.renderOrder = original.renderOrder
}

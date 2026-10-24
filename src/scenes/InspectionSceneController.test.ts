import { describe, expect, it } from 'vitest'
import { BoxGeometry, Mesh, MeshStandardMaterial } from 'three'
import { createDisplayMaterial, restoreMeshState } from './displayMaterials'

describe('display material controller', () => {
  it('restores the exact Real material and render state after Clay', () => {
    const real = new MeshStandardMaterial({ color: '#123456' })
    const mesh = new Mesh(new BoxGeometry(), real)
    const original = { material: mesh.material, castShadow: true, renderOrder: 4 }
    mesh.castShadow = original.castShadow
    mesh.renderOrder = original.renderOrder
    mesh.material = createDisplayMaterial('clay', null) as MeshStandardMaterial
    mesh.castShadow = false
    mesh.renderOrder = 2

    restoreMeshState(mesh, original)
    expect(mesh.material).toBe(real)
    expect(mesh.castShadow).toBe(true)
    expect(mesh.renderOrder).toBe(4)
  })

  it('uses one neutral rough Clay material and transparent limited X-Ray material', () => {
    const clay = createDisplayMaterial('clay', null) as MeshStandardMaterial
    const xray = createDisplayMaterial('xray', null) as MeshStandardMaterial
    expect(clay.metalness).toBe(0)
    expect(clay.roughness).toBeGreaterThanOrEqual(0.75)
    expect(xray.transparent).toBe(true)
    expect(xray.depthWrite).toBe(false)
    clay.dispose()
    xray.dispose()
  })
})

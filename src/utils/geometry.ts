import { BufferGeometry, Float32BufferAttribute } from 'three'

export function createTaperedBoxGeometry(
  bottomWidth: number,
  topWidth: number,
  height: number,
  depthScale = 1,
) {
  const bottom = bottomWidth / 2
  const top = topWidth / 2
  const bd = bottom * depthScale
  const td = top * depthScale
  const y = height / 2
  const vertices = [
    -bottom, -y, -bd, bottom, -y, -bd, bottom, -y, bd, -bottom, -y, bd,
    -top, y, -td, top, y, -td, top, y, td, -top, y, td,
  ]
  const indices = [
    0, 2, 1, 0, 3, 2, 4, 5, 6, 4, 6, 7,
    0, 1, 5, 0, 5, 4, 1, 2, 6, 1, 6, 5,
    2, 3, 7, 2, 7, 6, 3, 0, 4, 3, 4, 7,
  ]
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

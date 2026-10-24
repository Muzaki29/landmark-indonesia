export const INDONESIA_MAP = {
  width: 800,
  height: 320,
  bounds: {
    west: 95.293026,
    south: -10.359987,
    east: 141.033852,
    north: 5.479821,
  },
} as const

export function projectIndonesiaPoint(longitude: number, latitude: number) {
  const { width, height, bounds } = INDONESIA_MAP
  return {
    x: ((longitude - bounds.west) / (bounds.east - bounds.west)) * width,
    y: ((bounds.north - latitude) / (bounds.north - bounds.south)) * height,
  }
}

import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export function SceneTelemetry({ landmark, onReady }: { landmark: string; onReady: () => void }) {
  const reported = useRef(false)

  useFrame(({ gl }) => {
    if (reported.current) return
    reported.current = true
    gl.info.autoReset = false
    gl.info.reset()
    window.setTimeout(() => {
      window.__LANDMARK_STATS__ = {
        landmark,
        calls: gl.info.render.calls,
        triangles: gl.info.render.triangles,
        geometries: gl.info.memory.geometries,
        textures: gl.info.memory.textures,
      }
      gl.info.autoReset = true
    }, 0)
    onReady()
  })

  useEffect(() => () => { delete window.__LANDMARK_STATS__ }, [])
  return null
}

declare global {
  interface Window {
    __LANDMARK_STATS__?: {
      landmark: string
      calls: number
      triangles: number
      geometries: number
      textures: number
    }
  }
}

import { useEffect, useRef } from 'react'
import { OrbitControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

interface CameraControlsProps {
  resetNonce: number
}

export function CameraControls({ resetNonce }: CameraControlsProps) {
  const controls = useRef<OrbitControlsImpl>(null)
  const { camera, size, invalidate } = useThree()
  const portrait = size.height > size.width * 1.08

  useEffect(() => {
    const position: [number, number, number] = portrait ? [21, 16.5, 28] : [19.5, 15.5, 22]
    const targetX = portrait ? -2.25 : 0
    camera.position.set(...position)
    camera.lookAt(targetX, 5.05, 0)
    if (controls.current) {
      controls.current.enableDamping = false
      controls.current.target.set(targetX, 5.05, 0)
      controls.current.update()
      controls.current.enableDamping = true
      controls.current.saveState()
    }
    window.__LANDMARK_CAMERA__ = camera.position.toArray()
    invalidate()
  }, [camera, invalidate, portrait, resetNonce])

  return (
    <OrbitControls
      key={`${portrait}-${resetNonce}`}
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.075}
      enablePan={false}
      minDistance={11}
      maxDistance={34}
      minPolarAngle={0.35}
      maxPolarAngle={Math.PI / 2.08}
      rotateSpeed={0.62}
      zoomSpeed={0.78}
      onChange={() => {
        window.__LANDMARK_CAMERA__ = camera.position.toArray()
      }}
    />
  )
}

declare global {
  interface Window {
    __LANDMARK_CAMERA__?: number[]
  }
}

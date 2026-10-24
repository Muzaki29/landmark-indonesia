import { useEffect, useRef } from 'react'
import { OrbitControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { Vector3 } from 'three'
import type { CameraView, Hotspot } from '../data/heritage'

export interface ViewerCommand {
  id: number
  type: 'zoom-in' | 'zoom-out'
}

interface CameraControlsProps {
  landmark: 'monas' | 'tugu-pal-putih' | 'jam-gadang'
  resetNonce: number
  focus?: Hotspot | null
  cameraView?: CameraView | null
  command?: ViewerCommand | null
}

const CAMERA_PROFILES = {
  monas: { desktop: [18.5, 13.5, 22] as const, portrait: [20, 15.5, 28] as const, target: [-1.5, 5.1, 0] as const },
  'tugu-pal-putih': { desktop: [17.5, 12.5, 21] as const, portrait: [19, 15, 27] as const, target: [-1.35, 4.8, 0] as const },
  'jam-gadang': { desktop: [18.5, 13.2, 22] as const, portrait: [20, 15.2, 28] as const, target: [-1.45, 4.7, 0] as const },
}

export function CameraControls({ landmark, resetNonce, focus, cameraView, command }: CameraControlsProps) {
  const controls = useRef<OrbitControlsImpl>(null)
  const transitionToken = useRef(0)
  const { camera, size, invalidate } = useThree()
  const portrait = size.height > size.width * 1.08
  const profile = CAMERA_PROFILES[landmark]

  useEffect(() => {
    transitionToken.current += 1
    const position = portrait ? profile.portrait : profile.desktop
    camera.position.set(position[0], position[1], position[2])
    camera.lookAt(profile.target[0], profile.target[1], profile.target[2])
    if (controls.current) {
      controls.current.enableDamping = false
      controls.current.target.set(profile.target[0], profile.target[1], profile.target[2])
      controls.current.update()
      controls.current.enableDamping = true
      controls.current.saveState()
    }
    window.__LANDMARK_CAMERA__ = camera.position.toArray()
    invalidate()
  }, [camera, invalidate, portrait, profile, resetNonce])

  useEffect(() => {
    const token = ++transitionToken.current
    const destination = focus?.targetCamera ?? (cameraView ? { position: cameraView.position, target: cameraView.target } : null)
    if (!destination || !controls.current) return
    const control = controls.current
    const fromPosition = camera.position.clone()
    const fromTarget = control.target.clone()
    const toPosition = new Vector3(...destination.position)
    const toTarget = new Vector3(...destination.target)
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const duration = reducedMotion ? 0 : 520
    const started = performance.now()
    let frame = 0

    const update = (now: number) => {
      if (token !== transitionToken.current) return
      const progress = duration === 0 ? 1 : Math.min((now - started) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      camera.position.lerpVectors(fromPosition, toPosition, eased)
      control.target.lerpVectors(fromTarget, toTarget, eased)
      control.update()
      invalidate()
      if (progress < 1) frame = requestAnimationFrame(update)
    }
    frame = requestAnimationFrame(update)
    return () => { transitionToken.current += 1; cancelAnimationFrame(frame) }
  }, [camera, cameraView, focus, invalidate])

  useEffect(() => {
    if (!command || !controls.current) return
    const control = controls.current
    const offset = camera.position.clone().sub(control.target)
    const distance = Math.min(34, Math.max(11, offset.length() * (command.type === 'zoom-in' ? 0.82 : 1.18)))
    camera.position.copy(control.target).add(offset.setLength(distance))
    control.update()
    invalidate()
  }, [camera, command, invalidate])

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
      onStart={() => { transitionToken.current += 1 }}
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

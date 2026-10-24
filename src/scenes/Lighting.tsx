import { Environment, Lightformer } from '@react-three/drei'

export function Lighting() {
  return (
    <>
      <hemisphereLight args={['#f7e7ca', '#17271f', 1.35]} />
      <directionalLight
        color="#ffd79b"
        intensity={4.15}
        position={[-10, 16, 9]}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={3}
        shadow-camera-far={38}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={14}
        shadow-camera-bottom={-8}
        shadow-bias={-0.00035}
      />
      <directionalLight color="#a7c1b7" intensity={0.58} position={[10, 9, -11]} />
      <Environment resolution={64}>
        <Lightformer form="rect" intensity={2.35} color="#ffddb0" position={[-9, 11, 7]} scale={[9, 8, 1]} />
        <Lightformer form="ring" intensity={0.72} color="#b4cdc4" position={[9, 6, -9]} scale={5} />
      </Environment>
    </>
  )
}

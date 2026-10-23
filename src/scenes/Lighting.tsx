import { Environment, Lightformer } from '@react-three/drei'

export function Lighting() {
  return (
    <>
      <hemisphereLight args={['#fff6df', '#34463d', 1.7]} />
      <directionalLight
        color="#fff1d4"
        intensity={3.4}
        position={[-8, 15, 9]}
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
      <directionalLight color="#bdd7df" intensity={0.65} position={[9, 8, -10]} />
      <Environment resolution={64}>
        <Lightformer form="rect" intensity={2.1} color="#ffe8bd" position={[-8, 10, 6]} scale={[8, 8, 1]} />
        <Lightformer form="ring" intensity={0.9} color="#c9e1dc" position={[8, 5, -8]} scale={5} />
      </Environment>
    </>
  )
}

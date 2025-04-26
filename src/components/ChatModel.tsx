"use client"

import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment, ContactShadows } from '@react-three/drei'
import { useTheme } from './theme-provider'
import * as THREE from 'three'

function Model() {
  const { theme } = useTheme()
  const meshRef = useRef<THREE.Mesh>(null!)
  
  // Simple cube as placeholder - can be replaced with a more complex model using useGLTF
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2
      meshRef.current.rotation.y += delta * 0.3
    }
  })

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial 
        color={theme === 'dark' ? '#ECDFCC' : '#3C3D37'} 
        metalness={0.5}
        roughness={0.3}
      />
    </mesh>
  )
}

// Uncomment and modify this if you want to use a GLTF model
// function ImportedModel() {
//   const { scene } = useGLTF('/path/to/your/model.gltf')
//   return <primitive object={scene} scale={1.5} position={[0, -1, 0]} />
// }

export default function ChatModel() {
  const { theme } = useTheme()
  
  return (
    <div className="w-full h-full min-h-[400px]">
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 80 }}>
        <color 
          attach="background" 
          args={[theme === 'dark' ? '#181C14' : '#EEF1DA']} 
        />
        <ambientLight intensity={0.5} />
        <spotLight 
          position={[10, 10, 10]} 
          angle={0.15} 
          penumbra={1} 
          intensity={1} 
          castShadow 
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Model />
        {/* <ImportedModel /> */}
        
        <OrbitControls enableZoom={false} />
        <Environment  files="/ambients/venice.hdr" background={false} />
        <ContactShadows 
          opacity={0.4} 
          scale={5} 
          blur={2.4} 
          position={[0, -2, 0]} 
        />
      </Canvas>
    </div>
  )
}

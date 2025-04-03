import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface UnderwaterParticlesProps {
  count?: number;
  color?: string;
  size?: number;
  bounds?: number;
  speed?: number;
}

export default function UnderwaterParticles({
  count = 200,
  color = '#ffffff',
  size = 0.05,
  bounds = 20,
  speed = 0.05
}: UnderwaterParticlesProps) {
  const mesh = useRef<THREE.Points>(null!);
  
  // Create particles with random positions
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = Math.random() * bounds * 2 - bounds;
      const y = Math.random() * bounds * 2 - bounds;
      const z = Math.random() * bounds * 2 - bounds;
      
      // Random velocities for each particle
      const vx = (Math.random() - 0.5) * 0.01;
      const vy = (Math.random() * 0.01) + 0.002; // Slight upward bias
      const vz = (Math.random() - 0.5) * 0.01;
      
      temp.push({ x, y, z, vx, vy, vz });
    }
    return temp;
  }, [count, bounds]);
  
  // Create particle geometry
  const particlesGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = particles[i].x;
      positions[i * 3 + 1] = particles[i].y;
      positions[i * 3 + 2] = particles[i].z;
      
      // Random sizes for particles
      sizes[i] = Math.random() * size;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    return geometry;
  }, [particles, count, size]);
  
  // Update particle positions
  useFrame(() => {
    if (!mesh.current) return;
    
    const positions = mesh.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      // Update position with velocity
      particles[i].x += particles[i].vx;
      particles[i].y += particles[i].vy * speed;
      particles[i].z += particles[i].vz;
      
      // Reset particles that move out of bounds
      if (particles[i].y > bounds) {
        particles[i].y = -bounds;
      }
      
      // Keep particles within horizontal bounds with wrapping
      if (particles[i].x > bounds) particles[i].x = -bounds;
      if (particles[i].x < -bounds) particles[i].x = bounds;
      if (particles[i].z > bounds) particles[i].z = -bounds;
      if (particles[i].z < -bounds) particles[i].z = bounds;
      
      // Update the buffer
      positions[i * 3] = particles[i].x;
      positions[i * 3 + 1] = particles[i].y;
      positions[i * 3 + 2] = particles[i].z;
    }
    
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });
  
  return (
    <points ref={mesh} geometry={particlesGeometry}>
      <pointsMaterial
        color={color}
        size={size}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

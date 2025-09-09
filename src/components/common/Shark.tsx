import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';

interface SharkProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  isScrolling?: boolean;
  scrollProgress?: number; // Add scroll progress prop
}

export default function Shark({
  position = [20, 0, 0],
  rotation = [0, -Math.PI / 1.5, 0],
  scale = 3,
  isScrolling = false,
  scrollProgress = 0 // Default to 0 (start of scroll)
}: SharkProps) {
  const group = useRef<THREE.Group>(null!);
  const { scene, animations } = useGLTF('/glb/waltz.glb', '/draco/'); // Path to shark model, Draco decoder path
  const { actions, mixer } = useAnimations(animations, group);
  const actionRef = useRef<THREE.AnimationAction | null>(null);
  
  // Log Draco usage indicator and compression info
  useEffect(() => {
    console.log("🦈 Shark model loaded with Draco decoder support enabled");
    console.log("🔧 Draco decoder path: /draco/");
    
    // Log compression information if available
    if (scene) {
      // Calculate estimated original size based on geometry
      let originalSize = 0;
      let compressedSize = 0;
      
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.geometry) {
          const geometry = child.geometry;
          
          // Estimate original size based on vertex count and attributes
          const vertexCount = geometry.attributes.position ? geometry.attributes.position.count : 0;
          const indexCount = geometry.index ? geometry.index.count : 0;
          
          // Estimate uncompressed size (positions + normals + uvs + indices)
          const positionSize = vertexCount * 3 * 4; // 3 floats per vertex
          const normalSize = geometry.attributes.normal ? vertexCount * 3 * 4 : 0;
          const uvSize = geometry.attributes.uv ? vertexCount * 2 * 4 : 0;
          const indexSize = indexCount * 2; // assuming 16-bit indices
          
          const meshOriginalSize = positionSize + normalSize + uvSize + indexSize;
          originalSize += meshOriginalSize;
          
          // For compressed size, we'll use a rough estimate since we can't get exact Draco size
          // Draco typically achieves 3-10x compression ratio
          const estimatedCompressionRatio = 6; // Conservative estimate
          compressedSize += meshOriginalSize / estimatedCompressionRatio;
          
          console.log(`📊 Mesh geometry stats:
            • Vertices: ${vertexCount.toLocaleString()}
            • Indices: ${indexCount.toLocaleString()}
            • Estimated uncompressed size: ${(meshOriginalSize / 1024).toFixed(2)} KB
            • Estimated Draco compressed size: ${(meshOriginalSize / estimatedCompressionRatio / 1024).toFixed(2)} KB
            • Estimated compression ratio: ${estimatedCompressionRatio}:1`);
        }
      });
      
      if (originalSize > 0) {
        const compressionRatio = originalSize / compressedSize;
        console.log(`🗜️ Total Draco compression summary:
          • Estimated original GLB geometry size: ${(originalSize / 1024).toFixed(2)} KB
          • Estimated Draco compressed size: ${(compressedSize / 1024).toFixed(2)} KB
          • Space saved: ${((originalSize - compressedSize) / 1024).toFixed(2)} KB
          • Compression ratio: ${compressionRatio.toFixed(1)}:1
          • Size reduction: ${((1 - compressedSize / originalSize) * 100).toFixed(1)}%`);
      }
    }
  }, [scene]);
  
  // Set up animation on load
  useEffect(() => {
    // Check for available animations - the actual animation name may differ
    // based on your 3D model, you might need to adjust this
    const animationName = Object.keys(actions)[0];
    
    if (animationName && actions[animationName]) {
      // Store the action for reference
      actionRef.current = actions[animationName];
      
      // Start the animation but set timeScale to 0 (effectively paused)
      actionRef.current.reset().play();
      actionRef.current.timeScale = 0;
    } else {
      console.log("Available animations for shark:", Object.keys(actions));
    }
    
    return () => {
      // Clean up animation on unmount
      if (actionRef.current) {
        actionRef.current.stop();
      }
    };
  }, [actions]);
  
  // Control animation speed based on scrolling state - doubled for faster animation
  useEffect(() => {
    if (actionRef.current) {
      // Set animation speed based on scrolling state - doubled to 2x speed when scrolling
      gsap.to(actionRef.current, {
        timeScale: isScrolling ? 2 : 0.3, // Doubled speed when scrolling, slight movement when not scrolling
        duration: 0.2,
      });
    }
  }, [isScrolling]);

  // Add subtle movement when idle and adjust scale or Z position based on scroll progress
  useFrame((_, delta) => {
    if (mixer) {
      mixer.update(delta);
    }
    
    if (group.current) {
      // Add subtle movement when not scrolling
      if (!isScrolling) {
        group.current.position.y += Math.sin(Date.now() * 0.001) * delta * 0.1;
        group.current.rotation.z += Math.sin(Date.now() * 0.0005) * delta * 0.02;
      } else {
        // Add auto-rotation when scrolling
        // Rotate around the y-axis based on scroll progress
        const rotationSpeed = delta * (1 + scrollProgress * 1.5); // Base rotation speed
        group.current.rotation.y += rotationSpeed; // Continuous rotation when scrolling
      }
      
      // Update position based on original position prop
      group.current.position.x = position[0];
      group.current.position.y = position[1];
      
      // Make shark move farther away (increase Z) or become smaller (decrease scale) as we scroll
      // Option 1: Move farther away (Z axis)
      const zOffset = scrollProgress * 20; // Move up to 20 units away as scroll progresses
      group.current.position.z = zOffset;
      
      // Option 2: Scale down (alternatively, you could use this instead)
      const scaleMultiplier = Math.max(0.2, 1 - scrollProgress * 0.8); // Scale down to 20% of original size
      group.current.scale.setScalar(scale * scaleMultiplier);
    }
  });

  return (
    <primitive 
      ref={group}
      object={scene} 
      position={[position[0], position[1], 0]} // Z will be set dynamically in useFrame
      rotation={rotation}
      scale={scale} // Base scale will be modified in useFrame
    />
  );
}

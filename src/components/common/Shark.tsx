import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";

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
  scrollProgress = 0, // Default to 0 (start of scroll)
}: SharkProps) {
  const group = useRef<THREE.Group>(null!);
  const { scene, animations } = useGLTF("/glb/waltz.glb", "/draco/"); // Path to shark model, Draco decoder path
  const { actions, mixer } = useAnimations(animations, group);
  const actionRef = useRef<THREE.AnimationAction | null>(null);
  const isInitialized = useRef(false);

  // Calculate compression information on load
  useEffect(() => {
    // Compression calculation logic removed for performance
  }, [scene]);

  // Set up animation on load
  useEffect(() => {
    if (!scene || Object.keys(actions).length === 0) return;

    const animationName = Object.keys(actions)[0];

    if (animationName && actions[animationName]) {
      actionRef.current = actions[animationName];
      actionRef.current.reset().play();
      actionRef.current.timeScale = 0;
      isInitialized.current = true;
    }

    return () => {
      if (actionRef.current) {
        actionRef.current.stop();
      }
      isInitialized.current = false;
    };
  }, [actions, scene]);

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
  useFrame((state, delta) => {
    // Only proceed if component is initialized
    if (!isInitialized.current || !group.current) return;

    // Update mixer for animations
    if (mixer) {
      mixer.update(delta);
    }

    const time = state.clock.getElapsedTime();

    // Update position based on original position prop
    group.current.position.x = position[0];

    // Add subtle movement when not scrolling
    if (!isScrolling) {
      group.current.position.y = position[1] + Math.sin(time * 1.0) * 0.1;
      group.current.rotation.z = rotation[2] + Math.sin(time * 0.5) * 0.02;
    } else {
      // Add auto-rotation when scrolling
      const rotationSpeed = delta * (1 + scrollProgress * 1.5);
      group.current.rotation.y += rotationSpeed;
      group.current.position.y = position[1];
    }

    // Make shark move farther away (increase Z) or become smaller (decrease scale) as we scroll
    const zOffset = scrollProgress * 20;
    group.current.position.z = zOffset;

    const scaleMultiplier = Math.max(0.2, 1 - scrollProgress * 0.8);
    group.current.scale.setScalar(scale * scaleMultiplier);
  });

  if (!scene) return null;

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

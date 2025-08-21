"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Environment,
  ContactShadows,
} from "@react-three/drei";
import { useTheme } from "./theme-provider";
import * as THREE from "three";

function ImportedModel() {
  const { scene } = useGLTF("/glb/blackhole.glb");
  const modelRef = useRef<THREE.Group>(null!);

  useFrame((state, delta) => {
    if (modelRef.current) {
      // Slow rotation for dramatic effect
      modelRef.current.rotation.y += delta * 0.2;
      // Subtle oscillation up and down
      modelRef.current.position.y =
        -1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  // Position adjusted to better appear on the left side
  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={1.5}
      position={[-1, 6, 0]}
    />
  );
}

function BlackholeParticles() {
  const count = 500; // Number of particles
  // Change to viewport center - this is the center point where particles will shrink towards
  const attractionPoint = new THREE.Vector3(-1, -1, 0);
  // Add cursor position as a second attraction point
  const cursorPoint = useRef(new THREE.Vector3(100, 100, 0)); // Start far away to have no initial effect

  // Create particles with random positions
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      // Distribute particles in a sphere around the viewport
      const radius = 10 + Math.random() * 15;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);

      // Position relative to the center of the viewport, not the blackhole
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      // Each particle has position, velocity, and size
      temp.push({
        position: new THREE.Vector3(x, y, z),
        velocity: new THREE.Vector3(0, 0, 0),
        size: 0.05 + Math.random() * 0.1,
      });
    }
    return temp;
  }, []);

  // Create references for instanced mesh and particles
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Set up mouse tracking
  useEffect(() => {
    // Convert mouse position to normalized device coordinates (-1 to +1)
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      // Set cursor point at a fixed z distance to create a plane in 3D space
      cursorPoint.current.set(x * 10, y * 5, 5);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Animation loop for particles
  useFrame((_, delta) => {
    if (instancedMeshRef.current) {
      particles.forEach((particle, i) => {
        // Calculate direction to the main attraction point (blackhole center)
        const directionToCenter = new THREE.Vector3()
          .subVectors(attractionPoint, particle.position)
          .normalize();
        const distanceToCenter = particle.position.distanceTo(attractionPoint);
        const gravity =
          Math.max(0.01, 1 / (distanceToCenter * distanceToCenter)) * 0.5;

        // Calculate direction and force to cursor - subtle magnetic effect
        const directionToCursor = new THREE.Vector3()
          .subVectors(cursorPoint.current, particle.position)
          .normalize();
        const distanceToCursor = particle.position.distanceTo(
          cursorPoint.current
        );

        // Subtle magnetic effect that's stronger when particles are closer to cursor
        // but doesn't overpower the black hole's main attraction
        const maxCursorDistance = 6; // Maximum effective distance
        const cursorInfluence = Math.max(
          0,
          1 - distanceToCursor / maxCursorDistance
        );
        const cursorForce = cursorInfluence * 0.3; // Subtle force multiplier

        // Apply forces to velocity - blackhole is primary, cursor is secondary
        particle.velocity.add(
          directionToCenter.multiplyScalar(gravity * delta)
        );
        particle.velocity.add(
          directionToCursor.multiplyScalar(cursorForce * delta)
        );

        // Add some damping to prevent excessive speed
        particle.velocity.multiplyScalar(0.98);

        // Update position
        particle.position.add(particle.velocity);

        // If particle gets too close to the center, reset it at a random far position
        if (distanceToCenter < 1) {
          // Reset particle position
          const radius = 15 + Math.random() * 10;
          const theta = Math.random() * 2 * Math.PI;
          const phi = Math.acos(2 * Math.random() - 1);

          particle.position.set(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.sin(phi) * Math.sin(theta),
            radius * Math.cos(phi)
          );
          particle.velocity.set(0, 0, 0);
        }

        // Scale down particles as they get closer to the center or cursor
        const scale = Math.min(
          particle.size,
          particle.size * (distanceToCenter / 8),
          // Make particles glow a bit when near cursor by increasing their size slightly
          distanceToCursor < 3 ? particle.size * 1.5 : particle.size
        );

        // Update instanced mesh
        dummy.position.copy(particle.position);
        dummy.scale.set(scale, scale, scale);
        dummy.updateMatrix();
        instancedMeshRef.current.setMatrixAt(i, dummy.matrix);
      });

      instancedMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={instancedMeshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial
        color="#ffffff"
        transparent
        opacity={0.8}
        metalness={0.8}
        roughness={0.2}
        envMapIntensity={1}
      />
    </instancedMesh>
  );
}

// Camera controller for slow random position changes
function CameraController() {
  const { camera } = useThree();
  const targetPosition = useRef(new THREE.Vector3(7, 0, 10));
  const targetFOV = useRef(30); // Default FOV
  const lerpSpeed = 0.015; // Increased for more noticeable movement

  useEffect(() => {
    // Set new random position and FOV targets every 6 seconds (more frequent changes)
    const interval = setInterval(() => {
      // Generate more dramatic random position within wider bounds
      const x = 7 + (Math.random() * 10 - 5); // 7 ± 5
      const y = Math.random() * 8 - 4; // ± 4
      const z = 10 + (Math.random() * 8 - 4); // 10 ± 4

      targetPosition.current.set(x, y, z);

      // Random FOV between 25 (zoomed in) and 40 (zoomed out)
      targetFOV.current = 25 + Math.random() * 15;
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  useFrame((state) => {
    // Smoothly interpolate camera position with increased speed
    camera.position.lerp(targetPosition.current, lerpSpeed);

    // Smoothly interpolate FOV for zoom effect
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov += (targetFOV.current - camera.fov) * 0.05;
    }

    // Ensure camera always looks at the scene center/blackhole
    camera.lookAt(new THREE.Vector3(-1, 0, 0));

    // Add more pronounced continuous motion
    const time = state.clock.elapsedTime;
    camera.position.x += Math.sin(time * 0.5) * 0.03;
    camera.position.y += Math.cos(time * 0.4) * 0.02;
    camera.position.z += Math.sin(time * 0.3) * 0.02;

    camera.updateProjectionMatrix();
  });

  return null;
}

export default function ChatModel() {
  const { theme } = useTheme();

  return (
    <div className="w-full h-full min-h-[400px] absolute left-0 top-0 pointer-events-none">
      <Canvas shadows camera={{ position: [7, 0, 10], fov: 30 }}>
        <color
          attach="background"
          args={[
            theme === "dark"
              ? "rgba(24, 28, 20, 0.2)"
              : "rgba(238, 241, 218, 0.2)",
          ]}
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

        <ImportedModel />
        <BlackholeParticles />

        <CameraController />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
        />
        <Environment files="/ambients/venice.hdr" background={false} />
        <ContactShadows
          opacity={0.4}
          scale={5}
          blur={2.4}
          position={[0, -2, 0]}
        />
      </Canvas>
    </div>
  );
}

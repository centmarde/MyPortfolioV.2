import { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, useAnimations, Html, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollReminder } from '../components/common/Dropdown'; // Import is now correctly referenced
import Shark from '../components/common/Shark'; // Import the new Shark component
import UnderwaterParticles from '../components/common/UnderwaterParticles'; // Import particles

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// 3D Model component
interface ModelProps {
  path: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  isScrolling?: boolean; // Add prop to control animation
}

const Model = ({ path, scale = 1, position = [0, 0, 0], rotation = [0, 0, 0], isScrolling = false }: ModelProps) => {
  const group = useRef<THREE.Group>(null!);
  const { scene, animations } = useGLTF(path);
  const { actions, mixer } = useAnimations(animations, group);
  const actionRef = useRef<THREE.AnimationAction | null>(null);
  
  // Set up animation on load
  useEffect(() => {
    if (actions["rig.001|rig.001Action"]) {
      // Store the action for reference
      actionRef.current = actions["rig.001|rig.001Action"];
      
      // Start the animation but set timeScale to 0 (effectively paused)
      actionRef.current.reset().play();
      actionRef.current.timeScale = 0;
    } else {
      console.log("Available animations:", Object.keys(actions));
    }
    
    return () => {
      // Clean up animation on unmount
      if (actionRef.current) {
        actionRef.current.stop();
      }
    };
  }, [actions]);
  
  // Control animation speed based on scrolling state
  useEffect(() => {
    if (actionRef.current) {
      // Set animation speed based on scrolling state
      gsap.to(actionRef.current, {
        timeScale: isScrolling ? 1 : 0,
        duration: 0.2, // Short transition for smooth pause/resume
      });
    }
  }, [isScrolling]);

  // Update position based on passed prop
  useEffect(() => {
    if (group.current) {
      group.current.position.set(...position);
    }
  }, [position]);

  // Use useFrame to ensure the mixer updates even when paused
  useFrame((state, delta) => {
    if (mixer) {
      mixer.update(delta);
    }
  });

  return (
    <primitive 
      ref={group}
      object={scene} 
      scale={scale} 
      rotation={rotation} 
    />
  );
};

// Enhanced underwater lighting setup
const UnderwaterLighting = () => {
  const lightRayRef = useRef<THREE.SpotLight>(null!);
  const lightRay2Ref = useRef<THREE.SpotLight>(null!);
  const ambientRef = useRef<THREE.AmbientLight>(null!);
  
  // Use useFrame to animate the light rays
  useFrame(({clock}) => {
    const time = clock.getElapsedTime();
    
    // Animate intensity for the sunrays to create a subtle fluctuating effect
    if (lightRayRef.current) {
      lightRayRef.current.intensity = 3 + Math.sin(time * 0.5) * 0.5;
      lightRayRef.current.position.x = Math.sin(time * 0.2) * 2;
    }
    
    if (lightRay2Ref.current) {
      lightRay2Ref.current.intensity = 2 + Math.cos(time * 0.3) * 0.3;
      lightRay2Ref.current.position.x = Math.sin(time * 0.1) * -3;
    }
    
    // Subtle ambient light fluctuation
    if (ambientRef.current) {
      ambientRef.current.intensity = 0.6 + Math.sin(time * 0.2) * 0.1;
    }
  });
  
  return (
    <>
      {/* Deep blue ambient light for underwater feeling */}
      <ambientLight ref={ambientRef} color="#104673" intensity={0.6} />
      
      {/* Main directional light (sun through water) */}
      <directionalLight
        position={[0, 10, 5]}
        intensity={0.8}
        color="#8ab8d8"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      
      {/* Light rays coming from above */}
      <spotLight
        ref={lightRayRef}
        position={[2, 15, -2]}
        angle={0.5}
        penumbra={1}
        intensity={3.5}
        color="#a6d1ff"
        castShadow
        distance={25}
      />
      
      <spotLight
        ref={lightRay2Ref}
        position={[-5, 12, 0]}
        angle={0.4}
        penumbra={0.8}
        intensity={2.5}
        color="#aed4ff"
        castShadow
        distance={20}
      />
      
      {/* Subtle backlight to emphasize silhouettes */}
      <pointLight position={[0, -5, -10]} intensity={0.2} color="#0a2b4a" />
    </>
  );
};

// Simple loading fallback component
const LoadingFallback = () => {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        <div className="text-2xl font-bold mb-2">Loading</div>
        <div className="text-lg">{progress.toFixed(0)}%</div>
      </div>
    </Html>
  );
};

export default function Hero() {
  // State to track both position, rotation, and scrolling status
  const [modelPosition, setModelPosition] = useState<[number, number, number]>([-20, 0, 0]);
  const [modelRotation, setModelRotation] = useState<[number, number, number]>([5.3, 3, 0]);
  const [sharkPosition, setSharkPosition] = useState<[number, number, number]>([20, 0, 0]);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0); // Add state for scroll progress
  const [isLoaded, setIsLoaded] = useState(false);
  const [showScrollReminder, setShowScrollReminder] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  
  // Timer to track when scrolling stops
  const scrollTimer = useRef<NodeJS.Timeout | null>(null);
  
  // Set up the scroll trigger for animation
  useEffect(() => {
    if (!containerRef.current || !isLoaded || !quoteRef.current) return;
    
    // Create GSAP animation for the model position and rotation
    gsap.to({}, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true, // Smooth scrubbing effect
        onUpdate: (self) => {
          // Store the overall scroll progress for use with the shark
          setScrollProgress(self.progress);
          
          // Map scroll progress to x position from -20 (left) to 20 (right)
          const xPosition = gsap.utils.interpolate(-20, 20, self.progress);
          
          // Create a smooth sine wave pattern for y-axis movement
          const yPosition = Math.sin(self.progress * Math.PI * 2) * 2;
          
          // Create a subtle x-axis rotation that follows the vertical movement
          const xRotationOffset = Math.cos(self.progress * Math.PI * 2) * 0.5;
          const baseXRotation = 5.3;
          
          // Add a subtle z-axis rotation for a gentle rolling effect
          const zRotationOffset = Math.sin(self.progress * Math.PI * 3) * 0.2;
          
          setModelPosition([xPosition, yPosition, 0]);
          setModelRotation([
            baseXRotation + xRotationOffset, 
            1.5, 
            zRotationOffset
          ]);

          // Set shark position with opposite movement pattern
          const sharkXPosition = gsap.utils.interpolate(20, -20, self.progress);
          const sharkYPosition = Math.sin(self.progress * Math.PI * -5 + Math.PI) * 2; // Offset phase
          setSharkPosition([sharkXPosition, sharkYPosition, 0]);
          
          // Indicate that scrolling is happening
          setIsScrolling(true);
          
          // Clear any existing timer
          if (scrollTimer.current) {
            clearTimeout(scrollTimer.current);
          }
          
          // Set a timer to detect when scrolling stops
          scrollTimer.current = setTimeout(() => {
            setIsScrolling(false);
          }, 150); // 150ms delay before considering scrolling has stopped
        },
      }
    });

    // Combined fade-in and fade-out animation for the quote
    gsap.fromTo(
      quoteRef.current,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "50% top", // Fade-in duration
          scrub: true,
        },
        onComplete: () => {
          // Trigger fade-out after fade-in completes
          gsap.to(quoteRef.current, {
            opacity: 0,
            y: -20,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "50% top", // Start fade-out after fade-in ends
              end: "bottom bottom", // Complete fade-out by the bottom
              scrub: true,
            },
          });
        },
      }
    );

    return () => {
      // Clean up ScrollTrigger and any pending timers
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
    };
  }, [isLoaded]); // Only set up scroll trigger when loaded

  // Prevent scrolling while loading
  useEffect(() => {
    if (!isLoaded) {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
    } else {
      document.body.style.overflow = '';
      document.body.style.height = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, [isLoaded]);

  // Handle content loaded
  const handleContentLoaded = () => {
    setIsLoaded(true);
  };

  // Add an effect to handle visibility when returning to the Hero section
  useEffect(() => {
    const handleVisibilityOnIntersect = () => {
      // Check if we're at the top of the page
      if (window.scrollY < 100 && isLoaded) {
        setShowScrollReminder(true);
      }
    };

    // Add scroll event listener for returning to top
    window.addEventListener("scroll", handleVisibilityOnIntersect);
    
    return () => {
      window.removeEventListener("scroll", handleVisibilityOnIntersect);
    };
  }, [isLoaded]);

  return (
    <div 
      ref={containerRef} 
      className="h-[1000vh] w-full bg-light-primary dark:bg-dark-background"
    >
      {/* Display a simple loading indicator if needed */}
      {!isLoaded && (
        <div className="fixed inset-0 bg-light-primary dark:bg-dark-background z-50 flex items-center justify-center">
          <div className="text-2xl font-bold">Loading...</div>
        </div>
      )}
      
      {/* Quote container - updated with theme colors */}
      <div 
        ref={quoteRef}
        className="fixed md:top-1/2 md:right-12 top-1/3 left-1/2 transform -translate-x-1/2 md:-translate-x-0 -translate-y-1/2 max-w-xl w-[85%] md:w-auto p-4 md:p-8 z-10 text-dark-tertiary dark:text-light-primary"
        style={{ opacity: 0 }}
      >
        <blockquote className="border-l-4 border-light-accent dark:border-dark-primary pl-4 md:pl-6">
          <p className="text-xl md:text-3xl font-serif italic mb-3 md:mb-5 leading-relaxed">
            "The <span className="text-light-accent dark:text-dark-accent font-bold">whale</span> rules the ocean, not by speed or stealth, but by sheer <span className="text-light-accent dark:text-dark-accent font-bold">presence</span> and <span className="text-light-accent dark:text-dark-accent font-bold">mastery</span> of its domain."
          </p>
          <p className="text-sm md:text-xl mb-2 md:mb-3 leading-relaxed">
            As a developer, be like the whale—<span className="text-light-accent dark:text-dark-accent font-bold">dominate</span> your field not by rushing through tasks or cutting corners, but by <span className="text-light-accent dark:text-dark-accent font-bold">deeply understanding</span> your craft, making <span className="text-light-accent dark:text-dark-accent font-bold">deliberate choices</span>, and building <span className="text-light-accent dark:text-dark-accent font-bold">robust</span>, <span className="text-light-accent dark:text-dark-accent font-bold">scalable solutions</span> that stand the test of time.
          </p>
        </blockquote>
      </div>
      
      <div className="sticky top-0 h-screen w-full">
        <Canvas
          shadows
          gl={{ alpha: true }}
          camera={{ position: [-10, 5, 5], fov: 70 }}
          className="h-full w-full"
          onCreated={handleContentLoaded}
        >
          {/* Add blue-ish fog for underwater effect */}
          <fogExp2 attach="fog" args={['#000000', 0.02]} />
          
          <Suspense fallback={<LoadingFallback />}>
            {/* Replace SceneLighting with UnderwaterLighting */}
            <UnderwaterLighting />
            
            {/* Add underwater floating particles */}
            <UnderwaterParticles 
              count={150} 
              color="#a3c7e8" 
              size={0.08} 
              bounds={15}
              speed={isScrolling ? 0.15 : 0.03} // Particles move faster when scrolling
            />
            
            {/* Whale model */}
            <Model 
              path="/glb/whale.glb" 
              scale={5}
              position={modelPosition}
              rotation={modelRotation}
              isScrolling={isScrolling}
            />
            
            {/* Shark model with scroll progress */}
            <Shark 
              position={sharkPosition} 
              isScrolling={isScrolling}
              scrollProgress={scrollProgress}
            />
            
            {/* Modified environment for underwater feel */}
            <Environment preset="sunset" background={false} />
            <OrbitControls enableZoom={false} enablePan={false} enableRotate={true} />
          </Suspense>
        </Canvas>
        
        {/* Position the enhanced ScrollReminder in the middle of the scene */}
        {isLoaded && showScrollReminder && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="transform translate-y-[30vh] dark:text-light-primary text-dark-secondary">
              <ScrollReminder 
                threshold={150}
                color="currentColor"
                size={40}
                hideAfter={10000} // Show for longer (10 seconds)
                onReturn={true} // Enable reappearing when returning to top
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

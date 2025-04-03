import { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, useAnimations, Html, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollReminder } from '../components/common/Dropdown';
import Shark from '../components/common/Shark';
import UnderwaterParticles from '../components/common/UnderwaterParticles';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// 3D Model component
interface ModelProps {
  path: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  isScrolling?: boolean;
}

const Model = ({ path, scale = 1, position = [0, 0, 0], rotation = [0, 0, 0], isScrolling = false }: ModelProps) => {
  const group = useRef<THREE.Group>(null!);
  const { scene, animations } = useGLTF(path);
  const { actions, mixer } = useAnimations(animations, group);
  const actionRef = useRef<THREE.AnimationAction | null>(null);

  useEffect(() => {
    if (actions["rig.001|rig.001Action"]) {
      actionRef.current = actions["rig.001|rig.001Action"];
      actionRef.current.reset().play();
      actionRef.current.timeScale = 0;
    } else {
      console.log("Available animations:", Object.keys(actions));
    }

    return () => {
      if (actionRef.current) {
        actionRef.current.stop();
      }
    };
  }, [actions]);

  useEffect(() => {
    if (actionRef.current) {
      gsap.to(actionRef.current, {
        timeScale: isScrolling ? 1 : 0,
        duration: 0.2,
      });
    }
  }, [isScrolling]);

  useEffect(() => {
    if (group.current) {
      group.current.position.set(...position);
    }
  }, [position]);

  useFrame((_, delta) => {
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

  useFrame(({clock}) => {
    const time = clock.getElapsedTime();

    if (lightRayRef.current) {
      lightRayRef.current.intensity = 3 + Math.sin(time * 0.5) * 0.5;
      lightRayRef.current.position.x = Math.sin(time * 0.2) * 2;
    }

    if (lightRay2Ref.current) {
      lightRay2Ref.current.intensity = 2 + Math.cos(time * 0.3) * 0.3;
      lightRay2Ref.current.position.x = Math.sin(time * 0.1) * -3;
    }

    if (ambientRef.current) {
      ambientRef.current.intensity = 0.6 + Math.sin(time * 0.2) * 0.1;
    }
  });

  return (
    <>
      <ambientLight ref={ambientRef} color="#104673" intensity={0.6} />
      <directionalLight
        position={[0, 10, 5]}
        intensity={0.8}
        color="#8ab8d8"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
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

// Add a component to check when all 3D assets are loaded
const AssetsLoader = ({ onAllAssetsLoaded }: { onAllAssetsLoaded: () => void }) => {
  const { gl, scene } = useThree();

  useEffect(() => {
    const checkLoadingComplete = () => {
      let allLoaded = true;

      if (!gl.info.memory.textures) {
        allLoaded = false;
      }

      if (allLoaded && scene.children.length > 0) {
        setTimeout(onAllAssetsLoaded, 1000);
      }
    };

    const interval = setInterval(checkLoadingComplete, 500);

    return () => clearInterval(interval);
  }, [gl, scene, onAllAssetsLoaded]);

  return null;
};

interface HeroProps {
  onFullyLoaded?: () => void;
}

export default function Hero({ onFullyLoaded }: HeroProps) {
  const [modelPosition, setModelPosition] = useState<[number, number, number]>([-20, 0, 0]);
  const [modelRotation, setModelRotation] = useState<[number, number, number]>([5.3, 3, 0]);
  const [sharkPosition, setSharkPosition] = useState<[number, number, number]>([20, 0, 0]);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [showScrollReminder, setShowScrollReminder] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);

  const scrollTimer = useRef<NodeJS.Timeout | null>(null);

  const handleCanvasCreated = () => {
    setIsLoaded(true);
  };

  const handleAllAssetsLoaded = () => {
    setAssetsLoaded(true);

    if (onFullyLoaded) {
      onFullyLoaded();
    }
  };

  useEffect(() => {
    if (!containerRef.current || !isLoaded || !quoteRef.current) return;

    gsap.to({}, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          setScrollProgress(self.progress);

          const xPosition = gsap.utils.interpolate(-20, 20, self.progress);
          const yPosition = Math.sin(self.progress * Math.PI * 2) * 2;
          const xRotationOffset = Math.cos(self.progress * Math.PI * 2) * 0.5;
          const baseXRotation = 5.3;
          const zRotationOffset = Math.sin(self.progress * Math.PI * 3) * 0.2;

          setModelPosition([xPosition, yPosition, 0]);
          setModelRotation([
            baseXRotation + xRotationOffset, 
            1.5, 
            zRotationOffset
          ]);

          const sharkXPosition = gsap.utils.interpolate(20, -20, self.progress);
          const sharkYPosition = Math.sin(self.progress * Math.PI * -5 + Math.PI) * 2;
          setSharkPosition([sharkXPosition, sharkYPosition, 0]);

          setIsScrolling(true);

          if (scrollTimer.current) {
            clearTimeout(scrollTimer.current);
          }

          scrollTimer.current = setTimeout(() => {
            setIsScrolling(false);
          }, 150);
        },
      }
    });

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
          end: "50% top",
          scrub: true,
        },
        onComplete: () => {
          gsap.to(quoteRef.current, {
            opacity: 0,
            y: -20,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "50% top",
              end: "bottom bottom",
              scrub: true,
            },
          });
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
    };
  }, [isLoaded]);

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

  useEffect(() => {
    const handleVisibilityOnIntersect = () => {
      if (window.scrollY < 100 && isLoaded) {
        setShowScrollReminder(true);
      }
    };

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
      {!isLoaded && (
        <div className="fixed inset-0 bg-light-primary dark:bg-dark-background z-50 flex items-center justify-center">
          <div className="text-2xl font-bold">Loading...</div>
        </div>
      )}
      
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
          onCreated={handleCanvasCreated}
        >
          <fogExp2 attach="fog" args={['#000000', 0.02]} />
          
          <Suspense fallback={<LoadingFallback />}>
            <AssetsLoader onAllAssetsLoaded={handleAllAssetsLoaded} />
            <UnderwaterLighting />
            <UnderwaterParticles 
              count={150} 
              color="#a3c7e8" 
              size={0.08} 
              bounds={15}
              speed={isScrolling ? 0.15 : 0.03}
            />
            <Model 
              path="/glb/whale.glb" 
              scale={5}
              position={modelPosition}
              rotation={modelRotation}
              isScrolling={isScrolling}
            />
            <Shark 
              position={sharkPosition} 
              isScrolling={isScrolling}
              scrollProgress={scrollProgress}
            />
            <Environment preset="sunset" background={false} />
            <OrbitControls enableZoom={false} enablePan={false} enableRotate={true} />
          </Suspense>
        </Canvas>
        
        {isLoaded && assetsLoaded && showScrollReminder && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="transform translate-y-[30vh] dark:text-light-primary text-dark-secondary">
              <ScrollReminder 
                threshold={150}
                color="currentColor"
                size={40}
                hideAfter={10000}
                onReturn={true}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

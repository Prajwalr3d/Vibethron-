import { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// Detect WebGL availability
function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

interface SceneProps {
  reducedMotion: boolean;
  scrollY: number;
}

function Main3DComposition({ reducedMotion, scrollY }: SceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const pinkKnotRef = useRef<THREE.Mesh>(null);
  const limeKnotRef = useRef<THREE.Mesh>(null);
  const satellite1Ref = useRef<THREE.Mesh>(null);
  const satellite2Ref = useRef<THREE.Mesh>(null);

  // Mouse parallax target values
  const targetX = useRef(0);
  const targetY = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse between -1 and 1
      targetX.current = (e.clientX / window.innerWidth) * 2 - 1;
      targetY.current = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    // Respect prefers-reduced-motion
    if (reducedMotion) {
      if (groupRef.current) {
        groupRef.current.position.y = -scrollY * 0.0015;
      }
      return;
    }

    const t = state.clock.getElapsedTime();

    // Smooth lerp mouse parallax on the entire scene container
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetX.current * 0.28,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -targetY.current * 0.18,
        0.05
      );
      // Link smooth movement with scroll
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        -scrollY * 0.0018,
        0.08
      );
    }

    // Individual organic floating animations
    if (pinkKnotRef.current) {
      pinkKnotRef.current.rotation.x += delta * 0.18;
      pinkKnotRef.current.rotation.y += delta * 0.24;
      pinkKnotRef.current.rotation.z += Math.sin(t * 0.5) * 0.003;
    }

    if (limeKnotRef.current) {
      limeKnotRef.current.rotation.x -= delta * 0.14;
      limeKnotRef.current.rotation.z += delta * 0.2;
      limeKnotRef.current.rotation.y -= Math.cos(t * 0.6) * 0.002;
    }

    if (satellite1Ref.current) {
      satellite1Ref.current.rotation.y += delta * 0.4;
      satellite1Ref.current.position.y = 1.8 + Math.sin(t * 1.2) * 0.2;
    }

    if (satellite2Ref.current) {
      satellite2Ref.current.rotation.x += delta * 0.3;
      satellite2Ref.current.position.y = -1.9 + Math.cos(t * 1.1) * 0.18;
    }
  });

  // Materials with controlled reflections & neon lacquer sheen
  const pinkMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#FF2DA8'),
      emissive: new THREE.Color('#7A004B'),
      emissiveIntensity: 0.35,
      roughness: 0.18,
      metalness: 0.35,
      clearcoat: 1.0,
      clearcoatRoughness: 0.12,
      reflectivity: 0.9,
    });
  }, []);

  const limeMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#D4FF3F'),
      emissive: new THREE.Color('#3A5002'),
      emissiveIntensity: 0.3,
      roughness: 0.22,
      metalness: 0.2,
      clearcoat: 0.85,
      clearcoatRoughness: 0.15,
      reflectivity: 0.85,
    });
  }, []);

  const chromeMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1F1F1F'),
      roughness: 0.1,
      metalness: 0.95,
    });
  }, []);

  return (
    <group ref={groupRef}>
      {/* Studio Lighting System */}
      <ambientLight intensity={0.55} color="#151515" />

      {/* Main directional key light */}
      <directionalLight position={[6, 9, 7]} intensity={1.8} color="#FFFFFF" />

      {/* Hot Pink Rim / Point Light */}
      <pointLight position={[3.5, 1.5, 3]} intensity={4.5} distance={14} color="#FF2DA8" />

      {/* Chartreuse Fill / Point Light */}
      <pointLight position={[-4, -2, 2.5]} intensity={4} distance={12} color="#D4FF3F" />

      {/* Primary Hot Pink Organic Torus Knot (Asymmetrical Top-Right) */}
      <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.6}>
        <mesh
          ref={pinkKnotRef}
          position={[2.4, 0.4, -0.6]}
          scale={[1.15, 1.15, 1.15]}
          material={pinkMaterial}
        >
          <torusKnotGeometry args={[1.5, 0.46, 128, 32, 2, 3]} />
        </mesh>
      </Float>

      {/* Secondary Chartreuse Organic Ring / Knot (Asymmetrical Lower-Left) */}
      <Float speed={1.8} rotationIntensity={0.5} floatIntensity={0.7}>
        <mesh
          ref={limeKnotRef}
          position={[-2.5, -0.7, -1.2]}
          scale={[1.05, 1.05, 1.05]}
          material={limeMaterial}
        >
          <torusKnotGeometry args={[1.2, 0.38, 96, 24, 3, 2]} />
        </mesh>
      </Float>

      {/* Layered Accent Satellites for depth */}
      <mesh
        ref={satellite1Ref}
        position={[3.8, 1.8, 0.8]}
        scale={[0.32, 0.32, 0.32]}
        material={limeMaterial}
      >
        <octahedronGeometry args={[1, 0]} />
      </mesh>

      <mesh
        ref={satellite2Ref}
        position={[-3.6, -1.9, 0.5]}
        scale={[0.42, 0.42, 0.42]}
        material={pinkMaterial}
      >
        <icosahedronGeometry args={[1, 0]} />
      </mesh>

      {/* Floating Dark Chrome Anchor Sphere */}
      <mesh
        position={[0.2, -2.4, -2.5]}
        scale={[0.55, 0.55, 0.55]}
        material={chromeMaterial}
      >
        <sphereGeometry args={[1, 32, 32]} />
      </mesh>
    </group>
  );
}

// Fallback visual for environments without WebGL
function FallbackCanvas() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <div
        style={{
          position: 'absolute',
          right: '5%',
          top: '15%',
          width: 'clamp(280px, 35vw, 520px)',
          height: 'clamp(280px, 35vw, 520px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 45, 168, 0.3) 0%, rgba(11, 11, 11, 0) 70%)',
          filter: 'blur(30px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '8%',
          bottom: '10%',
          width: 'clamp(260px, 30vw, 480px)',
          height: 'clamp(260px, 30vw, 480px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212, 255, 63, 0.25) 0%, rgba(11, 11, 11, 0) 70%)',
          filter: 'blur(35px)',
        }}
      />
    </div>
  );
}

export function Hero3DCanvas() {
  const [scrollY, setScrollY] = useState(0);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setHasWebGL(isWebGLAvailable());

    // Check prefers-reduced-motion media query
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const onMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', onMotionChange);

    const onScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      mediaQuery.removeEventListener('change', onMotionChange);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
      aria-label="Interactive 3D abstract visual sculpture"
    >
      {/* Fallback glow background elements */}
      <FallbackCanvas />

      {/* Lightweight 3D Engine status indicator */}
      {!isReady && hasWebGL && (
        <div
          style={{
            position: 'absolute',
            bottom: '18px',
            right: '24px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--color-muted-grey)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-chartreuse)',
              animation: 'pulse 1.5s infinite',
            }}
          />
          [ 3D ENGINE READYING ]
        </div>
      )}

      {hasWebGL ? (
        <Canvas
          camera={{ position: [0, 0, 7.2], fov: 46 }}
          gl={{
            antialias: true,
            powerPreference: 'high-performance',
            alpha: true,
          }}
          dpr={[1, 2]}
          onCreated={() => setIsReady(true)}
          style={{ width: '100%', height: '100%' }}
        >
          <Main3DComposition reducedMotion={reducedMotion} scrollY={scrollY} />
        </Canvas>
      ) : (
        <div
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--color-muted-grey)',
          }}
        >
          [ 2D ACCELERATED MODE ]
        </div>
      )}
    </div>
  );
}

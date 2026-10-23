import { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// Detect WebGL capability safely
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

// Subtle ambient particle field
function AmbientVolumetricParticles({ count = 120 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const pink = new THREE.Color('#FF2DA8');
    const chartreuse = new THREE.Color('#D4FF3F');

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12 - 2;

      const chosenColor = Math.random() > 0.5 ? pink : chartreuse;
      col[i * 3] = chosenColor.r;
      col[i * 3 + 1] = chosenColor.g;
      col[i * 3 + 2] = chosenColor.b;
    }

    return [pos, col];
  }, [count]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.025;
      pointsRef.current.rotation.x += delta * 0.015;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.07}
        vertexColors
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// Main 3D background sculpture composition
function BackgroundScene({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const primaryKnotRef = useRef<THREE.Mesh>(null);
  const secondaryRingRef = useRef<THREE.Mesh>(null);
  const translucentCurvedRef = useRef<THREE.Mesh>(null);
  const accentSatelliteRef = useRef<THREE.Mesh>(null);

  const mouseTarget = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseTarget.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseTarget.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    if (reducedMotion) return;

    const t = state.clock.getElapsedTime();

    // Subtle pointer parallax tilt on entire scene
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mouseTarget.current.x * 0.22,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -mouseTarget.current.y * 0.15,
        0.05
      );
    }

    // Continuous smooth rotation and organic floating
    if (primaryKnotRef.current) {
      primaryKnotRef.current.rotation.x += delta * 0.16;
      primaryKnotRef.current.rotation.y += delta * 0.22;
      primaryKnotRef.current.position.y = 0.35 + Math.sin(t * 0.65) * 0.22;
    }

    if (secondaryRingRef.current) {
      secondaryRingRef.current.rotation.x -= delta * 0.14;
      secondaryRingRef.current.rotation.z += delta * 0.18;
      secondaryRingRef.current.position.y = -0.45 + Math.cos(t * 0.55) * 0.2;
    }

    if (translucentCurvedRef.current) {
      translucentCurvedRef.current.rotation.y += delta * 0.1;
      translucentCurvedRef.current.rotation.z -= delta * 0.08;
      translucentCurvedRef.current.position.z = -1.6 + Math.sin(t * 0.45) * 0.25;
    }

    if (accentSatelliteRef.current) {
      accentSatelliteRef.current.rotation.y += delta * 0.35;
      accentSatelliteRef.current.position.y = 1.9 + Math.cos(t * 0.8) * 0.15;
    }
  });

  // Hot Pink Physical Lacquer Material
  const hotPinkMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#FF2DA8'),
      emissive: new THREE.Color('#770044'),
      emissiveIntensity: 0.45,
      roughness: 0.14,
      metalness: 0.4,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 0.95,
    });
  }, []);

  // Chartreuse Glossy Physical Material
  const chartreuseMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#D4FF3F'),
      emissive: new THREE.Color('#334801'),
      emissiveIntensity: 0.4,
      roughness: 0.18,
      metalness: 0.3,
      clearcoat: 1.0,
      clearcoatRoughness: 0.12,
      reflectivity: 0.9,
    });
  }, []);

  // Translucent Curved Surface Material (Refractive Glassy Film)
  const translucentMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#FFFFFF'),
      emissive: new THREE.Color('#FF2DA8'),
      emissiveIntensity: 0.2,
      roughness: 0.1,
      metalness: 0.15,
      transmission: 0.68,
      opacity: 0.7,
      transparent: true,
      ior: 1.45,
      thickness: 0.5,
      clearcoat: 1.0,
      depthWrite: false,
    });
  }, []);

  // Dark Chrome Satellite Material
  const darkChromeMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1F1F1F'),
      roughness: 0.1,
      metalness: 0.95,
    });
  }, []);

  return (
    <group ref={groupRef}>
      {/* Studio Lighting System */}
      <ambientLight intensity={0.65} color="#151515" />

      {/* Main Directional Studio Key Light */}
      <directionalLight position={[6, 9, 7]} intensity={2.0} color="#FFFFFF" />

      {/* Dramatic Hot Pink Accent Point Light */}
      <pointLight
        position={[3.8, 1.8, 3.0]}
        intensity={5.5}
        distance={15}
        color="#FF2DA8"
      />

      {/* Dramatic Chartreuse Accent Fill Light */}
      <pointLight
        position={[-3.8, -1.8, 2.5]}
        intensity={5.0}
        distance={14}
        color="#D4FF3F"
      />

      {/* Volumetric Ambient Particles */}
      <AmbientVolumetricParticles count={130} />

      {/* 1. Large Glossy Hot Pink Torus Knot (Upper-Right) */}
      <Float speed={1.5} rotationIntensity={0.35} floatIntensity={0.55}>
        <mesh
          ref={primaryKnotRef}
          position={[2.4, 0.35, -0.4]}
          scale={[1.35, 1.35, 1.35]}
          material={hotPinkMaterial}
        >
          <torusKnotGeometry args={[1.6, 0.48, 128, 32, 2, 3]} />
        </mesh>
      </Float>

      {/* 2. Large Floating Chartreuse Torus Ring (Lower-Left) */}
      <Float speed={1.7} rotationIntensity={0.4} floatIntensity={0.6}>
        <mesh
          ref={secondaryRingRef}
          position={[-2.3, -0.45, -0.8]}
          scale={[1.25, 1.25, 1.25]}
          material={chartreuseMaterial}
        >
          <torusGeometry args={[1.5, 0.42, 32, 96]} />
        </mesh>
      </Float>

      {/* 3. Translucent Curved Surface (Center Depth Ribbon) */}
      <Float speed={1.3} rotationIntensity={0.25} floatIntensity={0.45}>
        <mesh
          ref={translucentCurvedRef}
          position={[0.2, 0.0, -1.6]}
          scale={[1.65, 1.65, 1.65]}
          material={translucentMaterial}
        >
          <torusKnotGeometry args={[1.3, 0.24, 96, 24, 3, 2]} />
        </mesh>
      </Float>

      {/* 4. Deep Dark Chrome Satellite */}
      <mesh
        ref={accentSatelliteRef}
        position={[-3.6, 2.0, 0.5]}
        scale={[0.48, 0.48, 0.48]}
        material={darkChromeMaterial}
      >
        <octahedronGeometry args={[1, 0]} />
      </mesh>
    </group>
  );
}

// Fallback visual for non-WebGL devices
function StaticGradientFallback() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      <div
        style={{
          position: 'absolute',
          right: '5%',
          top: '12%',
          width: 'clamp(300px, 40vw, 550px)',
          height: 'clamp(300px, 40vw, 550px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 45, 168, 0.3) 0%, rgba(11, 11, 11, 0) 70%)',
          filter: 'blur(45px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '8%',
          bottom: '10%',
          width: 'clamp(280px, 35vw, 500px)',
          height: 'clamp(280px, 35vw, 500px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212, 255, 63, 0.25) 0%, rgba(11, 11, 11, 0) 70%)',
          filter: 'blur(50px)',
        }}
      />
    </div>
  );
}

export function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);
    setHasWebGL(isWebGLAvailable());

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const onMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', onMotionChange);

    return () => {
      mediaQuery.removeEventListener('change', onMotionChange);
    };
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div
      id="vibe-3d-background"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        backgroundColor: '#0B0B0B',
      }}
      aria-hidden="true"
    >
      {/* 1. Real 3D WebGL Canvas Layer */}
      {hasWebGL ? (
        <Canvas
          camera={{ position: [0, 0, 7.0], fov: 46 }}
          gl={{
            antialias: true,
            powerPreference: 'high-performance',
            alpha: true,
          }}
          dpr={[1, 1.8]}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        >
          <BackgroundScene reducedMotion={reducedMotion} />
        </Canvas>
      ) : (
        <StaticGradientFallback />
      )}

      {/* 2. Controlled Near-Black Vignette Overlay */}
      {/* Keeps 3D shapes luminous and visible while ensuring foreground text is 100% legible */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, rgba(11, 11, 11, 0.22) 0%, rgba(11, 11, 11, 0.58) 65%, rgba(11, 11, 11, 0.82) 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

export default AnimatedBackground;

import { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { type PersonaId } from '../types/transformer';

interface Transformer3DCanvasProps {
  persona: PersonaId;
  isTransforming: boolean;
}

function MorphingTransformationSculpture({
  persona,
  isTransforming,
  reducedMotion
}: {
  persona: PersonaId;
  isTransforming: boolean;
  reducedMotion: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  const targetX = useRef(0);
  const targetY = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetX.current = (e.clientX / window.innerWidth) * 2 - 1;
      targetY.current = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Material setup matching the current persona
  const currentMaterial = useMemo(() => {
    switch (persona) {
      case 'executive':
        return new THREE.MeshPhysicalMaterial({
          color: new THREE.Color('#FF2DA8'),
          emissive: new THREE.Color('#550033'),
          emissiveIntensity: 0.4,
          roughness: 0.15,
          metalness: 0.6,
          clearcoat: 1.0,
          reflectivity: 0.95
        });
      case 'supportive':
        return new THREE.MeshPhysicalMaterial({
          color: new THREE.Color('#D4FF3F'),
          emissive: new THREE.Color('#223300'),
          emissiveIntensity: 0.35,
          roughness: 0.3,
          metalness: 0.15,
          clearcoat: 0.8,
          reflectivity: 0.85
        });
      case 'legal':
        return new THREE.MeshPhysicalMaterial({
          color: new THREE.Color('#FFFFFF'),
          emissive: new THREE.Color('#222222'),
          emissiveIntensity: 0.2,
          roughness: 0.1,
          metalness: 0.9,
          clearcoat: 1.0,
          reflectivity: 0.9
        });
      case 'genz':
        return new THREE.MeshPhysicalMaterial({
          color: new THREE.Color('#D4FF3F'),
          emissive: new THREE.Color('#FF2DA8'),
          emissiveIntensity: 0.5,
          roughness: 0.2,
          metalness: 0.4,
          clearcoat: 0.9,
          reflectivity: 0.9
        });
    }
  }, [persona]);

  const accentMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(persona === 'executive' ? '#D4FF3F' : '#FF2DA8'),
      roughness: 0.2,
      metalness: 0.8,
      wireframe: true
    });
  }, [persona]);

  useFrame((state, delta) => {
    if (reducedMotion) return;

    const t = state.clock.getElapsedTime();

    // Lerp group parallax
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetX.current * 0.35,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -targetY.current * 0.25,
        0.05
      );
    }

    const speedMultiplier = isTransforming ? 4.5 : 1.0;

    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.25 * speedMultiplier;
      meshRef.current.rotation.y += delta * 0.35 * speedMultiplier;
      meshRef.current.rotation.z += Math.sin(t * 0.8) * 0.003;

      // Pulse scale during transformation
      const pulseScale = isTransforming
        ? 1.0 + Math.sin(t * 12) * 0.12
        : 1.0 + Math.sin(t * 1.5) * 0.03;
      meshRef.current.scale.set(pulseScale, pulseScale, pulseScale);
    }

    if (outerRingRef.current) {
      outerRingRef.current.rotation.x -= delta * 0.3 * speedMultiplier;
      outerRingRef.current.rotation.z += delta * 0.2 * speedMultiplier;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.6} color="#151515" />
      <directionalLight position={[5, 7, 6]} intensity={1.8} color="#FFFFFF" />
      <pointLight
        position={[3, 2, 3]}
        intensity={isTransforming ? 6 : 4}
        distance={12}
        color={persona === 'supportive' || persona === 'genz' ? '#D4FF3F' : '#FF2DA8'}
      />
      <pointLight position={[-3, -2, 2]} intensity={3} distance={10} color="#FFFFFF" />

      {/* Main Evolving Center Sculpture */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.6}>
        <mesh ref={meshRef} material={currentMaterial}>
          {persona === 'executive' && <icosahedronGeometry args={[1.3, 0]} />}
          {persona === 'supportive' && <torusGeometry args={[1.1, 0.45, 32, 64]} />}
          {persona === 'legal' && <octahedronGeometry args={[1.25, 1]} />}
          {persona === 'genz' && <torusKnotGeometry args={[1.0, 0.35, 100, 16, 2, 5]} />}
        </mesh>
      </Float>

      {/* Outer Gyroscopic Wireframe Halo */}
      <mesh ref={outerRingRef} material={accentMaterial} scale={[1.7, 1.7, 1.7]}>
        <torusGeometry args={[1.2, 0.04, 16, 64]} />
      </mesh>
    </group>
  );
}

export function Transformer3DCanvas({ persona, isTransforming }: Transformer3DCanvasProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: 'clamp(280px, 35vw, 550px)',
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'hidden'
      }}
      aria-label="3D Evolving Transformation Visual"
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
        style={{ width: '100%', height: '100%' }}
      >
        <MorphingTransformationSculpture
          persona={persona}
          isTransforming={isTransforming}
          reducedMotion={reducedMotion}
        />
      </Canvas>
    </div>
  );
}

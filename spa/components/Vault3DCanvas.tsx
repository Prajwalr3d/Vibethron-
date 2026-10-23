import { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

function DimensionalArchivalSlabs({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const slab1Ref = useRef<THREE.Mesh>(null);
  const slab2Ref = useRef<THREE.Mesh>(null);
  const slab3Ref = useRef<THREE.Mesh>(null);

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

  const pinkSlabMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#FF2DA8'),
      emissive: new THREE.Color('#550033'),
      emissiveIntensity: 0.3,
      roughness: 0.2,
      metalness: 0.8,
      clearcoat: 1.0,
      reflectivity: 0.95
    });
  }, []);

  const chartreuseSlabMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#D4FF3F'),
      emissive: new THREE.Color('#223300'),
      emissiveIntensity: 0.25,
      roughness: 0.25,
      metalness: 0.7,
      clearcoat: 0.9,
      reflectivity: 0.9
    });
  }, []);

  const darkSlabMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#161616'),
      roughness: 0.3,
      metalness: 0.95
    });
  }, []);

  useFrame((state) => {
    if (reducedMotion) return;

    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetX.current * 0.3,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -targetY.current * 0.2,
        0.05
      );
    }

    if (slab1Ref.current) {
      slab1Ref.current.position.y = 0.4 + Math.sin(t * 0.8) * 0.08;
      slab1Ref.current.rotation.z = Math.sin(t * 0.4) * 0.04;
    }

    if (slab2Ref.current) {
      slab2Ref.current.position.y = -0.1 + Math.cos(t * 0.7) * 0.08;
      slab2Ref.current.rotation.z = -Math.cos(t * 0.5) * 0.04;
    }

    if (slab3Ref.current) {
      slab3Ref.current.position.y = -0.6 + Math.sin(t * 0.9) * 0.08;
      slab3Ref.current.rotation.z = Math.sin(t * 0.6) * 0.03;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} color="#151515" />
      <directionalLight position={[4, 6, 5]} intensity={1.6} color="#FFFFFF" />
      <pointLight position={[3, 2, 3]} intensity={3.5} distance={10} color="#FF2DA8" />
      <pointLight position={[-3, -2, 2]} intensity={3} distance={8} color="#D4FF3F" />

      {/* Layered Floating Dimensional Archival Slabs */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
        <mesh ref={slab1Ref} position={[0.4, 0.5, 0.4]} material={pinkSlabMaterial}>
          <boxGeometry args={[2.2, 0.75, 0.12]} />
        </mesh>

        <mesh ref={slab2Ref} position={[-0.3, 0, 0]} material={darkSlabMaterial}>
          <boxGeometry args={[2.5, 0.85, 0.14]} />
        </mesh>

        <mesh ref={slab3Ref} position={[0.2, -0.6, -0.4]} material={chartreuseSlabMaterial}>
          <boxGeometry args={[2.0, 0.7, 0.1]} />
        </mesh>
      </Float>
    </group>
  );
}

export function Vault3DCanvas() {
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
        width: 'clamp(280px, 32vw, 480px)',
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'hidden'
      }}
      aria-label="3D Archival Slabs Visual"
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
        style={{ width: '100%', height: '100%' }}
      >
        <DimensionalArchivalSlabs reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}

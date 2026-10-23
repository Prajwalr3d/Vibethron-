import { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

function DimensionalDataMatrix({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const cubeWireRef = useRef<THREE.Mesh>(null);
  const nodesRef = useRef<THREE.Group>(null);

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

  const coreMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#D4FF3F'),
      emissive: new THREE.Color('#3A5002'),
      emissiveIntensity: 0.4,
      roughness: 0.2,
      metalness: 0.7,
      clearcoat: 1.0,
      reflectivity: 0.95
    });
  }, []);

  const pinkNodeMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FF2DA8'),
      emissive: new THREE.Color('#660033'),
      roughness: 0.2,
      metalness: 0.5
    });
  }, []);

  const wireMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color('#333333'),
      wireframe: true
    });
  }, []);

  useFrame((state, delta) => {
    if (reducedMotion) return;

    const t = state.clock.getElapsedTime();

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

    if (coreRef.current) {
      coreRef.current.rotation.x += delta * 0.2;
      coreRef.current.rotation.y += delta * 0.25;
    }

    if (cubeWireRef.current) {
      cubeWireRef.current.rotation.x -= delta * 0.08;
      cubeWireRef.current.rotation.y -= delta * 0.12;
    }

    if (nodesRef.current) {
      nodesRef.current.rotation.y += delta * 0.3;
      nodesRef.current.rotation.z = Math.sin(t * 0.5) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} color="#151515" />
      <directionalLight position={[4, 7, 5]} intensity={1.6} color="#FFFFFF" />
      <pointLight position={[3, 2, 3]} intensity={3.5} distance={10} color="#D4FF3F" />
      <pointLight position={[-3, -2, 2]} intensity={3.5} distance={10} color="#FF2DA8" />

      {/* Floating Dimensional Core */}
      <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.5}>
        <mesh ref={coreRef} material={coreMaterial} scale={[1.1, 1.1, 1.1]}>
          <dodecahedronGeometry args={[1, 0]} />
        </mesh>
      </Float>

      {/* Outer Hypercube Wireframe Cage */}
      <mesh ref={cubeWireRef} material={wireMaterial} scale={[2.1, 2.1, 2.1]}>
        <boxGeometry args={[1, 1, 1]} />
      </mesh>

      {/* Orbiting Telemetry Data Nodes */}
      <group ref={nodesRef}>
        {[0, 1, 2, 3, 4].map((i) => {
          const angle = (i * Math.PI * 2) / 5;
          const radius = 1.8;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * radius, Math.sin(angle) * radius * 0.5, Math.sin(angle) * radius]}
              material={i % 2 === 0 ? coreMaterial : pinkNodeMaterial}
              scale={[0.18, 0.18, 0.18]}
            >
              <octahedronGeometry args={[1, 0]} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

export function Dashboard3DCanvas() {
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
        width: 'clamp(280px, 32vw, 500px)',
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'hidden'
      }}
      aria-label="3D Telemetry Matrix Visual"
    >
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
        style={{ width: '100%', height: '100%' }}
      >
        <DimensionalDataMatrix reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}

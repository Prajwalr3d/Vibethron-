import { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

function IdentityPrismGlyph({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const prismRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

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

  const pinkGemMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#FF2DA8'),
      emissive: new THREE.Color('#770044'),
      emissiveIntensity: 0.45,
      roughness: 0.1,
      metalness: 0.3,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transmission: 0.6,
      ior: 1.5,
      reflectivity: 0.95
    });
  }, []);

  const chartreuseRingMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#D4FF3F'),
      roughness: 0.2,
      metalness: 0.8
    });
  }, []);

  const darkRingMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#222222'),
      roughness: 0.3,
      metalness: 0.95
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

    if (prismRef.current) {
      prismRef.current.rotation.y += delta * 0.4;
      prismRef.current.rotation.x = Math.sin(t * 0.6) * 0.15;
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += delta * 0.25;
      ring1Ref.current.rotation.y += delta * 0.15;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= delta * 0.3;
      ring2Ref.current.rotation.y -= delta * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.6} color="#151515" />
      <directionalLight position={[4, 6, 6]} intensity={1.8} color="#FFFFFF" />
      <pointLight position={[2, 2, 3]} intensity={4} distance={10} color="#FF2DA8" />
      <pointLight position={[-2, -2, 2]} intensity={3} distance={8} color="#D4FF3F" />

      {/* Central Refractive Biometric Identity Prism */}
      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.5}>
        <mesh ref={prismRef} material={pinkGemMaterial} scale={[1.2, 1.5, 1.2]}>
          <octahedronGeometry args={[1, 0]} />
        </mesh>
      </Float>

      {/* Concentric Cryptographic Ring 1 */}
      <mesh ref={ring1Ref} material={chartreuseRingMaterial}>
        <torusGeometry args={[1.7, 0.04, 16, 64]} />
      </mesh>

      {/* Concentric Cryptographic Ring 2 */}
      <mesh ref={ring2Ref} material={darkRingMaterial}>
        <torusGeometry args={[1.9, 0.05, 16, 64]} />
      </mesh>
    </group>
  );
}

export function Auth3DCanvas() {
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
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'hidden'
      }}
      aria-label="3D Biometric Identity Visual"
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
        style={{ width: '100%', height: '100%' }}
      >
        <IdentityPrismGlyph reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}

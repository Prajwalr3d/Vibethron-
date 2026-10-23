import { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

function CalibrationGyroscope({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

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

  const chartreuseMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#D4FF3F'),
      roughness: 0.15,
      metalness: 0.85
    });
  }, []);

  const pinkMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FF2DA8'),
      roughness: 0.2,
      metalness: 0.7
    });
  }, []);

  const gunmetalMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1F1F1F'),
      roughness: 0.1,
      metalness: 0.95
    });
  }, []);

  useFrame((_, delta) => {
    if (reducedMotion) return;

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

    if (ring1Ref.current) ring1Ref.current.rotation.x += delta * 0.4;
    if (ring2Ref.current) ring2Ref.current.rotation.y += delta * 0.5;
    if (ring3Ref.current) ring3Ref.current.rotation.z -= delta * 0.35;
    if (coreRef.current) {
      coreRef.current.rotation.x += delta * 0.6;
      coreRef.current.rotation.y += delta * 0.6;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} color="#151515" />
      <directionalLight position={[4, 6, 6]} intensity={1.7} color="#FFFFFF" />
      <pointLight position={[3, 2, 3]} intensity={4} distance={10} color="#D4FF3F" />
      <pointLight position={[-3, -2, 2]} intensity={3} distance={8} color="#FF2DA8" />

      {/* Triple Gimbal Rings */}
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
        <mesh ref={ring1Ref} material={gunmetalMaterial}>
          <torusGeometry args={[1.8, 0.05, 16, 64]} />
        </mesh>

        <mesh ref={ring2Ref} material={chartreuseMaterial}>
          <torusGeometry args={[1.4, 0.045, 16, 64]} />
        </mesh>

        <mesh ref={ring3Ref} material={pinkMaterial}>
          <torusGeometry args={[1.0, 0.04, 16, 64]} />
        </mesh>

        {/* Central Calibration Seed Node */}
        <mesh ref={coreRef} material={chartreuseMaterial} scale={[0.45, 0.45, 0.45]}>
          <octahedronGeometry args={[1, 0]} />
        </mesh>
      </Float>
    </group>
  );
}

export function Settings3DCanvas() {
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
      aria-label="3D Calibration Gyroscope Visual"
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
        style={{ width: '100%', height: '100%' }}
      >
        <CalibrationGyroscope reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}

import { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface IntentLock3DCanvasProps {
  isSafe: boolean;
}

function SculpturalLockShield({
  isSafe,
  reducedMotion
}: {
  isSafe: boolean;
  reducedMotion: boolean;
}) {
  const shieldRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const pinGroupRef = useRef<THREE.Group>(null);

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

  const safeColor = useMemo(() => new THREE.Color('#D4FF3F'), []);
  const riskColor = useMemo(() => new THREE.Color('#FF3B30'), []);
  const activeColor = isSafe ? safeColor : riskColor;

  const coreMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: activeColor,
      emissive: activeColor,
      emissiveIntensity: isSafe ? 0.35 : 0.65,
      roughness: 0.15,
      metalness: 0.8,
      clearcoat: 1.0,
      reflectivity: 0.95
    });
  }, [activeColor, isSafe]);

  const shieldFrameMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1A1A1A'),
      metalness: 0.95,
      roughness: 0.2
    });
  }, []);

  const laserRingMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: activeColor,
      wireframe: true
    });
  }, [activeColor]);

  useFrame((state, delta) => {
    if (reducedMotion) return;

    const t = state.clock.getElapsedTime();

    if (shieldRef.current) {
      shieldRef.current.rotation.y = THREE.MathUtils.lerp(
        shieldRef.current.rotation.y,
        targetX.current * 0.4,
        0.05
      );
      shieldRef.current.rotation.x = THREE.MathUtils.lerp(
        shieldRef.current.rotation.x,
        -targetY.current * 0.3,
        0.05
      );
    }

    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.3;
      coreRef.current.rotation.x += delta * 0.15;
      const pulse = isSafe
        ? 1.0 + Math.sin(t * 2) * 0.04
        : 1.0 + Math.sin(t * 8) * 0.1; // Warning pulse
      coreRef.current.scale.set(pulse, pulse, pulse);
    }

    if (ringRef.current) {
      ringRef.current.rotation.z += delta * (isSafe ? 0.2 : 0.6);
      ringRef.current.rotation.x = Math.sin(t * 0.5) * 0.2;
    }

    if (pinGroupRef.current) {
      pinGroupRef.current.rotation.y -= delta * 0.25;
    }
  });

  return (
    <group ref={shieldRef}>
      <ambientLight intensity={0.5} color="#151515" />
      <directionalLight position={[4, 6, 5]} intensity={1.5} color="#FFFFFF" />
      <pointLight position={[2, 2, 3]} intensity={4} distance={10} color={activeColor} />
      <pointLight position={[-3, -2, 2]} intensity={2.5} distance={8} color="#FF2DA8" />

      {/* Outer Heavy Gunmetal Shield Shackle / Arch */}
      <mesh material={shieldFrameMaterial} position={[0, 0.4, 0]}>
        <torusGeometry args={[1.35, 0.2, 16, 48, Math.PI]} />
      </mesh>

      {/* Lower Shield Chassis Slabs */}
      <mesh material={shieldFrameMaterial} position={[0, -0.6, 0]}>
        <boxGeometry args={[2.5, 1.4, 0.45]} />
      </mesh>

      {/* Central Floating Holographic Lock Tumbler Core */}
      <Float speed={1.8} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh ref={coreRef} position={[0, -0.55, 0.28]} material={coreMaterial}>
          <octahedronGeometry args={[0.65, 0]} />
        </mesh>
      </Float>

      {/* Orbiting Laser Scanning Wireframe Ring */}
      <mesh ref={ringRef} position={[0, -0.55, 0]} material={laserRingMaterial}>
        <torusGeometry args={[1.5, 0.03, 16, 64]} />
      </mesh>

      {/* Semantic Sensor Pins */}
      <group ref={pinGroupRef} position={[0, -0.55, 0]}>
        {[0, 1, 2, 3].map((i) => {
          const angle = (i * Math.PI) / 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * 1.8, Math.sin(angle) * 1.8, 0]}
              material={coreMaterial}
              scale={[0.12, 0.12, 0.12]}
            >
              <sphereGeometry args={[1, 16, 16]} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

export function IntentLock3DCanvas({ isSafe }: IntentLock3DCanvasProps) {
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
        width: 'clamp(280px, 36vw, 560px)',
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'hidden'
      }}
      aria-label="3D IntentLock Security Mechanism"
    >
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
        style={{ width: '100%', height: '100%' }}
      >
        <SculpturalLockShield isSafe={isSafe} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}

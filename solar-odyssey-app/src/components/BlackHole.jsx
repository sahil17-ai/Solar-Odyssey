import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

export default function BlackHole() {
  const diskRef = useRef();
  const topArcRef = useRef();
  const bottomArcRef = useRef();
  const eventHorizonRef = useRef();

  useFrame((state, delta) => {
    if (diskRef.current) diskRef.current.rotation.z -= delta * 0.5;
    if (topArcRef.current) topArcRef.current.rotation.y -= delta * 0.2;
    if (bottomArcRef.current) bottomArcRef.current.rotation.y += delta * 0.2;
  });

  return (
    <group position={[1800, 0, -800]}>
      {/* The Event Horizon (Pure Black Sphere) */}
      <Sphere ref={eventHorizonRef} args={[40, 64, 64]}>
        <meshBasicMaterial color="#000000" />
      </Sphere>

      {/* Glow behind the event horizon */}
      <pointLight intensity={10} distance={1000} color="#ffaa55" decay={2} />

      {/* Main Accretion Disk (Equatorial) */}
      <mesh ref={diskRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[45, 120, 128]} />
        <meshBasicMaterial 
          color="#ff8822" 
          side={THREE.DoubleSide} 
          transparent 
          opacity={0.8} 
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Inner Hot Accretion Disk */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[41, 60, 128]} />
        <meshBasicMaterial 
          color="#ffffff" 
          side={THREE.DoubleSide} 
          transparent 
          opacity={0.9} 
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Top Arc (Gravitational Lensing Illusion) */}
      <mesh ref={topArcRef} rotation={[0, 0, 0]} position={[0, 45, 0]}>
        <torusGeometry args={[50, 10, 16, 100, Math.PI]} />
        <meshBasicMaterial 
          color="#ff8822" 
          transparent 
          opacity={0.5} 
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Bottom Arc (Gravitational Lensing Illusion) */}
      <mesh ref={bottomArcRef} rotation={[0, 0, Math.PI]} position={[0, -45, 0]}>
        <torusGeometry args={[50, 10, 16, 100, Math.PI]} />
        <meshBasicMaterial 
          color="#ff8822" 
          transparent 
          opacity={0.3} 
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

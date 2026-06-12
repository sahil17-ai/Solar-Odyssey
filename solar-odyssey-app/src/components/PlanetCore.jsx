import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

export default function PlanetCore({ data, texture }) {
  const groupRef = useRef();
  const crustRef = useRef();
  const mantleRef = useRef();
  const coreRef = useRef();
  const scanLineRef = useRef();

  useEffect(() => {
    // Holographic Scan Effect First
    const tl = gsap.timeline();
    
    tl.to(scanLineRef.current.position, {
      y: -data.radius,
      duration: 1.5,
      ease: "power2.inOut"
    });

    // Then Explode Core
    tl.to(crustRef.current.position, {
      y: data.radius * 1.5,
      x: data.radius * 1.5,
      duration: 2,
      ease: "back.out(1.7)"
    }, "+=0.5");

    tl.to(mantleRef.current.position, {
      y: data.radius * 0.8,
      x: -data.radius * 0.8,
      duration: 2,
      ease: "back.out(1.7)"
    }, "<0.2");

  }, [data.radius]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Holographic Scan Line */}
      <mesh ref={scanLineRef} position={[0, data.radius, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[data.radius, data.radius + 0.5, 64]} />
        <meshBasicMaterial color="#00ffcc" side={THREE.DoubleSide} transparent opacity={0.8} />
      </mesh>

      {/* Crust (Outer Layer) */}
      <Sphere ref={crustRef} args={[data.radius, 64, 64, 0, Math.PI, 0, Math.PI]}>
        <meshStandardMaterial 
          color={texture ? '#ffffff' : data.color} 
          map={texture || null}
          roughness={0.8} 
          side={THREE.DoubleSide}
        />
      </Sphere>

      {/* Mantle (Mid Layer) */}
      <Sphere ref={mantleRef} args={[data.radius * 0.7, 64, 64, 0, Math.PI, 0, Math.PI]}>
        <meshStandardMaterial 
          color="#ff4400" 
          emissive="#ff0000"
          emissiveIntensity={1}
          roughness={0.2} 
          side={THREE.DoubleSide}
        />
      </Sphere>

      {/* Core (Inner Solid) */}
      <Sphere ref={coreRef} args={[data.radius * 0.4, 64, 64]}>
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#ffffff"
          emissiveIntensity={2}
        />
      </Sphere>
    </group>
  );
}

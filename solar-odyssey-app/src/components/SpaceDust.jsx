import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function SpaceDust({ count = 8000, timeScale = 1 }) {
  const pointsRef = useRef();

  const particles = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count); // Store Z speed
    
    for (let i = 0; i < count; i++) {
      // Spread across a massive volume
      positions[i * 3] = (Math.random() - 0.5) * 3000;     // X
      positions[i * 3 + 1] = (Math.random() - 0.5) * 3000; // Y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3000; // Z
      velocities[i] = Math.random() * 2 + 0.5;
    }
    
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('velocity', new THREE.BufferAttribute(velocities, 1));
    return geo;
  }, [count]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array;
      const velocities = pointsRef.current.geometry.attributes.velocity.array;
      
      for (let i = 0; i < count; i++) {
        // Move particles towards camera (positive Z)
        positions[i * 3 + 2] += velocities[i] * 50 * delta * (Math.abs(timeScale) > 0.1 ? Math.abs(timeScale) : 1);
        
        // Wrap around when passing the camera
        if (positions[i * 3 + 2] > 1500) {
          positions[i * 3 + 2] = -1500;
        }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef} geometry={particles}>
      <pointsMaterial 
        size={1.5} 
        color="#88ccff" 
        transparent 
        opacity={0.6} 
        sizeAttenuation 
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

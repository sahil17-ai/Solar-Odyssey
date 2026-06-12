import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import ISS from './ISS';

const Earth = ({ data, setSelectedBody, angle, currentRotation }) => {
  const meshRef = useRef();
  const cloudsRef = useRef();

  const [dayMap, nightMap, cloudsMap] = useTexture([
    data.map,
    '/textures/earth_night.jpg',
    '/textures/earth_clouds.jpg'
  ]);

  useFrame((state, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.5;
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.6; // Clouds move slightly faster
  });

  const x = data.dist === 0 ? 0 : data.dist * Math.cos(angle);
  const z = data.dist === 0 ? 0 : data.dist * Math.sin(angle);

  // Custom shader for Day/Night blending
  // We use standard material with map and emissiveMap.
  // EmissiveMap will be the night map, and we set emissive intensity high, 
  // but it will only show up where there is no light if we configure it properly, 
  // actually standard material adds emissive everywhere. 
  // A simple trick for React Three Fiber without writing GLSL is to use 
  // two spheres: one for day, one for night (additive blending), but that's complex.
  // We will just use the day map and cloud map to keep it performant and beautiful.
  // To achieve the night map easily, we just set emissiveMap = nightMap.
  // Since ambient light is high (1.2), night map won't look perfectly dark, but it will look cool.

  return (
    <group position={[x, 0, z]}>
      {/* Earth Surface */}
      <Sphere 
        ref={meshRef} 
        args={[data.radius, 64, 64]}
        castShadow
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          setSelectedBody(data.name);
        }}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      >
        <meshStandardMaterial 
          map={dayMap}
          bumpMap={dayMap}
          bumpScale={0.05}
          roughness={0.7}
          metalness={0.1}
        />
      </Sphere>

      {/* Cloud Layer */}
      <Sphere ref={cloudsRef} args={[data.radius + 0.1, 64, 64]} receiveShadow castShadow>
        <meshStandardMaterial 
          map={cloudsMap}
          transparent
          opacity={0.6}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>

      {/* Atmosphere Glow (Fresnel-like) */}
      <Sphere args={[data.radius + 0.4, 64, 64]}>
        <meshBasicMaterial 
          color="#4cc9f0"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>

      {/* Procedural ISS */}
      <ISS radius={data.radius} />
    </group>
  );
};

export default Earth;

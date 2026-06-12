import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html, Text } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

export default function Cockpit({ setDestination, destination }) {
  const { camera } = useThree();
  const cockpitRef = useRef();
  const hudRef = useRef();
  
  // Cockpit follows camera
  useFrame(() => {
    if (cockpitRef.current) {
      cockpitRef.current.position.copy(camera.position);
      cockpitRef.current.quaternion.copy(camera.quaternion);
    }
  });

  const destinations = [
    'Sun', 'Mercury', 'Venus', 'Earth', 'Mars', 
    'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'BlackHole'
  ];

  return (
    <group ref={cockpitRef}>
      {/* Procedural Cockpit Geometry */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[2, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#111" side={THREE.BackSide} metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Front Window Frame */}
      <mesh position={[0, 0, -1.9]}>
        <torusGeometry args={[1.5, 0.05, 16, 64]} />
        <meshStandardMaterial color="#222" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Interior Ambient Light */}
      <pointLight position={[0, 1, 0]} intensity={0.5} color="#00ffcc" distance={3} />

      {/* Spatial HUD / Dashboard */}
      <group position={[0, -0.8, -1.5]} rotation={[-Math.PI / 8, 0, 0]} ref={hudRef}>
        <mesh>
          <boxGeometry args={[2, 0.5, 0.1]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.5} />
        </mesh>
        
        {/* Holographic Text on Dashboard */}
        <Text
          position={[-0.8, 0.1, 0.06]}
          fontSize={0.05}
          color="#00ffcc"
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
        >
          {`SYSTEMS: ONLINE\nTARGET: ${destination || 'NONE'}`}
        </Text>

        {/* Navigation Buttons (Spatial UI) */}
        <group position={[0.2, 0.1, 0.06]}>
          {destinations.slice(0, 6).map((dest, i) => (
            <group key={dest} position={[(i % 3) * 0.3, Math.floor(i / 3) * -0.15, 0]}>
              <mesh 
                onClick={(e) => { e.stopPropagation(); setDestination(dest); }}
                onPointerOver={() => document.body.style.cursor = 'pointer'}
                onPointerOut={() => document.body.style.cursor = 'auto'}
              >
                <planeGeometry args={[0.25, 0.1]} />
                <meshBasicMaterial color={destination === dest ? "#00ffcc" : "#333"} transparent opacity={0.6} />
              </mesh>
              <Text position={[0, 0, 0.01]} fontSize={0.03} color="white">
                {dest}
              </Text>
            </group>
          ))}
        </group>
      </group>
    </group>
  );
}

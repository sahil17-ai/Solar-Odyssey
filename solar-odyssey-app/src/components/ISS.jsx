import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Cylinder } from '@react-three/drei';

export default function ISS({ timeScale = 1, radius }) {
  const orbitRef = useRef();
  const stationRef = useRef();

  useFrame((state, delta) => {
    if (orbitRef.current) {
      // ISS orbits Earth much faster than Earth rotates
      orbitRef.current.rotation.y += delta * 2 * timeScale;
    }
    if (stationRef.current) {
      // Slowly rotate the station itself
      stationRef.current.rotation.x += delta * 0.2;
    }
  });

  return (
    <group ref={orbitRef}>
      <group position={[radius + 1.5, 0, 0]} ref={stationRef} scale={0.2}>
        {/* Main Central Tube */}
        <Cylinder args={[0.5, 0.5, 4, 16]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color="#cccccc" metalness={0.8} roughness={0.2} />
        </Cylinder>
        
        {/* Solar Panels Left */}
        <Box args={[3, 0.1, 2]} position={[-2, 0, 0]}>
          <meshStandardMaterial color="#1a4d80" metalness={0.5} roughness={0.5} />
        </Box>
        <Box args={[3, 0.1, 2]} position={[-5.5, 0, 0]}>
          <meshStandardMaterial color="#1a4d80" metalness={0.5} roughness={0.5} />
        </Box>

        {/* Solar Panels Right */}
        <Box args={[3, 0.1, 2]} position={[2, 0, 0]}>
          <meshStandardMaterial color="#1a4d80" metalness={0.5} roughness={0.5} />
        </Box>
        <Box args={[3, 0.1, 2]} position={[5.5, 0, 0]}>
          <meshStandardMaterial color="#1a4d80" metalness={0.5} roughness={0.5} />
        </Box>

        {/* Habitation Modules */}
        <Cylinder args={[0.8, 0.8, 2, 16]} position={[0, 1.5, 0]}>
          <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.8} />
        </Cylinder>
        <Cylinder args={[0.8, 0.8, 2, 16]} position={[0, -1.5, 0]}>
          <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.8} />
        </Cylinder>
      </group>
    </group>
  );
}

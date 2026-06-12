import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Plane, Box, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

const Rover = () => {
  const roverRef = useRef();

  useFrame((state, delta) => {
    // Simple autonomous driving forward
    if (roverRef.current) {
      roverRef.current.position.x += delta * 2;
      // Simple terrain follow (fake bumpiness)
      roverRef.current.position.y = Math.sin(roverRef.current.position.x * 0.5) * 0.5 + 0.5;
      roverRef.current.rotation.z = Math.cos(roverRef.current.position.x * 0.5) * 0.1;
    }
  });

  return (
    <group ref={roverRef} position={[0, 0.5, 0]}>
      <Box args={[3, 1, 2]} position={[0, 0.5, 0]}>
        <meshStandardMaterial color="#dddddd" />
      </Box>
      <Box args={[0.2, 2, 0.2]} position={[1, 1.5, 0]}>
        <meshStandardMaterial color="#444444" />
      </Box>
      <Box args={[1, 0.5, 1]} position={[1, 2.5, 0]}>
        <meshStandardMaterial color="#222222" />
      </Box>
      
      {/* Wheels */}
      {[-1, 1].map(x => 
        [-1, 1].map(z => (
          <Cylinder key={`wheel-${x}-${z}`} args={[0.6, 0.6, 0.4, 16]} rotation={[Math.PI / 2, 0, 0]} position={[x * 1.2, 0, z * 1.2]}>
            <meshStandardMaterial color="#111111" roughness={0.9} />
          </Cylinder>
        ))
      )}
    </group>
  );
};

export default function MarsSurface({ isActive, onClose }) {
  if (!isActive) return null;

  return (
    <group>
      <ambientLight intensity={0.5} />
      <directionalLight position={[100, 50, -50]} intensity={2} color="#ffaa88" castShadow />
      
      <fog attach="fog" args={['#c1440e', 10, 200]} />

      <Plane args={[1000, 1000, 64, 64]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#c1440e" 
          roughness={0.9}
          wireframe={false}
          displacementScale={5}
        />
      </Plane>

      {/* Procedural Rocks */}
      {Array.from({ length: 200 }).map((_, i) => {
        const x = (Math.random() - 0.5) * 400;
        const z = (Math.random() - 0.5) * 400;
        const scale = Math.random() * 3 + 0.5;
        return (
          <Box key={i} args={[scale, scale, scale]} position={[x, scale/2, z]} rotation={[Math.random(), Math.random(), 0]}>
            <meshStandardMaterial color="#883311" roughness={0.9} />
          </Box>
        );
      })}

      <Rover />

      <Html position={[0, 15, -20]} center>
        <button 
          onClick={onClose}
          style={{
            padding: '10px 20px',
            background: 'rgba(0,0,0,0.8)',
            color: '#fff',
            border: '1px solid #ff4422',
            cursor: 'pointer',
            fontFamily: 'Rajdhani',
            fontSize: '1.2rem'
          }}
        >
          RETURN TO ORBIT
        </button>
      </Html>
    </group>
  );
}

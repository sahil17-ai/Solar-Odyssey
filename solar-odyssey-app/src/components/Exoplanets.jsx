import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Trail, Text } from '@react-three/drei';
import * as THREE from 'three';

const keplerBodies = [
  { name: 'Kepler-186', radius: 40, dist: 0, color: '#ff4422', hasGlow: true, speed: 0 },
  { name: 'Kepler-186b', radius: 3, dist: 150, color: '#8844ff', speed: 2.0 },
  { name: 'Kepler-186c', radius: 5, dist: 220, color: '#22ffaa', speed: 1.5 },
  { name: 'Kepler-186d', radius: 4, dist: 300, color: '#ff2288', speed: 1.2, hasRings: true },
  { name: 'Kepler-186e', radius: 6, dist: 420, color: '#4488ff', speed: 0.8 },
  { name: 'Kepler-186f', radius: 4.5, dist: 550, color: '#00cc66', speed: 0.5, habitable: true }
];

export default function Exoplanets({ timeScale, selectedBody, setSelectedBody, positionsRef }) {
  const groupRef = useRef();
  
  const [angles, setAngles] = useState(
    keplerBodies.reduce((acc, body, idx) => {
      acc[body.name] = (idx * Math.PI * 2) / 5;
      return acc;
    }, {})
  );

  useFrame((state, delta) => {
    setAngles(prev => {
      const next = { ...prev };
      keplerBodies.forEach(body => {
        next[body.name] = prev[body.name] + body.speed * delta * 0.5 * timeScale;
        
        // Exoplanets are located at X: -4000, Y: 1000, Z: 3000
        const x = -4000 + (body.dist === 0 ? 0 : body.dist * Math.cos(next[body.name]));
        const z = 3000 + (body.dist === 0 ? 0 : body.dist * Math.sin(next[body.name]));
        positionsRef.current[body.name] = new THREE.Vector3(x, 1000, z);
      });
      return next;
    });
  });

  return (
    <group position={[-4000, 1000, 3000]} ref={groupRef}>
      {/* Kepler Star Glow */}
      <pointLight intensity={8} distance={2000} decay={1.5} color="#ff4422" />

      {keplerBodies.map(body => {
        const isSelected = selectedBody === body.name;
        const x = body.dist === 0 ? 0 : body.dist * Math.cos(angles[body.name]);
        const z = body.dist === 0 ? 0 : body.dist * Math.sin(angles[body.name]);

        const planetMesh = (
          <group position={[x, 0, z]}>
            {isSelected && (
              <Text position={[body.radius + 10, body.radius + 15, 0]} fontSize={10} color="#ffffff" anchorX="center" outlineWidth={0.2} outlineColor="#000000">
                {body.name.toUpperCase()}
              </Text>
            )}
            <Sphere 
              args={[body.radius, 32, 32]}
              onClick={(e) => { e.stopPropagation(); setSelectedBody(body.name); }}
              onPointerOver={() => document.body.style.cursor = 'pointer'}
              onPointerOut={() => document.body.style.cursor = 'auto'}
            >
              {body.hasGlow ? (
                <meshBasicMaterial color={body.color} />
              ) : (
                <meshStandardMaterial color={body.color} roughness={0.6} metalness={0.4} />
              )}
            </Sphere>
            {body.hasRings && (
              <mesh rotation={[Math.PI / 2.2, 0, 0]}>
                <ringGeometry args={[body.radius * 1.5, body.radius * 2.5, 64]} />
                <meshStandardMaterial color="#ffffff" side={THREE.DoubleSide} transparent opacity={0.4} />
              </mesh>
            )}
          </group>
        );

        if (body.dist === 0) return <React.Fragment key={body.name}>{planetMesh}</React.Fragment>;

        // Orbital line
        const curve = new THREE.EllipseCurve(0, 0, body.dist, body.dist, 0, 2 * Math.PI, false, 0);
        const points = curve.getPoints(64).map(p => new THREE.Vector3(p.x, 0, p.y));
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);

        return (
          <React.Fragment key={body.name}>
            <line geometry={lineGeo}>
              <lineBasicMaterial color={body.color} transparent opacity={0.1} />
            </line>
            <Trail width={2} color={body.color} length={100} decay={1}>
              {planetMesh}
            </Trail>
          </React.Fragment>
        );
      })}
    </group>
  );
}

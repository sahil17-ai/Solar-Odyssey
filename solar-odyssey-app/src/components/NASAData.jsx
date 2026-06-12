import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

const NASAData = ({ earthAngle, earthDist }) => {
  const [asteroids, setAsteroids] = useState([]);
  const groupRef = useRef();

  useEffect(() => {
    // Fetch live NEO data from NASA
    const today = new Date().toISOString().split('T')[0];
    const fetchNEO = async () => {
      try {
        const res = await fetch("https://api.nasa.gov/neo/rest/v1/feed?start_date=" + today + "&end_date=" + today + "&api_key=DEMO_KEY");
        const data = await res.json();
        const neos = data.near_earth_objects[today] || [];
        
        // Parse and limit to 50 asteroids for performance
        const parsed = neos.slice(0, 50).map(neo => {
          const missDistance = parseFloat(neo.close_approach_data[0].miss_distance.astronomical);
          // Scale distance relative to Earth's radius for visualization
          return {
            id: neo.id,
            name: neo.name,
            size: neo.estimated_diameter.kilometers.estimated_diameter_max * 0.5,
            distanceOffset: missDistance * 50, // Arbitrary scaling
            angleOffset: Math.random() * Math.PI * 2,
            speed: parseFloat(neo.close_approach_data[0].relative_velocity.kilometers_per_second) * 0.001
          };
        });
        setAsteroids(parsed);
      } catch (err) {
        console.error("NASA API Error, using fallback data", err);
        // Fallback simulated asteroids
        setAsteroids([...Array(20)].map((_, i) => ({
          id: i,
          name: `Simulated NEO-${i}`,
          size: Math.random() * 0.5 + 0.1,
          distanceOffset: Math.random() * 20 + 5,
          angleOffset: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.02 + 0.01
        })));
      }
    };
    fetchNEO();
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const meshRef = useRef();

  // Position the entire asteroid group at Earth's location
  const x = earthDist * Math.cos(earthAngle);
  const z = earthDist * Math.sin(earthAngle);

  useFrame((state, delta) => {
    if (meshRef.current) {
      asteroids.forEach((ast, i) => {
        // Rotate around Earth
        ast.angleOffset += ast.speed * delta * 50; 
        
        const ax = ast.distanceOffset * Math.cos(ast.angleOffset);
        const az = ast.distanceOffset * Math.sin(ast.angleOffset);
        const ay = Math.sin(ast.angleOffset * 2) * 5; // Slight orbital inclination
        
        dummy.position.set(ax, ay, az);
        dummy.scale.set(ast.size, ast.size, ast.size);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group position={[x, 0, z]}>
      <instancedMesh ref={meshRef} args={[null, null, asteroids.length > 0 ? asteroids.length : 1]}>
        <dodecahedronGeometry args={[1, 0]} />
        {/* Glow red for dangerous NEOs */}
        <meshBasicMaterial color="#ff0033" />
      </instancedMesh>
    </group>
  );
};

export default NASAData;

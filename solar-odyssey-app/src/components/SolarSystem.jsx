import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sphere, Trail, Text } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import Earth from './Earth';
import NASAData from './NASAData';
import BlackHole from './BlackHole';
import PlanetCore from './PlanetCore';
import Exoplanets from './Exoplanets';

const celestialBodies = [
  { name: 'Sun', radius: 60, dist: 0, color: '#ffcc00', hasGlow: true, map: '/textures/sun.jpg', speed: 0, eccentricity: 0 },
  { name: 'Mercury', radius: 2, dist: 120, color: '#a8a8a8', map: '/textures/mercury.jpg', speed: 1.5, eccentricity: 0.2 },
  { name: 'Venus', radius: 4, dist: 160, color: '#e3bb76', map: '/textures/venus.jpg', speed: 1.2, eccentricity: 0.05 },
  { name: 'Earth', radius: 4.5, dist: 220, color: '#2b82c9', map: '/textures/earth.jpg', speed: 1.0, eccentricity: 0.016 },
  { name: 'Mars', radius: 3, dist: 280, color: '#c1440e', map: '/textures/mars.jpg', speed: 0.8, eccentricity: 0.09 },
  { name: 'Jupiter', radius: 22, dist: 450, color: '#e3dccb', map: '/textures/jupiter.jpg', speed: 0.4, eccentricity: 0.04 },
  { name: 'Saturn', radius: 18, dist: 650, color: '#ead6b8', map: '/textures/saturn.jpg', hasRings: true, speed: 0.3, eccentricity: 0.05 },
  { name: 'Uranus', radius: 10, dist: 850, color: '#d1e7e7', map: '/textures/uranus.jpg', speed: 0.2, eccentricity: 0.04 },
  { name: 'Neptune', radius: 9, dist: 1050, color: '#5b5ddf', map: '/textures/neptune.jpg', speed: 0.15, eccentricity: 0.01 },
  { name: 'Pluto', radius: 1.5, dist: 1250, color: '#dddddd', map: '/textures/moon.jpg', speed: 0.1, eccentricity: 0.24 },
  { name: 'Black Hole', radius: 50, dist: 1800, color: '#000000', speed: 0, eccentricity: 0 }
];

const AsteroidBelt = ({ timeScale }) => {
  const count = 4000;
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.015 * timeScale;
    }
  });

  useEffect(() => {
    if (meshRef.current) {
      for (let i = 0; i < count; i++) {
        const r = 320 + Math.random() * 80; 
        const theta = Math.random() * Math.PI * 2;
        const x = r * Math.cos(theta);
        const z = r * Math.sin(theta);
        const y = (Math.random() - 0.5) * 15;
        
        dummy.position.set(x, y, z);
        const scale = 0.2 + Math.random() * 0.8;
        dummy.scale.set(scale, scale, scale);
        dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        dummy.updateMatrix();
        
        meshRef.current.setMatrixAt(i, dummy.matrix);
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [dummy]);

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#888888" roughness={0.9} />
    </instancedMesh>
  );
};

const Planet = ({ data, setSelectedBody, angle, isSelected }) => {
  const meshRef = useRef();
  const [texture, setTexture] = useState(null);
  const [ringTexture, setRingTexture] = useState(null);

  useEffect(() => {
    if (data.map) {
      const loader = new THREE.TextureLoader();
      loader.load(data.map, (loadedTexture) => {
        loadedTexture.colorSpace = THREE.SRGBColorSpace;
        setTexture(loadedTexture);
      });
      if (data.hasRings) {
        loader.load('/textures/saturn_ring.png', (rt) => {
          rt.colorSpace = THREE.SRGBColorSpace;
          setRingTexture(rt);
        });
      }
    }
  }, [data.map, data.hasRings]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  const a = data.dist; 
  const b = data.dist * Math.sqrt(1 - data.eccentricity * data.eccentricity);
  const x = a === 0 ? 0 : a * Math.cos(angle);
  const z = b === 0 ? 0 : b * Math.sin(angle);

  const groupContent = (
    <group position={[x, 0, z]}>
      {isSelected && (
        <Text
          position={[data.radius + 10, data.radius + 15, 0]}
          fontSize={10}
          color="#00ffcc"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.2}
          outlineColor="#000000"
        >
          {data.name.toUpperCase()}
        </Text>
      )}

      {isSelected && data.name === 'Mars' ? (
        <PlanetCore data={data} texture={texture} />
      ) : (
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
          {data.hasGlow ? (
            <meshStandardMaterial 
              color="#ffffff"
              emissive="#ffaa00"
              emissiveMap={texture || null}
              emissiveIntensity={3}
              map={texture || null}
            />
          ) : (
            <meshStandardMaterial 
              color={texture ? '#ffffff' : data.color} 
              map={texture || null}
              bumpMap={texture || null}
              bumpScale={0.05}
              roughness={0.7} 
              metalness={0.2}
            />
          )}
        </Sphere>
      )}
      
      {/* Subtle Atmospheric glow for non-sun planets */}
      {!data.hasGlow && data.map && data.radius > 2 && (
        <Sphere args={[data.radius * 1.02, 32, 32]}>
          <meshPhysicalMaterial 
            color={data.color} 
            transparent 
            opacity={0.15} 
            roughness={1} 
            transmission={0.5} 
            side={THREE.BackSide} 
          />
        </Sphere>
      )}

      {data.hasGlow && (
        <pointLight 
          castShadow 
          intensity={8} 
          distance={5000} 
          decay={1.5} 
          color="#ffea00" 
          shadow-mapSize={[2048, 2048]} 
          shadow-bias={-0.0001}
        />
      )}

      {data.hasRings && (
        <mesh rotation={[Math.PI / 2.5, 0, 0]} receiveShadow castShadow>
          <ringGeometry args={[data.radius * 1.5, data.radius * 2.5, 64]} />
          <meshStandardMaterial 
            map={ringTexture || null} 
            color={ringTexture ? '#ffffff' : data.color} 
            side={THREE.DoubleSide} 
            transparent 
            opacity={0.8} 
            alphaMap={ringTexture || null}
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>
      )}
    </group>
  );

  if (data.name === 'Sun' || data.name === 'Earth') return groupContent;

  return (
    <Trail width={2} color={data.color} length={200} decay={1} attenuation={(t) => t * t}>
      {groupContent}
    </Trail>
  );
};

export default function SolarSystem({ selectedBody, setSelectedBody, timeScale, isFlightMode }) {
  const { camera, controls } = useThree();
  const groupRef = useRef();
  const timeRef = useRef(0);
  
  const transitionRef = useRef({ progress: 1 });
  const previousTarget = useRef(new THREE.Vector3());
  const previousCameraPos = useRef(new THREE.Vector3());

  useEffect(() => {
    if (isFlightMode) return;
    
    // Store current state for smooth interpolation
    if (controls) {
      previousTarget.current.copy(controls.target);
    } else {
      previousTarget.current.set(0, 0, 0);
    }
    previousCameraPos.current.copy(camera.position);
    
    transitionRef.current.progress = 0;

    gsap.killTweensOf(transitionRef.current);
    gsap.to(transitionRef.current, {
      progress: 1,
      duration: 2.5,
      ease: "power3.inOut"
    });
  }, [selectedBody, isFlightMode, camera, controls]);

  useFrame(() => {
    if (isFlightMode || !controls) return;

    // 1. Determine the live destination points
    let targetPos = new THREE.Vector3(0, 0, 0);
    let targetCamPos = new THREE.Vector3(0, 800, 1200); // Default Solar System View

    if (selectedBody) {
      if (selectedBody === 'Black Hole') {
        targetPos.set(1800, 0, -800);
        targetCamPos.set(1800 + 150, 50, -800 + 150);
      } else if (selectedBody.includes('Kepler')) {
        const p = positionsRef.current[selectedBody];
        targetPos.copy(p || new THREE.Vector3(-4000, 0, 3000));
        targetCamPos.set(targetPos.x + 20, 1000 + 20, targetPos.z + 20);
      } else {
        const targetBody = celestialBodies.find(b => b.name === selectedBody || selectedBody.includes(b.name));
        const p = positionsRef.current[selectedBody];
        if (p && targetBody) {
          targetPos.copy(p);
          // Position camera diagonally above the planet
          targetCamPos.set(p.x + targetBody.radius * 3, targetBody.radius * 1.5, p.z + targetBody.radius * 3);
        }
      }
    }

    const p = transitionRef.current.progress;

    // 2. Perform smooth tracking or transition
    if (p < 1) {
      // During transition: Smoothly lerp from stored starting positions to the LIVE moving targets
      controls.target.lerpVectors(previousTarget.current, targetPos, p);
      
      // Calculate where the camera should be on the curve
      const newCamPos = new THREE.Vector3().lerpVectors(previousCameraPos.current, targetCamPos, p);
      camera.position.copy(newCamPos);
      
      controls.update();
    } else {
      // Post-transition Tracking: We are locked onto the target.
      // Move camera by the exact delta the target moved to allow OrbitControls (user rotation) to still function!
      if (selectedBody) {
        const deltaTarget = targetPos.clone().sub(controls.target);
        camera.position.add(deltaTarget);
        controls.target.copy(targetPos);
        controls.update();
      } else {
        // Just look at the center of the solar system
        controls.target.set(0, 0, 0);
        controls.update();
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {celestialBodies.map(body => {
        if (body.dist === 0 || body.name === 'Black Hole') return null;
        const a = body.dist; 
        const b = body.dist * Math.sqrt(1 - body.eccentricity * body.eccentricity);
        const curve = new THREE.EllipseCurve(0, 0, a, b, 0, 2 * Math.PI, false, 0);
        const points = curve.getPoints(128).map(p => new THREE.Vector3(p.x, 0, p.y));
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        return (
          <line key={`orbit-${body.name}`} geometry={lineGeo}>
            <lineBasicMaterial color="#ffffff" transparent opacity={0.2} />
          </line>
        );
      })}

      <AsteroidBelt timeScale={timeScale} />
      
      <React.Suspense fallback={null}>
        <DynamicPlanets timeRef={timeRef} timeScale={timeScale} selectedBody={selectedBody} setSelectedBody={setSelectedBody} positionsRef={positionsRef} />
        <Exoplanets timeScale={timeScale} selectedBody={selectedBody} setSelectedBody={setSelectedBody} positionsRef={positionsRef} />
      </React.Suspense>
      
      <BlackHole />
    </group>
  );
}

const DynamicPlanets = ({ timeRef, timeScale, selectedBody, setSelectedBody, positionsRef }) => {
  const earthData = celestialBodies.find(b => b.name === 'Earth');
  const [earthState, setEarthState] = useState({ angle: 0, dist: earthData.dist });

  const [angles, setAngles] = useState(
    celestialBodies.reduce((acc, body, idx) => {
      acc[body.name] = (idx * Math.PI * 2) / 8 + 1.5;
      return acc;
    }, {})
  );

  useFrame((state, delta) => {
    timeRef.current += delta * 0.5 * timeScale;
    
    setAngles(prev => {
      const next = { ...prev };
      celestialBodies.forEach(body => {
        if (body.name === 'Black Hole') return;
        next[body.name] = prev[body.name] + body.speed * delta * 0.5 * timeScale;
        
        // Update global positions tracking for the camera to follow
        const a = body.dist; 
        const b = body.dist * Math.sqrt(1 - body.eccentricity * body.eccentricity);
        const x = a === 0 ? 0 : a * Math.cos(next[body.name]);
        const z = b === 0 ? 0 : b * Math.sin(next[body.name]);
        positionsRef.current[body.name] = new THREE.Vector3(x, 0, z);
      });
      setEarthState({ angle: next['Earth'], dist: earthData.dist });
      return next;
    });
  });

  return (
    <>
      <NASAData earthAngle={earthState.angle} earthDist={earthState.dist} timeScale={timeScale} />

      {celestialBodies.map(data => {
        if (data.name === 'Black Hole') return null;
        if (data.name === 'Earth') {
          return (
            <Trail key={data.name} width={2} color="#4cc9f0" length={200} decay={1}>
              <Earth 
                data={data} 
                setSelectedBody={setSelectedBody} 
                angle={angles[data.name]} 
                isSelected={selectedBody === 'Earth'}
              />
            </Trail>
          );
        }
        return (
          <Planet 
            key={data.name} 
            data={data} 
            setSelectedBody={setSelectedBody} 
            angle={angles[data.name]} 
            isSelected={selectedBody === data.name || selectedBody?.includes(data.name)}
          />
        );
      })}
    </>
  );
};

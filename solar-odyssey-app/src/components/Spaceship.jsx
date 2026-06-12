import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Box, Cone, Cylinder, Html, Text } from '@react-three/drei';
import * as THREE from 'three';

export default function Spaceship({ isActive }) {
  const { camera } = useThree();
  const shipRef = useRef();
  const velocity = useRef(new THREE.Vector3());
  const rotationVelocity = useRef(new THREE.Vector2()); // pitch, yaw
  const keys = useRef({ w: false, a: false, s: false, d: false, shift: false, space: false, arrowup: false, arrowdown: false });
  const mouseRef = useRef(new THREE.Vector2(0, 0));
  const [speedVal, setSpeedVal] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (keys.current.hasOwnProperty(key) || key === ' ') {
        if (key === ' ') keys.current.space = true;
        else keys.current[key] = true;
      }
      if (e.key === 'ArrowUp') keys.current.arrowup = true;
      if (e.key === 'ArrowDown') keys.current.arrowdown = true;
    };
    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      if (keys.current.hasOwnProperty(key) || key === ' ') {
        if (key === ' ') keys.current.space = false;
        else keys.current[key] = false;
      }
      if (e.key === 'ArrowUp') keys.current.arrowup = false;
      if (e.key === 'ArrowDown') keys.current.arrowdown = false;
    };

    const handleMouseMove = (e) => {
      // Normalize mouse coordinates to -1 to +1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current.set(x, y);
    };

    if (isActive) {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      window.addEventListener('mousemove', handleMouseMove);
      
      // Setup initial ship position slightly in front of where camera was
      if (shipRef.current) {
        shipRef.current.position.copy(camera.position);
        shipRef.current.lookAt(0, 0, 0);
      }
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isActive, camera]);

  useFrame((state, delta) => {
    if (!isActive || !shipRef.current) return;

    const maxSpeed = keys.current.shift ? 4000 : 800;
    const accel = delta * maxSpeed;

    // Forward/Backward
    if (keys.current.w) velocity.current.z -= accel;
    if (keys.current.s) velocity.current.z += accel;
    
    // Rotation (Yaw)
    if (keys.current.a) rotationVelocity.current.y += delta * 2.5;
    if (keys.current.d) rotationVelocity.current.y -= delta * 2.5;

    // Rotation (Pitch)
    if (keys.current.arrowup) rotationVelocity.current.x -= delta * 2;
    if (keys.current.arrowdown) rotationVelocity.current.x += delta * 2;

    // Apply friction/drag
    velocity.current.multiplyScalar(0.92);
    rotationVelocity.current.multiplyScalar(0.85);

    // Apply rotation
    shipRef.current.rotation.y += rotationVelocity.current.y;
    shipRef.current.rotation.x += rotationVelocity.current.x;
    
    // Bank ship based on yaw (Roll)
    shipRef.current.rotation.z = THREE.MathUtils.lerp(shipRef.current.rotation.z, rotationVelocity.current.y * 2.0, 0.1);

    // Calculate forward direction vector
    const direction = new THREE.Vector3(0, 0, -1);
    direction.applyEuler(shipRef.current.rotation);
    
    // Move ship
    const moveVector = direction.clone().multiplyScalar(-velocity.current.z * delta);
    shipRef.current.position.add(moveVector);

    // Update Speed HUD
    setSpeedVal(Math.abs(Math.round(velocity.current.z * 10)));

    // FIRST PERSON CAMERA LOGIC
    // Mouse look target angles (allow looking behind almost 180 deg)
    const lookX = mouseRef.current.y * (Math.PI / 2.5); 
    const lookY = -mouseRef.current.x * (Math.PI / 1.2); 
    
    const headEuler = new THREE.Euler(lookX, lookY, 0, 'YXZ');
    const headQuat = new THREE.Quaternion().setFromEuler(headEuler);
    const shipQuat = shipRef.current.quaternion.clone();
    
    // Combine ship rotation with head look rotation
    const finalQuat = shipQuat.multiply(headQuat);
    camera.quaternion.slerp(finalQuat, 0.15);

    // Position camera exactly at pilot's eye level inside the cockpit
    const eyeOffset = new THREE.Vector3(0, 0.5, 0);
    eyeOffset.applyEuler(shipRef.current.rotation);
    const targetPos = shipRef.current.position.clone().add(eyeOffset);
    camera.position.lerp(targetPos, 0.5);
  });

  if (!isActive) return null;

  return (
    <group ref={shipRef}>
      {/* --- EXTERIOR --- */}
      <Cone args={[2, 10, 16]} rotation={[Math.PI / 2, 0, 0]} position={[0, -1.5, -2]}>
        <meshStandardMaterial color="#eeeeee" metalness={0.8} roughness={0.2} />
      </Cone>
      <Box args={[12, 0.2, 4]} position={[0, -2, 2]}>
        <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
      </Box>

      {/* Thruster Flames */}
      {(keys.current.w || keys.current.shift) && (
        <group position={[0, -1.5, 6]}>
          <pointLight intensity={keys.current.shift ? 10 : 5} color="#00ffff" distance={200} />
        </group>
      )}

      {/* --- INTERIOR COCKPIT --- */}
      {/* Cockpit Shell */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[3, 32, 32, 0, Math.PI * 2, 0, Math.PI / 1.8]} />
        <meshStandardMaterial color="#050505" side={THREE.BackSide} metalness={0.9} roughness={0.4} />
      </mesh>
      
      {/* Front Glass Canopy */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[2.9, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2.5]} />
        <meshPhysicalMaterial 
          color="#00ffcc" 
          transparent opacity={0.1} 
          roughness={0.1} transmission={0.9} thickness={0.5} 
          side={THREE.BackSide} 
        />
      </mesh>

      {/* Front Window Frame structure */}
      <mesh position={[0, 0, -2.8]}>
        <torusGeometry args={[2, 0.05, 16, 64]} />
        <meshStandardMaterial color="#222" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0, -2.8]} rotation={[0, 0, Math.PI/4]}>
        <cylinderGeometry args={[0.02, 0.02, 4]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[0, 0, -2.8]} rotation={[0, 0, -Math.PI/4]}>
        <cylinderGeometry args={[0.02, 0.02, 4]} />
        <meshStandardMaterial color="#222" />
      </mesh>

      {/* Dashboard Panel */}
      <group position={[0, -1.2, -1.5]} rotation={[-Math.PI / 6, 0, 0]}>
        <mesh>
          <boxGeometry args={[4, 1.5, 0.2]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.5} />
        </mesh>
        
        {/* Holographic Text on Dashboard */}
        <Text position={[-1.5, 0.3, 0.11]} fontSize={0.1} color="#00ffcc" anchorX="left">
          {`SYSTEMS: NOMINAL`}
        </Text>
        <Text position={[-1.5, 0.1, 0.11]} fontSize={0.15} color="#00ffcc" anchorX="left">
          {`VELOCITY: ${speedVal} KM/S`}
        </Text>
        <Text position={[-1.5, -0.2, 0.11]} fontSize={0.08} color="#ff5500" anchorX="left">
          {keys.current.shift ? 'HYPER-DRIVE: ENGAGED' : 'HYPER-DRIVE: STANDBY'}
        </Text>

        {/* Radar/Screen */}
        <mesh position={[1, 0, 0.11]}>
          <planeGeometry args={[1, 0.8]} />
          <meshBasicMaterial color="#002233" />
        </mesh>
        <mesh position={[1, 0, 0.12]}>
          <ringGeometry args={[0.1, 0.3, 16]} />
          <meshBasicMaterial color="#00ffcc" wireframe />
        </mesh>

        <pointLight position={[0, 1, 1]} intensity={0.5} color="#00ffcc" distance={5} />
      </group>

      {/* 2D HTML Overlay for Controls Hint */}
      <Html center position={[0, -2, -2]}>
        <div style={{
          color: 'rgba(0, 255, 204, 0.6)',
          fontFamily: 'monospace',
          fontSize: '14px',
          textAlign: 'center',
          pointerEvents: 'none',
          textShadow: '0 0 5px #000'
        }}>
          W/S: Throttle | A/D: Yaw | UP/DOWN: Pitch | SHIFT: Warp<br/>
          MOUSE: Look Around
        </div>
      </Html>
    </group>
  );
}

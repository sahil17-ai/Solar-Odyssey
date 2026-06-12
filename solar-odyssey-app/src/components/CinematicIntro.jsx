import React, { useRef, useEffect, useMemo } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

export default function CinematicIntro({ onComplete }) {
  const { camera } = useThree();
  const groupRef = useRef();
  const starsRef = useRef();
  const tunnelRef = useRef();
  const count = 3000;

  // Generate star positions for warp tunnel
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  useEffect(() => {
    if (starsRef.current) {
      for (let i = 0; i < count; i++) {
        const radius = 10 + Math.random() * 90;
        const theta = Math.random() * Math.PI * 2;
        const x = radius * Math.cos(theta);
        const y = radius * Math.sin(theta);
        const z = -Math.random() * 2000; // Stretch far down Z axis
        
        dummy.position.set(x, y, z);
        dummy.scale.set(0.1, 0.1, 10 + Math.random() * 50); // Elongate to look like speed lines
        dummy.updateMatrix();
        starsRef.current.setMatrixAt(i, dummy.matrix);
      }
      starsRef.current.instanceMatrix.needsUpdate = true;
    }

    // Set initial camera position in the center of the tunnel
    camera.position.set(0, 0, 0);
    camera.rotation.set(0, 0, 0);
    camera.fov = 60;
    camera.updateProjectionMatrix();

    const tl = gsap.timeline({
      onComplete: () => {
        camera.rotation.set(0, 0, 0);
        camera.fov = 45;
        camera.updateProjectionMatrix();
        onComplete();
      }
    });

    // Phase 1: Enter Hyper-Warp
    tl.to(camera.position, {
      z: -1500,
      duration: 5,
      ease: "power2.in"
    }, 0);

    // Increase FOV to simulate warp speed stretching
    tl.to(camera, {
      fov: 140,
      duration: 5,
      ease: "power3.in",
      onUpdate: () => camera.updateProjectionMatrix()
    }, 0);

    // Spin the camera
    tl.to(camera.rotation, {
      z: Math.PI * 4,
      duration: 8,
      ease: "power1.inOut"
    }, 0);

    // Phase 2: Arriving at Solar System
    tl.to(camera.position, {
      z: -2000,
      duration: 3,
      ease: "power1.out"
    }, 5);

    // Restore FOV quickly (Flash out of warp)
    tl.to(camera, {
      fov: 45,
      duration: 1,
      ease: "power4.out",
      onUpdate: () => camera.updateProjectionMatrix()
    }, 8);

    // Move to final Solar System position
    tl.to(camera.position, {
      x: 0,
      y: 600,
      z: 1000,
      duration: 3,
      ease: "power3.out"
    }, 8);

    tl.to(camera.rotation, {
      x: -Math.atan2(600, 1000),
      y: 0,
      z: 0,
      duration: 3,
      ease: "power3.out"
    }, 8);

    // Fade out tunnel elements
    tl.to(tunnelRef.current.position, {
      z: 1000, // Move it behind camera to hide
      duration: 1
    }, 8);

  }, [camera, onComplete, dummy]);

  useFrame((state, delta) => {
    // Scroll the stars towards the camera to create infinite warp effect
    if (starsRef.current && camera.position.z > -1900) {
      starsRef.current.position.z -= delta * 5000;
    }
  });

  return (
    <group ref={groupRef}>
      <group ref={tunnelRef}>
        <instancedMesh ref={starsRef} args={[null, null, count]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="#00ffcc" transparent opacity={0.8} />
        </instancedMesh>
        
        {/* Core Wormhole Glow */}
        <pointLight color="#ffffff" intensity={10} distance={500} position={[0, 0, -500]} />
        <pointLight color="#00ffff" intensity={5} distance={1000} position={[0, 0, -1000]} />
        
        {/* Central Black/White Hole */}
        <mesh position={[0, 0, -2000]}>
          <sphereGeometry args={[100, 32, 32]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
    </group>
  );
}

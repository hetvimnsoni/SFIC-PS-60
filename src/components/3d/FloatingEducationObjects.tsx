"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function FloatingEducationObjects() {
  const group1Ref = useRef<THREE.Mesh>(null);
  const group2Ref = useRef<THREE.Mesh>(null);
  const group3Ref = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (group1Ref.current) {
      group1Ref.current.rotation.x += delta * 0.4;
      group1Ref.current.rotation.y += delta * 0.6;
      group1Ref.current.position.y = 1.1 + Math.sin(t * 1.4) * 0.08;
    }

    if (group2Ref.current) {
      group2Ref.current.rotation.y -= delta * 0.5;
      group2Ref.current.rotation.z += delta * 0.3;
      group2Ref.current.position.y = -0.4 + Math.cos(t * 1.6) * 0.08;
    }

    if (group3Ref.current) {
      group3Ref.current.rotation.x += delta * 0.3;
      group3Ref.current.rotation.z -= delta * 0.4;
      group3Ref.current.position.y = 0.2 + Math.sin(t * 1.8 + 1) * 0.06;
    }

    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI / 3 + Math.sin(t * 0.8) * 0.15;
      ringRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group>
      {/* 1. Mathematical Dodecahedron (Top Right) */}
      <mesh ref={group1Ref} position={[1.8, 1.1, -0.6]} scale={0.22}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#818cf8"
          emissive="#4338ca"
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.8}
          wireframe={false}
        />
      </mesh>

      {/* 2. Science Octahedron / Polyhedron (Bottom Left) */}
      <mesh ref={group2Ref} position={[-1.9, -0.4, -0.4]} scale={0.24}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={0.8}
          roughness={0.15}
          metalness={0.85}
        />
      </mesh>

      {/* 3. Small Geometry Cube (Top Left) */}
      <mesh ref={group3Ref} position={[-1.7, 0.7, -0.8]} scale={0.18}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#34d399"
          emissive="#059669"
          emissiveIntensity={0.6}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* 4. Planetary Orbital Halo Ring */}
      <mesh ref={ringRef} position={[0, 0.3, -0.2]} scale={[2.2, 2.2, 1]}>
        <torusGeometry args={[1, 0.012, 16, 64]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#00f0ff"
          emissiveIntensity={2.5}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
}

"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { RobotSceneState } from "./HumanoidShikshaBot";

interface HolographicPanelsProps {
  sceneState: RobotSceneState;
}

export function HolographicPanels({ sceneState }: HolographicPanelsProps) {
  const p = sceneState.progress;

  // Scene 2 elements ref (Floating symbols)
  const symbolsGroupRef = useRef<THREE.Group>(null);
  // Scene 3 elements ref (Holographic subject boards)
  const diagGroupRef = useRef<THREE.Group>(null);
  // Scene 4 elements ref (Remedial learning path beads & ribbon)
  const pathGroupRef = useRef<THREE.Group>(null);
  // Scene 5 elements ref (3D Growth Graphs)
  const chartGroupRef = useRef<THREE.Group>(null);
  const barInitialRef = useRef<THREE.Mesh>(null);
  const barReassessRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // 1. Floating Symbols (Active around Scene 1 -> 2)
    if (symbolsGroupRef.current) {
      const visible = p >= 0.4 && p <= 2.2;
      symbolsGroupRef.current.visible = visible;
      if (visible) {
        symbolsGroupRef.current.rotation.y = t * 0.2;
        symbolsGroupRef.current.position.y = Math.sin(t * 1.5) * 0.05;
      }
    }

    // 2. Holographic Subject Diagnostic Panels (Scene 2 -> 3)
    if (diagGroupRef.current) {
      const visible = p >= 1.4 && p <= 3.2;
      diagGroupRef.current.visible = visible;
      if (visible) {
        diagGroupRef.current.position.x = -1.2 + Math.sin(t * 0.8) * 0.02;
        diagGroupRef.current.rotation.y = 0.35 + Math.sin(t * 0.6) * 0.03;
      }
    }

    // 3. Remedial Learning Pathway Objects (Scene 3 -> 4)
    if (pathGroupRef.current) {
      const visible = p >= 2.4 && p <= 4.2;
      pathGroupRef.current.visible = visible;
      if (visible) {
        pathGroupRef.current.rotation.y = -t * 0.15;
      }
    }

    // 4. 3D Growth Graphs (Scene 4 -> 5)
    if (chartGroupRef.current) {
      const visible = p >= 3.4 && p <= 5.2;
      chartGroupRef.current.visible = visible;
      if (visible && barInitialRef.current && barReassessRef.current) {
        const growthFactor = Math.min(1, Math.max(0, (p - 3.4) / 0.8));
        barInitialRef.current.scale.y = 0.35 * 1.2;
        barReassessRef.current.scale.y = 0.35 + (0.85 - 0.35) * growthFactor * 1.2;
      }
    }
  });

  return (
    <group>
      {/* ============================================================== */}
      {/* SCENE 2: FLOATING SUBTLE EDUCATIONAL PARTICLES & SYMBOLS        */}
      {/* ============================================================== */}
      <group ref={symbolsGroupRef} position={[-0.8, 0.4, -0.3]}>
        {/* Math Polyhedron */}
        <mesh position={[-1.2, 0.6, -0.4]} scale={0.16}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={1.2}
            roughness={0.2}
            metalness={0.8}
            wireframe
          />
        </mesh>
        {/* Language Glyphs */}
        <mesh position={[-1.5, -0.3, 0.2]} scale={0.14}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#818cf8"
            emissive="#4f46e5"
            emissiveIntensity={1.4}
            roughness={0.15}
            metalness={0.85}
          />
        </mesh>
      </group>

      {/* ============================================================== */}
      {/* SCENE 3: 3D HOLOGRAPHIC DIAGNOSTIC DATA PANELS                 */}
      {/* ============================================================== */}
      <group ref={diagGroupRef} position={[-1.3, 0.1, 0.2]}>
        {/* Panel Backdrop Screen */}
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[1.5, 1.1]} />
          <meshStandardMaterial
            color="#0b1329"
            emissive="#00f0ff"
            emissiveIntensity={0.15}
            transparent
            opacity={0.7}
            roughness={0.1}
            metalness={0.9}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Panel Glowing Neon Border */}
        <lineSegments position={[0, 0, 0.01]}>
          <edgesGeometry args={[new THREE.PlaneGeometry(1.5, 1.1)]} />
          <lineBasicMaterial color="#00f0ff" linewidth={2} />
        </lineSegments>

        {/* Diagnostic Bar 1: Mathematics (68%) */}
        <group position={[-0.55, 0.3, 0.04]}>
          <mesh position={[0.4, 0, 0]}>
            <boxGeometry args={[0.8, 0.08, 0.02]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[0.4 * 0.68, 0, 0.01]}>
            <boxGeometry args={[0.8 * 0.68, 0.08, 0.02]} />
            <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2.2} />
          </mesh>
        </group>

        {/* Diagnostic Bar 2: Gujarati (84%) */}
        <group position={[-0.55, 0.1, 0.04]}>
          <mesh position={[0.4, 0, 0]}>
            <boxGeometry args={[0.8, 0.08, 0.02]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[0.4 * 0.84, 0, 0.01]}>
            <boxGeometry args={[0.8 * 0.84, 0.08, 0.02]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={2.2} />
          </mesh>
        </group>

        {/* Diagnostic Bar 3: English (74%) */}
        <group position={[-0.55, -0.1, 0.04]}>
          <mesh position={[0.4, 0, 0]}>
            <boxGeometry args={[0.8, 0.08, 0.02]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[0.4 * 0.74, 0, 0.01]}>
            <boxGeometry args={[0.8 * 0.74, 0.08, 0.02]} />
            <meshStandardMaterial color="#818cf8" emissive="#818cf8" emissiveIntensity={2.0} />
          </mesh>
        </group>

        {/* Diagnostic Bar 4: EVS (81%) */}
        <group position={[-0.55, -0.3, 0.04]}>
          <mesh position={[0.4, 0, 0]}>
            <boxGeometry args={[0.8, 0.08, 0.02]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[0.4 * 0.81, 0, 0.01]}>
            <boxGeometry args={[0.8 * 0.81, 0.08, 0.02]} />
            <meshStandardMaterial color="#34d399" emissive="#10b981" emissiveIntensity={2.0} />
          </mesh>
        </group>
      </group>

      {/* ============================================================== */}
      {/* SCENE 4: REMEDIAL LEARNING PATHWAY (Beads & Number Line)       */}
      {/* ============================================================== */}
      <group ref={pathGroupRef} position={[-0.7, 0.2, 0]}>
        {/* Glowing Manipulative Beads Array (5 Steps) */}
        {[-0.6, -0.3, 0, 0.3, 0.6].map((xOffset, idx) => (
          <group key={idx} position={[xOffset, Math.sin(idx * 0.8) * 0.15, 0]}>
            <mesh scale={0.09}>
              <sphereGeometry args={[1, 20, 20]} />
              <meshStandardMaterial
                color={idx === 4 ? "#34d399" : "#00f0ff"}
                emissive={idx === 4 ? "#10b981" : "#00f0ff"}
                emissiveIntensity={2.8}
              />
            </mesh>
            <mesh position={[0, -0.22, 0]} scale={[0.14, 0.02, 0.14]}>
              <cylinderGeometry args={[1, 1, 1, 16]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
          </group>
        ))}

        {/* Connecting Number-Line Laser Path */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[1.6, 0.015, 0.015]} />
          <meshStandardMaterial
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveIntensity={3.5}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* ============================================================== */}
      {/* SCENE 5: 3D PERCENTAGE-POINT GAIN CHART (+50 PP RECOVERY)      */}
      {/* ============================================================== */}
      <group ref={chartGroupRef} position={[-0.9, -0.3, 0.3]}>
        {/* Baseline Bar (Aarav: 35%) */}
        <group position={[-0.28, 0, 0]}>
          <mesh ref={barInitialRef} position={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 1, 20]} />
            <meshStandardMaterial
              color="#f43f5e"
              emissive="#e11d48"
              emissiveIntensity={1.8}
              roughness={0.2}
            />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.04, 20]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        </group>

        {/* Reassessment Bar (Aarav: 85% - +50 pp gain!) */}
        <group position={[0.28, 0, 0]}>
          <mesh ref={barReassessRef} position={[0, 0.85, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 1, 20]} />
            <meshStandardMaterial
              color="#00f0ff"
              emissive="#00f0ff"
              emissiveIntensity={3.2}
              roughness={0.1}
            />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.13, 0.13, 0.04, 20]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        </group>

        {/* Metric Delta Arch Line */}
        <mesh position={[0, 0.95, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.01, 0.01, 0.56, 16]} />
          <meshStandardMaterial
            color="#34d399"
            emissive="#10b981"
            emissiveIntensity={3.0}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  );
}

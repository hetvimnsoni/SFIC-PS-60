"use client";

import React, { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface ShikshaBot3DProps {
  scrollProgress?: number;
  scale?: number;
  position?: [number, number, number];
}

export function ShikshaBot3D({
  scrollProgress = 0,
  scale = 1,
  position = [0, -0.6, 0],
}: ShikshaBot3DProps) {
  const robotRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const chestRef = useRef<THREE.Group>(null);
  const pupilLeftRef = useRef<THREE.Mesh>(null);
  const pupilRightRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);

  const [isBlinking, setIsBlinking] = useState(false);
  const { pointer } = useThree();

  // Natural blinking timer
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 4000);
    return () => clearInterval(blinkInterval);
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // 1. Robot breathing & floating bob
    if (robotRef.current) {
      const breath = Math.sin(t * 1.8) * 0.04;
      robotRef.current.position.y = position[1] + breath;

      // Scroll-linked reaction: smooth rotation & lateral shift
      const targetScrollRotY = scrollProgress * 0.65;
      const targetScrollPosX = scrollProgress * 1.1;
      const targetScrollScale = scale * (1 - scrollProgress * 0.15);

      robotRef.current.rotation.y = THREE.MathUtils.lerp(
        robotRef.current.rotation.y,
        targetScrollRotY + Math.sin(t * 0.8) * 0.04,
        delta * 3
      );
      robotRef.current.position.x = THREE.MathUtils.lerp(
        robotRef.current.position.x,
        position[0] + targetScrollPosX,
        delta * 3
      );
      robotRef.current.scale.setScalar(
        THREE.MathUtils.lerp(robotRef.current.scale.x, targetScrollScale, delta * 3)
      );
    }

    // 2. Chest subtle respiration tilt
    if (chestRef.current) {
      chestRef.current.rotation.x = Math.sin(t * 1.8) * 0.02;
    }

    // 3. Head cursor tracking with smooth interpolation
    if (headRef.current) {
      const targetHeadRotY = pointer.x * 0.6;
      const targetHeadRotX = -pointer.y * 0.4;
      headRef.current.rotation.y = THREE.MathUtils.lerp(
        headRef.current.rotation.y,
        targetHeadRotY,
        delta * 4.5
      );
      headRef.current.rotation.x = THREE.MathUtils.lerp(
        headRef.current.rotation.x,
        targetHeadRotX,
        delta * 4.5
      );
      // Subtle head roll with lateral pointer move
      headRef.current.rotation.z = THREE.MathUtils.lerp(
        headRef.current.rotation.z,
        -pointer.x * 0.1,
        delta * 4
      );
    }

    // 4. Pupils tracking cursor inside visor
    const blinkScaleY = isBlinking ? 0.1 : 1;

    if (pupilLeftRef.current) {
      const targetPupilX = -0.15 + pointer.x * 0.08;
      const targetPupilY = pointer.y * 0.06;
      pupilLeftRef.current.position.x = THREE.MathUtils.lerp(
        pupilLeftRef.current.position.x,
        targetPupilX,
        delta * 7
      );
      pupilLeftRef.current.position.y = THREE.MathUtils.lerp(
        pupilLeftRef.current.position.y,
        targetPupilY,
        delta * 7
      );
      pupilLeftRef.current.scale.y = THREE.MathUtils.lerp(
        pupilLeftRef.current.scale.y,
        blinkScaleY,
        delta * 20
      );
    }

    if (pupilRightRef.current) {
      const targetPupilX = 0.15 + pointer.x * 0.08;
      const targetPupilY = pointer.y * 0.06;
      pupilRightRef.current.position.x = THREE.MathUtils.lerp(
        pupilRightRef.current.position.x,
        targetPupilX,
        delta * 7
      );
      pupilRightRef.current.position.y = THREE.MathUtils.lerp(
        pupilRightRef.current.position.y,
        targetPupilY,
        delta * 7
      );
      pupilRightRef.current.scale.y = THREE.MathUtils.lerp(
        pupilRightRef.current.scale.y,
        blinkScaleY,
        delta * 20
      );
    }

    // 5. Pulsing electric glow on halo ring
    if (haloRef.current) {
      const pulse = 2.8 + Math.sin(t * 3.5) * 0.5;
      (haloRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse;
    }
  });

  return (
    <group ref={robotRef} position={position} scale={scale} dispose={null}>
      {/* ============================================================== */}
      {/* 1. HEAD & VISOR ASSEMBLY                                      */}
      {/* ============================================================== */}
      <group ref={headRef} position={[0, 1.35, 0]}>
        {/* White Polymer Helmet Shell */}
        <mesh castShadow receiveShadow position={[0, 0, -0.05]}>
          <sphereGeometry args={[0.42, 32, 32]} />
          <meshStandardMaterial
            color="#f8fafc"
            roughness={0.15}
            metalness={0.1}
            envMapIntensity={1.2}
          />
        </mesh>

        {/* Chin / Jaw Plate Accent */}
        <mesh position={[0, -0.22, 0.12]} rotation={[-0.2, 0, 0]}>
          <cylinderGeometry args={[0.26, 0.22, 0.18, 24]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.2} metalness={0.15} />
        </mesh>

        {/* Dark Visor Cavity Screen */}
        <mesh position={[0, 0.02, 0.18]} scale={[1, 1.25, 0.8]}>
          <sphereGeometry args={[0.32, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial
            color="#050814"
            roughness={0.05}
            metalness={0.9}
          />
        </mesh>

        {/* Luminous Glowing Halo Ring on Face (Reference Image Feature) */}
        <mesh ref={haloRef} position={[0, 0.04, 0.35]} scale={[1, 1.4, 0.3]}>
          <torusGeometry args={[0.22, 0.035, 24, 64]} />
          <meshStandardMaterial
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveIntensity={3.2}
            toneMapped={false}
          />
        </mesh>

        {/* Subtle Visor Inner Point Light */}
        <pointLight position={[0, 0.04, 0.4]} color="#00f0ff" intensity={1.8} distance={1.2} />

        {/* Left Pupil Eye (Tracks Mouse Cursor) */}
        <mesh ref={pupilLeftRef} position={[-0.15, 0, 0.32]}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#38bdf8"
            emissiveIntensity={2.8}
            toneMapped={false}
          />
        </mesh>

        {/* Right Pupil Eye (Tracks Mouse Cursor) */}
        <mesh ref={pupilRightRef} position={[0.15, 0, 0.32]}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#38bdf8"
            emissiveIntensity={2.8}
            toneMapped={false}
          />
        </mesh>

        {/* Antenna Stem */}
        <mesh position={[0, 0.44, -0.05]}>
          <cylinderGeometry args={[0.015, 0.015, 0.14, 16]} />
          <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Antenna Glowing Orb */}
        <mesh position={[0, 0.52, -0.05]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveIntensity={3.0}
            toneMapped={false}
          />
        </mesh>

        {/* Left Ear Port */}
        <mesh position={[-0.42, 0.02, -0.05]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 0.06, 24]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh position={[-0.45, 0.02, -0.05]}>
          <ringGeometry args={[0.03, 0.06, 24]} />
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2.0} />
        </mesh>

        {/* Right Ear Port */}
        <mesh position={[0.42, 0.02, -0.05]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 0.06, 24]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh position={[0.45, 0.02, -0.05]}>
          <ringGeometry args={[0.03, 0.06, 24]} />
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2.0} />
        </mesh>
      </group>

      {/* ============================================================== */}
      {/* 2. CERVICAL NECK COLUMN (CHROME & HYDRAULICS)                  */}
      {/* ============================================================== */}
      <group position={[0, 0.98, -0.04]}>
        {/* Central Core Hydraulic Cylinder */}
        <mesh>
          <cylinderGeometry args={[0.07, 0.08, 0.22, 24]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Vertebrae Rings */}
        <mesh position={[0, 0.05, 0]}>
          <torusGeometry args={[0.1, 0.02, 16, 32]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.1} />
        </mesh>
        <mesh position={[0, -0.05, 0]}>
          <torusGeometry args={[0.11, 0.022, 16, 32]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.1} />
        </mesh>
      </group>

      {/* ============================================================== */}
      {/* 3. CHEST / UPPER TORSO CHASSIS                                 */}
      {/* ============================================================== */}
      <group ref={chestRef} position={[0, 0.52, 0]}>
        {/* Sculpted Front Breastplate (Unitree Humanoid Style) */}
        <mesh castShadow receiveShadow position={[0, 0.12, 0.04]}>
          <boxGeometry args={[0.82, 0.56, 0.44]} />
          <meshStandardMaterial
            color="#f8fafc"
            roughness={0.15}
            metalness={0.1}
            envMapIntensity={1.2}
          />
        </mesh>

        {/* Chest Central Tech Badge Emblem */}
        <mesh position={[0, 0.22, 0.27]}>
          <boxGeometry args={[0.34, 0.1, 0.02]} />
          <meshStandardMaterial
            color="#1e293b"
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>
        {/* Glowing Luminous Status Line */}
        <mesh position={[0, 0.22, 0.285]}>
          <planeGeometry args={[0.26, 0.02]} />
          <meshStandardMaterial
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveIntensity={3.0}
            toneMapped={false}
          />
        </mesh>

        {/* Mechanical Rib / Vent Insets Left */}
        <mesh position={[-0.34, 0.06, 0.08]} rotation={[0, 0.3, 0]}>
          <boxGeometry args={[0.12, 0.32, 0.28]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.4} />
        </mesh>

        {/* Mechanical Rib / Vent Insets Right */}
        <mesh position={[0.34, 0.06, 0.08]} rotation={[0, -0.3, 0]}>
          <boxGeometry args={[0.12, 0.32, 0.28]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.4} />
        </mesh>

        {/* ============================================================ */}
        {/* 4. SHOULDERS & ARMS                                          */}
        {/* ============================================================ */}
        {/* Left Shoulder Ball & Socket */}
        <group position={[-0.54, 0.26, 0]}>
          {/* Socket Cap */}
          <mesh>
            <sphereGeometry args={[0.15, 24, 24]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.1} />
          </mesh>
          {/* Metallic Inner Pivot Ring */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.155, 0.015, 16, 32]} />
            <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Upper Arm Bicep */}
          <mesh position={[-0.04, -0.32, 0]}>
            <cylinderGeometry args={[0.075, 0.065, 0.38, 20]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.2} />
          </mesh>
          {/* Elbow Joint */}
          <mesh position={[-0.04, -0.54, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.06, 0.06, 0.12, 16]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Forearm */}
          <mesh position={[-0.04, -0.78, 0.04]}>
            <cylinderGeometry args={[0.06, 0.05, 0.36, 18]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.2} />
          </mesh>
          {/* Hand Palm */}
          <mesh position={[-0.04, -1.02, 0.05]}>
            <boxGeometry args={[0.08, 0.12, 0.04]} />
            <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
          </mesh>
        </group>

        {/* Right Shoulder Ball & Socket */}
        <group position={[0.54, 0.26, 0]}>
          {/* Socket Cap */}
          <mesh>
            <sphereGeometry args={[0.15, 24, 24]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.1} />
          </mesh>
          {/* Metallic Inner Pivot Ring */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.155, 0.015, 16, 32]} />
            <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Upper Arm Bicep */}
          <mesh position={[0.04, -0.32, 0]}>
            <cylinderGeometry args={[0.075, 0.065, 0.38, 20]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.2} />
          </mesh>
          {/* Elbow Joint */}
          <mesh position={[0.04, -0.54, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.06, 0.06, 0.12, 16]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Forearm */}
          <mesh position={[0.04, -0.78, 0.04]}>
            <cylinderGeometry args={[0.06, 0.05, 0.36, 18]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.2} />
          </mesh>
          {/* Hand Palm */}
          <mesh position={[0.04, -1.02, 0.05]}>
            <boxGeometry args={[0.08, 0.12, 0.04]} />
            <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
          </mesh>
        </group>
      </group>

      {/* ============================================================== */}
      {/* 5. MECHANICAL WAIST SUSPENSION (COIL SPRING & ACTUATOR)       */}
      {/* ============================================================== */}
      <group position={[0, 0.04, 0]}>
        {/* Central Spine Cylinder */}
        <mesh>
          <cylinderGeometry args={[0.09, 0.09, 0.36, 24]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Chrome Coil Rings (Heavy Spring Suspension) */}
        {[-0.1, -0.03, 0.04, 0.11].map((yOffset, i) => (
          <mesh key={i} position={[0, yOffset, 0]}>
            <torusGeometry args={[0.13, 0.02, 16, 32]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.1} />
          </mesh>
        ))}
        {/* Left Hydraulic Cylinder Rod */}
        <mesh position={[-0.18, 0, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.32, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
        </mesh>
        {/* Right Hydraulic Cylinder Rod */}
        <mesh position={[0.18, 0, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.32, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
        </mesh>
      </group>

      {/* ============================================================== */}
      {/* 6. PELVIS & HIP CHASSIS                                       */}
      {/* ============================================================== */}
      <group position={[0, -0.32, 0]}>
        {/* Sculpted White Pelvic Saddle */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.26, 0.32, 0.28, 24]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.1} />
        </mesh>
        {/* Dark Inset Tech Center */}
        <mesh position={[0, 0, 0.16]}>
          <boxGeometry args={[0.18, 0.14, 0.06]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Left Hip Ball Joint & Thigh Mount */}
        <group position={[-0.24, -0.16, 0]}>
          <mesh>
            <sphereGeometry args={[0.13, 20, 20]} />
            <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, -0.22, 0]}>
            <cylinderGeometry args={[0.11, 0.09, 0.34, 20]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.2} />
          </mesh>
        </group>

        {/* Right Hip Ball Joint & Thigh Mount */}
        <group position={[0.24, -0.16, 0]}>
          <mesh>
            <sphereGeometry args={[0.13, 20, 20]} />
            <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, -0.22, 0]}>
            <cylinderGeometry args={[0.11, 0.09, 0.34, 20]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.2} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

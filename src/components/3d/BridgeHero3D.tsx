"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Float } from "@react-three/drei";

interface BridgeHero3DProps {
  progress: number; // 0 to 5 continuous scroll progress
  mousePosition?: { x: number; y: number };
}

// 1. Left Island: The Learning Gap Island (Cracked cubes, dim, child figure)
function GapIsland({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.position.y = -1.2 + Math.sin(Date.now() * 0.001) * 0.04;
    }
  });

  return (
    <group ref={groupRef} position={[-2.8, -1.2, 0]}>
      {/* Floating Island Rock Base */}
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[1.5, 0.4, 1.2, 7]} />
        <meshStandardMaterial color="#1a1c2e" roughness={0.9} metalness={0.1} />
      </mesh>
      {/* Island Top Soil/Grass */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[1.52, 1.5, 0.15, 7]} />
        <meshStandardMaterial color="#2d2238" roughness={0.8} />
      </mesh>

      {/* Dim Cracked Block Tower (Alphabet & Number blocks) */}
      <group position={[-0.4, 0.5, -0.2]}>
        {/* Block 1 (A) */}
        <mesh position={[0, 0, 0]} rotation={[0, 0.1, 0.05]}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color="#3b3355" roughness={0.7} />
        </mesh>
        {/* Block 2 (B) - slightly tilted */}
        <mesh position={[0.05, 0.52, 0.02]} rotation={[0.05, -0.15, -0.08]}>
          <boxGeometry args={[0.48, 0.48, 0.48]} />
          <meshStandardMaterial color="#4a3b69" roughness={0.7} />
        </mesh>
        {/* Block 3 (1) - cracked & glowing coral edge */}
        <mesh position={[-0.03, 1.02, -0.04]} rotation={[-0.05, 0.2, 0.12]}>
          <boxGeometry args={[0.45, 0.45, 0.45]} />
          <meshStandardMaterial
            color="#5a2e3b"
            emissive="#FF5C6C"
            emissiveIntensity={0.25}
            roughness={0.6}
          />
        </mesh>
      </group>

      {/* Small Stylized Child Figure standing on edge looking at the bridge */}
      <group position={[0.9, 0.4, 0.1]} rotation={[0, Math.PI / 2, 0]}>
        {/* Body */}
        <mesh position={[0, 0.2, 0]}>
          <capsuleGeometry args={[0.1, 0.25, 4, 8]} />
          <meshStandardMaterial color="#FF8A3D" roughness={0.5} />
        </mesh>
        {/* Head */}
        <mesh position={[0, 0.45, 0]}>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshStandardMaterial color="#ffd1a4" roughness={0.6} />
        </mesh>
        {/* Small Backpack */}
        <mesh position={[-0.08, 0.22, 0]}>
          <boxGeometry args={[0.1, 0.18, 0.16]} />
          <meshStandardMaterial color="#3DDBA9" />
        </mesh>
      </group>

      {/* Dim Gap Warning Beacon */}
      <pointLight position={[-0.4, 1.5, 0]} color="#FF5C6C" intensity={0.8} distance={3} />
    </group>
  );
}

// 2. Right Island: The Mastery Island (Golden beacon, lush garden, complete tower)
function MasteryIsland({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const beaconRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.position.y = -0.9 + Math.cos(Date.now() * 0.001) * 0.04;
    }
    if (beaconRef.current) {
      beaconRef.current.rotation.y += delta * 0.8;
    }
  });

  return (
    <group ref={groupRef} position={[2.9, -0.9, 0]}>
      {/* Floating Island Rock Base */}
      <mesh position={[0, -0.7, 0]}>
        <cylinderGeometry args={[1.6, 0.5, 1.4, 8]} />
        <meshStandardMaterial color="#192338" roughness={0.85} metalness={0.2} />
      </mesh>
      {/* Lush Green/Mint Plateau */}
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[1.65, 1.6, 0.18, 8]} />
        <meshStandardMaterial color="#1a4d3e" roughness={0.7} />
      </mesh>

      {/* Bright Complete Golden Mastery Tower */}
      <group position={[0.4, 0.6, -0.2]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.55, 0.55, 0.55]} />
          <meshStandardMaterial
            color="#2a7d65"
            emissive="#3DDBA9"
            emissiveIntensity={0.2}
            roughness={0.4}
          />
        </mesh>
        <mesh position={[0, 0.58, 0]}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial
            color="#3DDBA9"
            emissive="#3DDBA9"
            emissiveIntensity={0.35}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[0, 1.15, 0]}>
          <boxGeometry args={[0.42, 0.42, 0.42]} />
          <meshStandardMaterial
            color="#FFD166"
            emissive="#FFD166"
            emissiveIntensity={0.5}
            roughness={0.2}
          />
        </mesh>

        {/* Rotating Golden Star Beacon */}
        <mesh ref={beaconRef} position={[0, 1.7, 0]}>
          <octahedronGeometry args={[0.22, 0]} />
          <meshStandardMaterial
            color="#FFF4CC"
            emissive="#FF8A3D"
            emissiveIntensity={1.2}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* Vibrant Mint Mastery Glow Light */}
      <pointLight position={[0.4, 1.7, 0]} color="#3DDBA9" intensity={2.5} distance={5} />
      <pointLight position={[0, 0.5, 0.5]} color="#FF8A3D" intensity={1.5} distance={4} />
    </group>
  );
}

// 3. The Glowing Bridge Planks & Cables that assemble as the user scrolls
function BridgeAssembly({ progress }: { progress: number }) {
  const plankCount = 14;
  // Planks assemble based on progress. In hero (progress 0 to 1), at least 6 are built;
  // by progress >= 1.5, all 14 planks are completely built!
  const buildRatio = Math.min(1, Math.max(0.3, progress * 0.7 + 0.3));
  const activePlanks = Math.floor(buildRatio * plankCount);

  const startX = -1.8;
  const endX = 1.8;
  const startY = -1.15;
  const endY = -0.85;

  return (
    <group position={[0, 0, 0]}>
      {/* Main Glowing Bridge Suspension Cables */}
      <mesh position={[0, -0.65, -0.35]} rotation={[0, 0, 0.08]}>
        <cylinderGeometry args={[0.015, 0.015, 3.8, 8]} />
        <meshStandardMaterial
          color="#FF8A3D"
          emissive="#FF8A3D"
          emissiveIntensity={0.8}
        />
      </mesh>
      <mesh position={[0, -0.65, 0.35]} rotation={[0, 0, 0.08]}>
        <cylinderGeometry args={[0.015, 0.015, 3.8, 8]} />
        <meshStandardMaterial
          color="#3DDBA9"
          emissive="#3DDBA9"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Sequentially Assembling Glowing Planks */}
      {Array.from({ length: plankCount }).map((_, i) => {
        const t = i / (plankCount - 1);
        const x = startX + t * (endX - startX);
        const y = startY + t * (endY - startY);
        const isBuilt = i <= activePlanks;
        const isJustBuilding = i === activePlanks;

        return (
          <group
            key={i}
            position={[x, y + (isBuilt ? 0 : -0.8), 0]}
            rotation={[0, 0, 0.08]}
          >
            {/* Plank Mesh */}
            <mesh scale={isBuilt ? [1, 1, 1] : [0.01, 0.01, 0.01]}>
              <boxGeometry args={[0.22, 0.05, 0.7]} />
              <meshStandardMaterial
                color={isJustBuilding ? "#FF8A3D" : t > 0.5 ? "#2a6652" : "#3b4468"}
                emissive={isJustBuilding ? "#FF8A3D" : t > 0.6 ? "#3DDBA9" : "#FF8A3D"}
                emissiveIntensity={isJustBuilding ? 1.5 : 0.35}
                roughness={0.4}
              />
            </mesh>

            {/* Vertical Suspender Cord */}
            {isBuilt && (
              <mesh position={[0, 0.3, 0.33]}>
                <cylinderGeometry args={[0.005, 0.005, 0.55, 4]} />
                <meshStandardMaterial
                  color="#FF8A3D"
                  emissive="#FF8A3D"
                  emissiveIntensity={0.4}
                />
              </mesh>
            )}
            {isBuilt && (
              <mesh position={[0, 0.3, -0.33]}>
                <cylinderGeometry args={[0.005, 0.005, 0.55, 4]} />
                <meshStandardMaterial
                  color="#3DDBA9"
                  emissive="#3DDBA9"
                  emissiveIntensity={0.4}
                />
              </mesh>
            )}
          </group>
        );
      })}

      {/* Animated Walking Child Crossing The Bridge as progress increases */}
      {progress > 0.1 && (
        <group
          position={[
            startX + Math.min(1, progress * 0.35) * (endX - startX),
            startY + Math.min(1, progress * 0.35) * (endY - startY) + 0.35,
            0,
          ]}
          rotation={[0, Math.PI / 2, 0.08]}
        >
          <mesh position={[0, 0.1, 0]}>
            <capsuleGeometry args={[0.08, 0.2, 4, 8]} />
            <meshStandardMaterial color="#FF8A3D" emissive="#FF8A3D" emissiveIntensity={0.3} />
          </mesh>
          <mesh position={[0, 0.32, 0]}>
            <sphereGeometry args={[0.1, 10, 10]} />
            <meshStandardMaterial color="#ffd1a4" />
          </mesh>
          {/* Walking Light Beacon under feet */}
          <pointLight color="#FF8A3D" intensity={1.2} distance={1.5} />
        </group>
      )}
    </group>
  );
}

// 4. ShikshaBot 3D Companion Orb floating near the bridge
function ShikshaBotOrb({ progress }: { progress: number }) {
  const botRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (botRef.current) {
      // Gentle floating hover motion
      botRef.current.position.y = 0.55 + Math.sin(t * 1.5) * 0.12;
      botRef.current.position.x = 0.6 + Math.cos(t * 0.8) * 0.08;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = t * 0.6;
      ringRef.current.rotation.y = t * 0.9;
    }
  });

  return (
    <group ref={botRef} position={[0.6, 0.55, 0.5]}>
      {/* Outer Metallic Pearl Sphere */}
      <mesh>
        <sphereGeometry args={[0.26, 32, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.15}
          metalness={0.85}
          envMapIntensity={1}
        />
      </mesh>

      {/* Visor / Eye display */}
      <mesh position={[0, 0.04, 0.22]}>
        <boxGeometry args={[0.24, 0.1, 0.08]} />
        <meshStandardMaterial
          color="#0f172a"
          emissive="#38BDF8"
          emissiveIntensity={1.8}
          roughness={0.1}
        />
      </mesh>

      {/* Floating Gyroscopic Halo Ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[0.38, 0.014, 12, 32]} />
        <meshStandardMaterial
          color="#FF8A3D"
          emissive="#FF8A3D"
          emissiveIntensity={1.2}
          roughness={0.2}
        />
      </mesh>

      {/* Top Antenna Sparkle */}
      <mesh position={[0, 0.32, 0]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial
          color="#3DDBA9"
          emissive="#3DDBA9"
          emissiveIntensity={2}
        />
      </mesh>

      {/* Gentle Pointlight from ShikshaBot */}
      <pointLight color="#38BDF8" intensity={1.5} distance={2.5} />
    </group>
  );
}

// 5. Classroom Desk Grid with Glowing Red Hidden Gap Desks (Scene 2: Challenge)
function ClassroomDesks({ progress }: { progress: number }) {
  // Only visible when scrolling into Scene 2 (progress between 0.8 and 2.2)
  if (progress < 0.6 || progress > 2.5) return null;

  const rows = 5;
  const cols = 6; // 30 desks total
  const gapDesks = [4, 11, 19, 26]; // 4 hidden learning gaps

  return (
    <group position={[0, -2.5, -2]} rotation={[-0.3, 0, 0]}>
      {Array.from({ length: rows * cols }).map((_, idx) => {
        const r = Math.floor(idx / cols);
        const c = idx % cols;
        const x = (c - cols / 2 + 0.5) * 0.9;
        const z = (r - rows / 2 + 0.5) * 0.9;
        const isGap = gapDesks.includes(idx);

        return (
          <group key={idx} position={[x, 0, z]}>
            {/* Desk Surface */}
            <mesh position={[0, 0.25, 0]}>
              <boxGeometry args={[0.55, 0.04, 0.38]} />
              <meshStandardMaterial
                color={isGap ? "#4a1d27" : "#1e293b"}
                emissive={isGap ? "#FF5C6C" : "#000000"}
                emissiveIntensity={isGap ? 0.9 : 0}
                roughness={0.6}
              />
            </mesh>
            {/* Small book/paper on desk */}
            <mesh position={[0, 0.28, 0]}>
              <boxGeometry args={[0.2, 0.015, 0.25]} />
              <meshStandardMaterial color={isGap ? "#ffd1d6" : "#94a3b8"} />
            </mesh>
            {isGap && (
              <pointLight position={[0, 0.45, 0]} color="#FF5C6C" intensity={1.2} distance={1.2} />
            )}
          </group>
        );
      })}
    </group>
  );
}

// 6. 4 Stations for Scene 3 (The Solution / 4 Phases)
function FourStations({ progress }: { progress: number }) {
  // Visible during Scene 3 (progress ~ 1.8 to 3.5)
  if (progress < 1.6 || progress > 3.6) return null;

  return (
    <group position={[0, -0.2, 0.5]}>
      {/* Station 1: Diagnostic Scorecard */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
        <group position={[-2.2, 0.2, 0]}>
          <mesh>
            <boxGeometry args={[0.7, 0.9, 0.05]} />
            <meshStandardMaterial color="#1e293b" roughness={0.5} />
          </mesh>
          {/* Clipboard clip */}
          <mesh position={[0, 0.45, 0.03]}>
            <boxGeometry args={[0.3, 0.08, 0.04]} />
            <meshStandardMaterial color="#FF8A3D" emissive="#FF8A3D" emissiveIntensity={0.6} />
          </mesh>
        </group>
      </Float>

      {/* Station 2: Magnifying Glass over Gap Cube */}
      <Float speed={2.5} rotationIntensity={0.3} floatIntensity={0.4}>
        <group position={[-0.8, 0.3, 0]}>
          <mesh rotation={[0, 0, 0.4]}>
            <torusGeometry args={[0.25, 0.03, 16, 32]} />
            <meshStandardMaterial color="#38BDF8" emissive="#38BDF8" emissiveIntensity={0.8} />
          </mesh>
          <mesh position={[0.25, -0.25, 0]} rotation={[0, 0, -0.7]}>
            <cylinderGeometry args={[0.02, 0.02, 0.35, 8]} />
            <meshStandardMaterial color="#94a3b8" />
          </mesh>
        </group>
      </Float>

      {/* Station 3: Abacus beads & Number Line Manipulative */}
      <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.3}>
        <group position={[0.8, 0.2, 0]}>
          <mesh>
            <boxGeometry args={[0.9, 0.4, 0.06]} />
            <meshStandardMaterial color="#2a1f3d" roughness={0.6} />
          </mesh>
          {/* Bead rows */}
          {[-0.25, 0, 0.25].map((bx, i) => (
            <mesh key={i} position={[bx, 0.05, 0.05]}>
              <sphereGeometry args={[0.07, 12, 12]} />
              <meshStandardMaterial color="#FF8A3D" emissive="#FF8A3D" emissiveIntensity={0.8} />
            </mesh>
          ))}
        </group>
      </Float>

      {/* Station 4: Rising Reassessment Bar Chart (+50 pp) */}
      <Float speed={2.2} rotationIntensity={0.2} floatIntensity={0.3}>
        <group position={[2.2, 0.3, 0]}>
          {/* Bar 1 (Baseline: 35%) */}
          <mesh position={[-0.15, -0.15, 0]}>
            <boxGeometry args={[0.15, 0.35, 0.15]} />
            <meshStandardMaterial color="#FF5C6C" emissive="#FF5C6C" emissiveIntensity={0.5} />
          </mesh>
          {/* Bar 2 (Mastery: 85%) */}
          <mesh position={[0.15, 0.15, 0]}>
            <boxGeometry args={[0.15, 0.85, 0.15]} />
            <meshStandardMaterial color="#3DDBA9" emissive="#3DDBA9" emissiveIntensity={0.8} />
          </mesh>
        </group>
      </Float>
    </group>
  );
}

// 7. Floating Chalk-Dust Atmospheric Particles
function ChalkDustParticles() {
  const count = 100;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return pos;
  }, []);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#FFF8EC"
        transparent
        opacity={0.35}
        sizeAttenuation
      />
    </points>
  );
}

// 8. Dynamic Camera & Lighting Choreography (Night to Dawn)
function CinematicBridgeLighting({ progress }: { progress: number }) {
  // progress 0 (night): deep indigo #14123D, dim moonlight
  // progress 5 (dawn): bright warm saffron #FF8A3D + mint #3DDBA9 dawn sunlight
  const dawnFactor = Math.min(1, Math.max(0, progress / 4));

  useFrame((state, delta) => {
    // Dynamic camera choreography
    let targetX = 0;
    let targetY = 0.2;
    let targetZ = 4.2;

    if (progress <= 1) {
      // Scene 0: Hero wide view of both islands and gap
      targetX = 0;
      targetY = 0.2;
      targetZ = 4.2;
    } else if (progress <= 2) {
      // Scene 1: Challenge (tilts down towards classroom desks)
      targetX = 0;
      targetY = -0.3;
      targetZ = 4.5;
    } else if (progress <= 3) {
      // Scene 2: Solution 4 Stations
      targetX = 0;
      targetY = 0.3;
      targetZ = 3.9;
    } else if (progress <= 4) {
      // Scene 3: Impact rising analytics
      targetX = 0.5;
      targetY = 0.4;
      targetZ = 4.1;
    } else {
      // Scene 4: Final Dawn Bridge Complete
      targetX = 0;
      targetY = 0.1;
      targetZ = 4.3;
    }

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, delta * 3);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, delta * 3);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, delta * 3);
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      {/* Night Ambient Light */}
      <ambientLight intensity={0.4 + dawnFactor * 0.6} color={dawnFactor > 0.4 ? "#FFF0D6" : "#1e1b4b"} />

      {/* Main Rising Dawn Directional Light */}
      <directionalLight
        position={[4, 5, 3]}
        intensity={1.2 + dawnFactor * 1.5}
        color={dawnFactor > 0.5 ? "#FFD59E" : "#818cf8"}
      />

      {/* Rim light */}
      <directionalLight
        position={[-4, 2, -3]}
        intensity={0.6}
        color="#3DDBA9"
      />
    </>
  );
}

export function BridgeHero3D({ progress }: BridgeHero3DProps) {
  return (
    <>
      <CinematicBridgeLighting progress={progress} />
      <ChalkDustParticles />
      <GapIsland progress={progress} />
      <MasteryIsland progress={progress} />
      <BridgeAssembly progress={progress} />
      <ShikshaBotOrb progress={progress} />
      <ClassroomDesks progress={progress} />
      <FourStations progress={progress} />
    </>
  );
}

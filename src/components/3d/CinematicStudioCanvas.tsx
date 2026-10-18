"use client";

import React, { useState, useEffect, Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { HumanoidShikshaBot, type RobotSceneState } from "./HumanoidShikshaBot";
import { HolographicPanels } from "./HolographicPanels";
import { Sparkles as SparklesIcon } from "lucide-react";

interface CameraRigProps {
  progress: number;
}

function CameraRig({ progress }: CameraRigProps) {
  const p = progress;

  useFrame((state, delta) => {
    // Smooth camera choreography across the 6 narrative scenes
    let targetX = 0;
    let targetY = 0.45;
    let targetZ = 4.3;

    if (p <= 1) {
      // Scene 0 (Hero) to Scene 1 (Challenge): slow cinematic push-in
      const u = p;
      targetX = THREE.MathUtils.lerp(0, -0.1, u);
      targetY = THREE.MathUtils.lerp(0.45, 0.55, u);
      targetZ = THREE.MathUtils.lerp(4.3, 3.6, u);
    } else if (p <= 2) {
      // Scene 1 to Scene 2 (Diagnostics): orbits slightly to give focus to holographic panels
      const u = p - 1;
      targetX = THREE.MathUtils.lerp(-0.1, -0.4, u);
      targetY = THREE.MathUtils.lerp(0.55, 0.4, u);
      targetZ = THREE.MathUtils.lerp(3.6, 4.0, u);
    } else if (p <= 3) {
      // Scene 2 to Scene 3 (Path Forward)
      const u = p - 2;
      targetX = THREE.MathUtils.lerp(-0.4, -0.2, u);
      targetY = THREE.MathUtils.lerp(0.4, 0.45, u);
      targetZ = THREE.MathUtils.lerp(4.0, 3.85, u);
    } else if (p <= 4) {
      // Scene 3 to Scene 4 (Growth & Analytics): elevated camera angle
      const u = p - 3;
      targetX = THREE.MathUtils.lerp(-0.2, -0.15, u);
      targetY = THREE.MathUtils.lerp(0.45, 0.6, u);
      targetZ = THREE.MathUtils.lerp(3.85, 3.75, u);
    } else {
      // Scene 4 to Scene 5 (Final CTA): pulls back to wide cinematic view
      const u = Math.min(1, p - 4);
      targetX = THREE.MathUtils.lerp(-0.15, 0, u);
      targetY = THREE.MathUtils.lerp(0.6, 0.35, u);
      targetZ = THREE.MathUtils.lerp(3.75, 4.5, u);
    }

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, delta * 3.5);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, delta * 3.5);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, delta * 3.5);
    state.camera.lookAt(0, 0.3, 0);
  });

  return null;
}

// Delicate ambient floating particles in the light cone
function AtmosphericParticles() {
  const pointsRef = useRef<THREE.Points>(null);

  const particlesGeo = React.useMemo(() => {
    const count = 120;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = Math.random() * 5 - 1;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <points ref={pointsRef} geometry={particlesGeo}>
      <pointsMaterial
        size={0.025}
        color="#38bdf8"
        transparent
        opacity={0.35}
        sizeAttenuation
      />
    </points>
  );
}

interface CinematicStudioCanvasProps {
  progress: number; // 0 to 5 continuous progress
}

export function CinematicStudioCanvas({ progress }: CinematicStudioCanvasProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [hasWebGl, setHasWebGl] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) setHasWebGl(false);
    } catch {
      setHasWebGl(false);
    }
  }, []);

  const sceneIndex = Math.min(5, Math.floor(progress));
  const sceneState: RobotSceneState = {
    progress,
    sceneIndex,
  };

  if (!isMounted) {
    return (
      <div className="fixed inset-0 pointer-events-none bg-[#05070e] flex items-center justify-center -z-10">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold">
          <SparklesIcon className="w-4 h-4 animate-spin" />
          <span>Initializing Cinematic 3D Studio...</span>
        </div>
      </div>
    );
  }

  if (!hasWebGl) {
    return (
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-[#05070e] via-[#091024] to-[#05070e] -z-10" />
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 select-none overflow-hidden">
      {/* Studio Vignette Glow Behind Center-Right Robot (Image 2 Key Visual) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_42%,rgba(2,132,199,0.22)_0%,rgba(15,23,42,0.6)_45%,rgba(5,7,14,0.98)_80%)] pointer-events-none" />

      {/* Pool of Light at Feet */}
      <div className="absolute bottom-[8%] right-[22%] w-[450px] h-[140px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.18)_0%,transparent_70%)] blur-2xl pointer-events-none" />

      <Canvas
        camera={{ position: [0, 0.45, 4.3], fov: 42 }}
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <CameraRig progress={progress} />

          {/* ========================================================== */}
          {/* CINEMATIC STUDIO LIGHTING RIG (Target Image 2 Exact Match)  */}
          {/* ========================================================== */}
          {/* 1. Deep Ambient Fill */}
          <ambientLight intensity={0.5} color="#c7d2fe" />

          {/* 2. Soft Blue Spotlight BEHIND the Robot (The Blue Halo Glow) */}
          <spotLight
            position={[1.2, 2.5, -2.8]}
            target-position={[1.2, 0.5, 0]}
            intensity={6.0}
            color="#0284c7"
            angle={0.8}
            penumbra={0.9}
          />

          {/* 3. Overhead Key Spotlight illuminating Helmet & Chest */}
          <spotLight
            position={[1.2, 5.5, 3.2]}
            target-position={[1.2, 0, 0]}
            intensity={4.2}
            color="#ffffff"
            angle={0.6}
            penumbra={0.85}
            castShadow
          />

          {/* 4. Electric Cyan Rim Light on Silhouette */}
          <pointLight position={[1.2, 1.8, -1.8]} intensity={4.5} color="#00f0ff" distance={7} />

          {/* 5. Left Soft Fill Light */}
          <pointLight position={[-3.0, 1.0, 2.5]} intensity={1.4} color="#38bdf8" distance={8} />

          {/* 6. Atmospheric Fog */}
          <fog attach="fog" args={["#05070e", 3.2, 12]} />

          {/* ========================================================== */}
          {/* 3D SCENE OBJECTS                                           */}
          {/* ========================================================== */}
          <HumanoidShikshaBot sceneState={sceneState} scale={1.12} position={[1.2, -0.65, 0]} />

          <HolographicPanels sceneState={sceneState} />

          <AtmosphericParticles />
        </Suspense>
      </Canvas>
    </div>
  );
}

"use client";

import React, { useState, Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import { Eye, LayoutGrid, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

export interface StudentMasteryPoint {
  studentName: string;
  conceptName: string;
  score: number; // 0 to 100
}

interface ClassMasteryHeatmap3DProps {
  data: StudentMasteryPoint[];
  students: string[];
  concepts: string[];
}

function HeatmapBars({
  data,
  students,
  concepts,
  onHover,
}: {
  data: StudentMasteryPoint[];
  students: string[];
  concepts: string[];
  onHover: (point: StudentMasteryPoint | null) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
    }
  });

  const getBarColor = (score: number) => {
    if (score >= 80) return "#3DDBA9"; // Mint
    if (score >= 60) return "#FF8A3D"; // Saffron
    return "#FF5C6C"; // Coral
  };

  const xSpacing = 0.55;
  const zSpacing = 0.65;
  const xOffset = ((students.length - 1) * xSpacing) / 2;
  const zOffset = ((concepts.length - 1) * zSpacing) / 2;

  return (
    <group ref={groupRef} position={[0, -0.6, 0]}>
      {/* Ground Grid Plate */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[students.length * xSpacing + 0.6, 0.05, concepts.length * zSpacing + 0.6]} />
        <meshStandardMaterial color="#E2D7C3" roughness={0.7} />
      </mesh>

      {/* Render 3D Bars */}
      {data.map((item, idx) => {
        const sIndex = students.indexOf(item.studentName);
        const cIndex = concepts.indexOf(item.conceptName);
        if (sIndex === -1 || cIndex === -1) return null;

        const x = sIndex * xSpacing - xOffset;
        const z = cIndex * zSpacing - zOffset;
        const height = Math.max(0.1, (item.score / 100) * 1.5);
        const color = getBarColor(item.score);

        return (
          <group key={idx} position={[x, height / 2, z]}>
            <mesh
              onPointerOver={(e) => {
                e.stopPropagation();
                onHover(item);
              }}
              onPointerOut={() => onHover(null)}
            >
              <boxGeometry args={[0.38, height, 0.42]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={item.score < 60 ? 0.6 : 0.25}
                roughness={0.3}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export const ClassMasteryHeatmap3D = React.memo(function ClassMasteryHeatmap3D({
  data,
  students,
  concepts,
}: ClassMasteryHeatmap3DProps) {
  const [viewMode, setViewMode] = useState<"3d" | "2d">("3d");
  const [hoveredPoint, setHoveredPoint] = useState<StudentMasteryPoint | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(true);
  const [isTabVisible, setIsTabVisible] = useState(true);

  // Tab visibility tracking
  React.useEffect(() => {
    const handleVis = () => setIsTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", handleVis);
    return () => document.removeEventListener("visibilitychange", handleVis);
  }, []);

  // Viewport intersection observer to avoid rendering offscreen
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin: "100px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 2D Matrix Grid Fallback
  if (viewMode === "2d") {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#7A6862]">
            2D Matrix View ({students.length} students × {concepts.length} concepts)
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode("3d")}
            className="rounded-full text-xs h-7 gap-1"
          >
            <Eye className="w-3.5 h-3.5 text-[#B26A1B]" />
            <span>Switch to 3D View</span>
          </Button>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-[#49352F]/12 bg-white p-3 shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#49352F]/10 text-[#7A6862]">
                <th className="p-2 font-bold">Student</th>
                {concepts.map((c, i) => (
                  <th key={i} className="p-2 font-semibold truncate max-w-[120px]">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((student, sIdx) => (
                <tr key={sIdx} className="border-b border-[#49352F]/8 hover:bg-[#FAF6E9]/60">
                  <td className="p-2 font-bold text-[#49352F] whitespace-nowrap">{student}</td>
                  {concepts.map((concept, cIdx) => {
                    const match = data.find(
                      (d) => d.studentName === student && d.conceptName === concept
                    );
                    const score = match ? match.score : 70;
                    const isGap = score < 60;
                    const isMastered = score >= 80;

                    return (
                      <td key={cIdx} className="p-2">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md font-bold text-[11px] ${
                            isMastered
                              ? "bg-[#2E7D5E]/15 text-[#2E7D5E] border border-[#2E7D5E]/25"
                              : isGap
                              ? "bg-rose-100 text-rose-700 border border-rose-200 animate-pulse"
                              : "bg-[#B26A1B]/15 text-[#B26A1B] border border-[#B26A1B]/25"
                          }`}
                        >
                          {score}%
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[320px] rounded-2xl bg-[#FAF6E9] border border-[#49352F]/12 overflow-hidden select-none shadow-[0_8px_24px_rgba(73,53,47,0.06)]"
    >
      {/* View Switcher Top Bar */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
        {hoveredPoint && (
          <div className="px-3 py-1 rounded-xl bg-white/95 border border-[#49352F]/15 text-xs shadow-md backdrop-blur-md animate-in fade-in">
            <span className="font-bold text-[#49352F]">{hoveredPoint.studentName}</span>
            <span className="text-[#7A6862] mx-1.5">•</span>
            <span className="text-[#49352F]">{hoveredPoint.conceptName}: </span>
            <span
              className={`font-black ${
                hoveredPoint.score >= 80
                  ? "text-[#2E7D5E]"
                  : hoveredPoint.score >= 60
                  ? "text-[#B26A1B]"
                  : "text-rose-600"
              }`}
            >
              {hoveredPoint.score}%
            </span>
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => setViewMode("2d")}
          className="rounded-full text-xs h-7 gap-1 bg-white/90 border-[#49352F]/15 text-[#49352F] shadow-2xs"
        >
          <LayoutGrid className="w-3.5 h-3.5 text-[#B26A1B]" />
          <span>2D Matrix</span>
        </Button>
      </div>

      {/* 3D WebGL Canvas */}
      <Canvas
        camera={{ position: [2.5, 2.2, 3.2], fov: 42 }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          alpha: true,
        }}
        frameloop={isInView && isTabVisible ? "always" : "demand"}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 5, 3]} intensity={1.5} color="#FFD59E" />
        <directionalLight position={[-3, 2, -2]} intensity={0.5} color="#3DDBA9" />

        <Suspense fallback={null}>
          <HeatmapBars
            data={data}
            students={students}
            concepts={concepts}
            onHover={setHoveredPoint}
          />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>

      {/* Bottom Color Key */}
      <div className="absolute bottom-2 left-3 z-10 flex items-center gap-3 text-[10px] text-[#7A6862] bg-white/90 px-2.5 py-1 rounded-lg backdrop-blur-xs border border-[#49352F]/10 shadow-2xs">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-xs bg-[#2E7D5E]" />
          <span>&ge; 80% Mastered</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-xs bg-[#B26A1B]" />
          <span>60-79% Developing</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-xs bg-[#C54738]" />
          <span>&lt; 60% Needs Support</span>
        </div>
      </div>
    </div>
  );
});

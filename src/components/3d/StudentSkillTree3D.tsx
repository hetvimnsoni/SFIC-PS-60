"use client";

import React, { useState, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Eye, LayoutGrid, Sparkles, BrainCircuit, ArrowRight, X } from "lucide-react";

export interface SkillNode {
  id: string;
  name: string;
  subject: string;
  score: number; // 0 to 100
  status: "mastered" | "gap" | "developing" | "locked";
  reason?: string;
  baselineScore?: number;
  position: [number, number, number];
  connectedTo?: string[];
}

interface StudentSkillTree3DProps {
  studentName: string;
  skills: SkillNode[];
  onSelectSkill?: (skill: SkillNode) => void;
  onGeneratePlan?: (skill: SkillNode) => void;
}

function SkillTreeMesh({
  skills,
  selectedSkill,
  onSelect,
}: {
  skills: SkillNode[];
  selectedSkill: SkillNode | null;
  onSelect: (skill: SkillNode) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
    }
  });

  const getNodeColor = (status: SkillNode["status"]) => {
    switch (status) {
      case "mastered":
        return "#3DDBA9"; // Mint
      case "gap":
        return "#FF5C6C"; // Coral
      case "developing":
        return "#FF8A3D"; // Saffron
      case "locked":
        return "#475569"; // Slate grey
    }
  };

  const branchGeometries = React.useMemo(() => {
    const list: { id: string; geo: THREE.TubeGeometry; color: string; isGapPath: boolean }[] = [];
    skills.forEach((source) => {
      source.connectedTo?.forEach((targetId) => {
        const target = skills.find((s) => s.id === targetId);
        if (!target) return;
        const points = [
          new THREE.Vector3(...source.position),
          new THREE.Vector3(...target.position),
        ];
        const curve = new THREE.LineCurve3(points[0], points[1]);
        const tubeGeo = new THREE.TubeGeometry(curve, 12, 0.03, 8, false);
        const isGapPath = source.status === "gap" || target.status === "gap";
        const lineColor = isGapPath ? "#FF5C6C" : source.status === "mastered" ? "#3DDBA9" : "#6366F1";
        list.push({ id: `${source.id}-${targetId}`, geo: tubeGeo, color: lineColor, isGapPath });
      });
    });
    return list;
  }, [skills]);

  React.useEffect(() => {
    return () => {
      branchGeometries.forEach((b) => b.geo.dispose());
    };
  }, [branchGeometries]);

  return (
    <group ref={groupRef}>
      {/* Connecting Branch Cables */}
      {branchGeometries.map((branch) => (
        <mesh key={branch.id} geometry={branch.geo}>
          <meshStandardMaterial
            color={branch.color}
            emissive={branch.color}
            emissiveIntensity={branch.isGapPath ? 0.8 : 0.3}
            roughness={0.4}
          />
        </mesh>
      ))}

      {/* Skill Nodes */}
      {skills.map((skill) => {
        const isSelected = selectedSkill?.id === skill.id;
        const color = getNodeColor(skill.status);
        const isGap = skill.status === "gap";

        return (
          <group key={skill.id} position={skill.position}>
            {/* Main Skill Node Sphere */}
            <mesh
              onClick={(e) => {
                e.stopPropagation();
                onSelect(skill);
              }}
              scale={isSelected ? [1.35, 1.35, 1.35] : [1, 1, 1]}
            >
              <sphereGeometry args={[0.3, 24, 24]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={isGap ? 1.4 : isSelected ? 0.9 : 0.4}
                roughness={0.2}
                metalness={0.3}
              />
            </mesh>

            {/* Pulsing Outer Ring for Gaps */}
            {isGap && (
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.45, 0.02, 8, 24]} />
                <meshStandardMaterial
                  color="#FF5C6C"
                  emissive="#FF5C6C"
                  emissiveIntensity={1.8}
                />
              </mesh>
            )}

            {/* Glowing Orbit Ring for Mastered */}
            {skill.status === "mastered" && (
              <mesh rotation={[0.4, 0.4, 0]}>
                <torusGeometry args={[0.42, 0.015, 8, 24]} />
                <meshStandardMaterial
                  color="#3DDBA9"
                  emissive="#3DDBA9"
                  emissiveIntensity={1}
                />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}

export const StudentSkillTree3D = React.memo(function StudentSkillTree3D({
  studentName,
  skills,
  onSelectSkill,
  onGeneratePlan,
}: StudentSkillTree3DProps) {
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(
    skills.find((s) => s.status === "gap") || skills[0] || null
  );
  const [viewMode, setViewMode] = useState<"3d" | "2d">("3d");
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

  const handleSelect = (skill: SkillNode) => {
    setSelectedSkill(skill);
    if (onSelectSkill) onSelectSkill(skill);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-3xl bg-[#FAF6E9] border border-[#49352F]/12 overflow-hidden shadow-[0_8px_24px_rgba(73,53,47,0.06)] select-none"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#49352F]/10 bg-[#FAF6E9]">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-[#B26A1B]" />
          <h3 className="font-heading text-base font-bold text-[#49352F]">
            {studentName}&apos;s 3D Skill Progression Tree
          </h3>
          <Badge variant="mint" size="sm">
            Live Pedagogical Graph
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === "3d" ? "2d" : "3d")}
            className="rounded-full text-xs h-7 border-[#49352F]/15 bg-white text-[#49352F]"
          >
            {viewMode === "3d" ? <LayoutGrid className="w-3.5 h-3.5 mr-1 text-[#B26A1B]" /> : <Eye className="w-3.5 h-3.5 mr-1 text-[#B26A1B]" />}
            <span>{viewMode === "3d" ? "2D Hierarchy" : "3D Tree"}</span>
          </Button>
        </div>
      </div>

      {/* Main Container: Tree Canvas + Side Panel Drawer */}
      <div className="relative flex flex-col lg:flex-row h-[420px]">
        {/* 3D Canvas / 2D Grid */}
        <div className="flex-1 relative h-full">
          {viewMode === "3d" ? (
            <Canvas
              camera={{ position: [0, 0, 4.5], fov: 45 }}
              gl={{
                antialias: true,
                powerPreference: "high-performance",
                alpha: true,
              }}
              frameloop={isInView && isTabVisible ? "always" : "demand"}
              dpr={[1, 1.5]}
            >
              <ambientLight intensity={0.5} />
              <directionalLight position={[4, 5, 3]} intensity={1.5} color="#FFD59E" />
              <directionalLight position={[-4, 2, -2]} intensity={0.6} color="#3DDBA9" />

              <Suspense fallback={null}>
                <SkillTreeMesh
                  skills={skills}
                  selectedSkill={selectedSkill}
                  onSelect={handleSelect}
                />
              </Suspense>

              <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 1.8} minPolarAngle={Math.PI / 2.5} />
            </Canvas>
          ) : (
            <div className="p-5 overflow-y-auto h-full space-y-2.5">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  onClick={() => handleSelect(skill)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    selectedSkill?.id === skill.id
                      ? "bg-white border-[#B26A1B] shadow-sm"
                      : "bg-white/80 border-[#49352F]/10 hover:border-[#49352F]/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        skill.status === "mastered"
                          ? "bg-[#2E7D5E]"
                          : skill.status === "gap"
                          ? "bg-[#C54738] animate-pulse"
                          : skill.status === "developing"
                          ? "bg-[#B26A1B]"
                          : "bg-slate-400"
                      }`}
                    />
                    <div>
                      <h4 className="text-xs font-bold text-[#49352F]">{skill.name}</h4>
                      <span className="text-[10px] text-[#7A6862]">{skill.subject}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-black ${
                        skill.status === "mastered"
                          ? "text-[#2E7D5E]"
                          : skill.status === "gap"
                          ? "text-rose-600"
                          : "text-[#B26A1B]"
                      }`}
                    >
                      {skill.score}%
                    </span>
                    <Badge
                      variant={
                        skill.status === "mastered"
                          ? "mastered"
                          : skill.status === "gap"
                          ? "needsSupport"
                          : "developing"
                      }
                      size="sm"
                    >
                      {skill.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Legend Bottom Bar */}
          <div className="absolute bottom-3 left-4 z-10 flex items-center gap-3 text-[10px] text-[#7A6862] bg-white/90 px-3 py-1.5 rounded-full border border-[#49352F]/10 backdrop-blur-md shadow-2xs">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#2E7D5E]" /> Mastered
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#C54738] animate-pulse" /> Pulsing Gap
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#B26A1B]" /> Developing
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-slate-400" /> Locked
            </span>
          </div>
        </div>

        {/* Selected Skill Detail Side Panel */}
        {selectedSkill && (
          <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-[#49352F]/10 bg-white/95 p-5 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#B26A1B]">
                    {selectedSkill.subject}
                  </span>
                  <h4 className="font-heading text-lg font-bold text-[#49352F] leading-tight mt-0.5">
                    {selectedSkill.name}
                  </h4>
                </div>
                <Badge
                  variant={
                    selectedSkill.status === "mastered"
                      ? "mastered"
                      : selectedSkill.status === "gap"
                      ? "needsSupport"
                      : "developing"
                  }
                  size="sm"
                  dot
                >
                  {selectedSkill.status === "gap" ? "Learning Gap" : selectedSkill.status}
                </Badge>
              </div>

              {/* Score Display */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-[#FAF6E9] border border-[#49352F]/10">
                <div>
                  <span className="text-[10px] text-[#7A6862] block font-semibold">
                    Current Score
                  </span>
                  <span
                    className={`font-heading text-2xl font-black ${
                      selectedSkill.score >= 80
                        ? "text-[#2E7D5E]"
                        : selectedSkill.score >= 60
                        ? "text-[#B26A1B]"
                        : "text-rose-600"
                    }`}
                  >
                    {selectedSkill.score}%
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#7A6862] block font-semibold">
                    Target Threshold
                  </span>
                  <span className="font-heading text-2xl font-black text-[#49352F]">
                    60% / 80%
                  </span>
                </div>
              </div>

              {/* Explainable AI Reason */}
              {selectedSkill.reason && (
                <div className="space-y-1.5 p-3 rounded-2xl bg-rose-50/70 border border-rose-200/80 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1">
                    <BrainCircuit className="w-3.5 h-3.5" />
                    Rule-Engine Diagnosis
                  </span>
                  <p className="text-[#49352F] leading-relaxed text-[11px]">
                    {selectedSkill.reason}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-[#49352F]/10 space-y-2">
              {selectedSkill.status === "gap" && (
                <Button
                  variant="saffron"
                  size="sm"
                  onClick={() => onGeneratePlan && onGeneratePlan(selectedSkill)}
                  className="w-full rounded-xl text-xs font-black shadow-sm"
                >
                  <span>Generate 5-Step Remedial Plan</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

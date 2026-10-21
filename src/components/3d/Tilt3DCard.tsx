"use client";

import React, { useRef, useEffect } from "react";

interface Tilt3DCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export function Tilt3DCard({
  children,
  className = "",
  glowColor = "rgba(99, 102, 241, 0.25)",
}: Tilt3DCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<{ left: number; top: number; width: number; height: number } | null>(null);
  const rafId = useRef<number | null>(null);
  const isReducedMotion = useRef(false);

  useEffect(() => {
    isReducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (isReducedMotion.current) return;
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      rectRef.current = {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      };
      if (glareRef.current) {
        glareRef.current.style.opacity = "1";
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isReducedMotion.current || !rectRef.current || !cardRef.current) return;

    const { left, top, width, height } = rectRef.current;
    const x = e.clientX - left;
    const y = e.clientY - top;

    const centerX = width / 2;
    const centerY = height / 2;

    const rotX = ((y - centerY) / centerY) * -8;
    const rotY = ((x - centerX) / centerX) * 8;
    const glareX = Math.round((x / width) * 100);
    const glareY = Math.round((y / height) * 100);

    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      if (cardRef.current) {
        cardRef.current.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-4px) scale3d(1.015, 1.015, 1.015)`;
      }
      if (glareRef.current) {
        glareRef.current.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, ${glowColor} 0%, transparent 65%)`;
      }
    });
  };

  const handleMouseLeave = () => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    rectRef.current = null;
    if (cardRef.current) {
      cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)";
    }
    if (glareRef.current) {
      glareRef.current.style.opacity = "0";
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative transition-transform duration-200 ease-out preserve-3d will-change-transform ${className}`}
      style={{
        transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)",
      }}
    >
      {/* Dynamic 3D Glare Lighting Overlay — direct DOM opacity and gradient */}
      <div
        ref={glareRef}
        className="pointer-events-none absolute inset-0 z-10 rounded-3xl transition-opacity duration-300 opacity-0"
        aria-hidden="true"
      />
      {children}
    </div>
  );
}

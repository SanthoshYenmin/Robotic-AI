"use client";
import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Preload } from "@react-three/drei";
import AboutRobot from "./AboutRobot";

interface AboutCanvasProps {
  progressRef: React.MutableRefObject<{ value: number }>;
}

export default function AboutCanvas({ progressRef }: AboutCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 1, 8], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.2} />
      
      {/* 
        The Environment provides realistic PBR reflections for the final stage.
        The robot crossfade handles transitioning the materials to use it.
      */}
      <Environment preset="city" />

      <Suspense fallback={null}>
        <AboutRobot progressRef={progressRef} />
        <Preload all />
      </Suspense>
    </Canvas>
  );
}

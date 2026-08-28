"use client";

import { Environment } from "@react-three/drei";

export default function RobotLighting() {
  return (
    <>
      <ambientLight intensity={0.2} />
      
      {/* Key Light */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={2}
        color="#ffffff"
        castShadow
      />
      
      {/* Fill Light */}
      <directionalLight
        position={[-5, 5, -5]}
        intensity={0.5}
        color="#00f0ff"
      />
      
      {/* Rim Light */}
      <pointLight
        position={[0, -2, -5]}
        intensity={10}
        color="#00f0ff"
        distance={20}
      />
      
      {/* Environment for metallic reflections */}
      <Environment preset="studio" />
    </>
  );
}

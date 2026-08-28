"use client";

import Badge3D from "@/components/ui/Badge3D";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import RevealText from "@/components/animations/RevealText";

function WireframeObjects() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
      groupRef.current.rotation.x += delta * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Box */}
      <mesh position={[-2, 0, 0]}>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshBasicMaterial color="#00f0ff" wireframe opacity={0.3} transparent />
        <Html position={[0, 1.2, 0]} center>
          <div className="bg-black/80 border border-[#00f0ff]/30 px-2 py-1 text-[10px] text-[#00f0ff] font-mono tracking-widest uppercase rounded-sm">
            [OBJ: CRATE]
          </div>
        </Html>
      </mesh>

      {/* Sphere */}
      <mesh position={[2, 0, 0]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#ff3366" wireframe opacity={0.3} transparent />
        <Html position={[0, 1.2, 0]} center>
          <div className="bg-black/80 border border-[#ff3366]/30 px-2 py-1 text-[10px] text-[#ff3366] font-mono tracking-widest uppercase rounded-sm">
            [OBJ: SPHERE]
          </div>
        </Html>
      </mesh>

      {/* Grid Floor */}
      <gridHelper args={[20, 20, 0x333333, 0x111111]} position={[0, -2, 0]} />
    </group>
  );
}

export default function WorldModel() {
  return (
    <section className="h-screen bg-black relative border-t border-white/5 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        {/* Cinematic AI Image Background */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 animate-[pan_30s_linear_infinite]"
          style={{ backgroundImage: 'url(/images/world_model_1787817041791.jpg)' }}
        />
        <div className="absolute inset-0 bg-black/60"></div>

        <Canvas camera={{ position: [0, 2, 8] }} className="absolute inset-0">
          <ambientLight intensity={0.5} />
          <WireframeObjects />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <div className="mb-20 text-center">
          <Badge3D text="03 — WORLD MODEL" />
        </div>
        <RevealText delay={0.2}>
          <h3 className="text-5xl md:text-8xl font-[family-name:var(--font-display)] font-bold uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00f0ff] drop-shadow-[0_0_25px_rgba(0,240,255,0.5)]">
            Internal Physics.
          </h3>
        </RevealText>
      </div>
    </section>
  );
}

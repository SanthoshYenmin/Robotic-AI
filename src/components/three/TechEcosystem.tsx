"use client";

import { useRef, forwardRef, useImperativeHandle } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Torus } from "@react-three/drei";
import { Model as HumanoidRobotAI } from "@/components/three/HumanoidRobotAI";

export interface TechEcosystemRef {
  robotRef: React.RefObject<THREE.Group | null>;
  sceneGroupRef: React.RefObject<THREE.Group | null>;
}

const TechEcosystem = forwardRef<TechEcosystemRef, {}>((_, ref) => {
  const robotRef = useRef<THREE.Group>(null);
  const sceneGroupRef = useRef<THREE.Group>(null);
  const idleGroupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Group>(null);

  useImperativeHandle(ref, () => ({
    robotRef,
    sceneGroupRef
  }));

  useFrame((state, delta) => {
    // Parallax mouse effect
    if (sceneGroupRef.current) {
      sceneGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        sceneGroupRef.current.rotation.y,
        (state.pointer.x * Math.PI) / 15,
        0.05
      );
      sceneGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        sceneGroupRef.current.rotation.x,
        -(state.pointer.y * Math.PI) / 15,
        0.05
      );
    }

    // Idle floating and scanning rings
    if (idleGroupRef.current) {
      idleGroupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.15;
    }
    
    if (ringRef.current) {
      ringRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 1.5 - 0.5;
      ringRef.current.rotation.x = Math.PI / 2;
      ringRef.current.rotation.z += delta * 2;
    }
  });

  return (
    <group ref={sceneGroupRef}>
      
      {/* robotRef is controlled by GSAP for zooming */}
      <group ref={robotRef}>
        
        {/* idleGroupRef adds continuous floating without fighting GSAP */}
        <group ref={idleGroupRef}>
          <HumanoidRobotAI position={[0, -2.5, 0]} scale={1.5} />
          
          {/* Scanning Ring Effect */}
          <group ref={ringRef}>
            <Torus args={[1.8, 0.01, 16, 64]}>
              <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2} transparent opacity={0.6} />
            </Torus>
            <Torus args={[1.9, 0.005, 16, 64]}>
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} transparent opacity={0.3} />
            </Torus>
          </group>
        </group>

      </group>

      {/* Lighting for the premium look */}
      <ambientLight intensity={0.3} />
      <spotLight position={[5, 10, 5]} intensity={3} color="#00f0ff" penumbra={1} castShadow />
      <pointLight position={[-5, -5, 5]} intensity={1.5} color="#ffffff" />
      <pointLight position={[0, 0, -5]} intensity={2} color="#00f0ff" />
      <directionalLight position={[0, 5, 5]} intensity={1} color="#ffffff" />
    </group>
  );
});

TechEcosystem.displayName = "TechEcosystem";

export default TechEcosystem;
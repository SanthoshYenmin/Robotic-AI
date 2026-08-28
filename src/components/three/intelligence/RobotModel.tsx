"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Float } from "@react-three/drei";

export default function RobotModel() {
  const headRef = useRef<THREE.Mesh>(null);
  const eyeRef = useRef<THREE.Mesh>(null);
  
  // A subtle breathing animation
  useFrame(({ clock, pointer }) => {
    const t = clock.getElapsedTime();
    
    // Subtle head movement following pointer
    if (headRef.current) {
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, (pointer.x * Math.PI) / 10, 0.05);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -(pointer.y * Math.PI) / 10, 0.05);
    }

    // Glowing eye pulsing
    if (eyeRef.current) {
      (eyeRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 2 + Math.sin(t * 2) * 1;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        
        {/* === TORSO === */}
        <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.6, 0.8, 0.3]} />
          <meshStandardMaterial color="#111111" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* === HEAD === */}
        <group ref={headRef} position={[0, 1.7, 0]}>
          {/* Head Casing */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.4, 0.4, 0.4]} />
            <meshStandardMaterial color="#111111" metalness={0.8} roughness={0.2} />
          </mesh>
          
          {/* Visor/Eye (The glowing scanner) */}
          <mesh ref={eyeRef} position={[0, 0.05, 0.21]}>
            <boxGeometry args={[0.3, 0.1, 0.05]} />
            <meshStandardMaterial 
              color="#000000" 
              emissive="#00f0ff" 
              emissiveIntensity={2} 
              toneMapped={false} 
            />
          </mesh>
        </group>

        {/* === ARMS === */}
        {/* Left Arm */}
        <mesh position={[-0.45, 1.2, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.7]} />
          <meshStandardMaterial color="#222222" metalness={0.9} roughness={0.3} />
        </mesh>
        {/* Right Arm */}
        <mesh position={[0.45, 1.2, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.7]} />
          <meshStandardMaterial color="#222222" metalness={0.9} roughness={0.3} />
        </mesh>

        {/* === LEGS === */}
        {/* Left Leg */}
        <mesh position={[-0.15, 0.4, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.8]} />
          <meshStandardMaterial color="#222222" metalness={0.9} roughness={0.3} />
        </mesh>
        {/* Right Leg */}
        <mesh position={[0.15, 0.4, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.8]} />
          <meshStandardMaterial color="#222222" metalness={0.9} roughness={0.3} />
        </mesh>

      </Float>
    </group>
  );
}

"use client";
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Environment, ContactShadows } from "@react-three/drei";
import { Model as RealRobotModel } from "@/components/three/RobotModel";

type BuildLabProps = {
  progressRef: React.MutableRefObject<{ value: number }>;
};

// ─── Camera Controller ─────────────────────────────────────
function CameraController({ progressRef }: { progressRef: React.MutableRefObject<{ value: number }> }) {
  const { camera } = useThree();
  useFrame(() => {
    const p = progressRef.current.value; // 0 to 4
    let tx = 0, ty = 0.5, tz = 16;
    
    if (p <= 1) {
      // Stage 0 -> 1: Wide shot, slowly pushing in
      tx = Math.sin(p * 0.5) * 5;
      ty = 1.0 + p * 1.5;
      tz = 16 - p * 3;
    } else if (p <= 2.5) {
      // Stage 1 -> 2.5: Orbiting around while parts float
      const orbit = (p - 1) * 1.5;
      tx = Math.sin(0.5 + orbit) * 8;
      ty = 2.5 - (p - 1) * 0.5;
      tz = 13 - (p - 1) * 2;
    } else if (p <= 3.5) {
      // Stage 2.5 -> 3.5: Close in on assembly
      const dp = p - 2.5;
      tx = Math.sin(0.5 + 1.5 * 1.5) * 8 * (1 - dp) + 2 * dp;
      ty = 1.75 - dp * 0.75;
      tz = 10 - dp * 3;
    } else {
      // Stage 3.5 -> 4 (Final): Low dramatic angle
      const dp = Math.min(1, (p - 3.5) * 2);
      tx = 2 * (1 - dp) + 0;
      ty = 1.0 - dp * 1.8; // Look up from below
      tz = 7 - dp * 3.5;
    }

    camera.position.x += (tx - camera.position.x) * 0.03;
    camera.position.y += (ty - camera.position.y) * 0.03;
    camera.position.z += (tz - camera.position.z) * 0.03;
    camera.lookAt(0, 0.5, 0);
  });
  return null;
}

// ─── Background Grid & Scanner ─────────────────────────────
function BackgroundGrid() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.5, 0]}>
        <planeGeometry args={[60, 60, 40, 40]} />
        <meshBasicMaterial color="#00f0ff" wireframe transparent opacity={0.06} />
      </mesh>
      {/* Center glowing pad */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.49, 0]}>
        <circleGeometry args={[4, 32]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.05} />
      </mesh>
    </group>
  );
}

function ScannerRing({ progressRef }: { progressRef: React.MutableRefObject<{ value: number }> }) {
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    const p = progressRef.current.value;
    if (ringRef.current) {
       // Sweep up and down
       ringRef.current.position.y = -2 + Math.sin(s.clock.elapsedTime * 1.5) * 4;
       // Only visible during assembly
       const op = (p > 1.5 && p < 3.8) ? 0.6 : 0;
       const mat = ringRef.current.material as THREE.MeshBasicMaterial;
       mat.opacity += (op - mat.opacity) * 0.1;
       ringRef.current.rotation.z += 0.02;
    }
  });
  return (
    <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[2.5, 2.6, 64]} />
      <meshBasicMaterial color="#00ff88" side={THREE.DoubleSide} transparent opacity={0} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

// ─── Ambient Particles ─────────────────────────────────────
function Particles() {
  const count = 150;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 25;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 25;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const ref = useRef<THREE.Points>(null);
  useFrame((s) => { if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 0.01; });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color="#00f0ff" size={0.06} transparent opacity={0.4} blending={THREE.AdditiveBlending} />
    </points>
  );
}

// ─── Animated Real Robot ───────────────────────────────────
function AnimatedRobot({ progressRef }: { progressRef: React.MutableRefObject<{ value: number }> }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((s, d) => {
    const p = progressRef.current.value;
    
    if (groupRef.current) {
      // Gentle floating animation
      groupRef.current.position.y = -1.5 + Math.sin(s.clock.elapsedTime * 1.5) * 0.08;
      
      // Look around when reaching the final stage
      if (p > 3.5) {
         groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, Math.sin(s.clock.elapsedTime * 0.5) * 0.3, 0.05);
      } else {
         groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, 0.05);
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, -1.5, 0]}>
      <RealRobotModel rotation={[Math.PI / 2, 0, 0]} />
      <ContactShadows resolution={512} scale={10} blur={2} opacity={0.5} far={5} color="#000000" />
      {/* Intense glow at the core */}
      <pointLight color="#00f0ff" intensity={3} distance={4} position={[0, 1.5, 1]} />
    </group>
  );
}

// ─── Export ────────────────────────────────────────────────
export default function BuildLab({ progressRef }: BuildLabProps) {
  return (
    <>
      <ambientLight intensity={0.3} color="#051020" />
      <directionalLight position={[5, 10, 5]} intensity={0.8} color="#ffffff" castShadow />
      <pointLight position={[-8, 5, 2]} intensity={1.2} color="#00f0ff" />
      <pointLight position={[8, -5, -2]} intensity={0.8} color="#00ff88" />
      
      {/* Realism for PBR Materials */}
      <Environment preset="city" />

      <BackgroundGrid />
      <ScannerRing progressRef={progressRef} />
      <Particles />
      <CameraController progressRef={progressRef} />
      
      {/* Real Robot Model */}
      <AnimatedRobot progressRef={progressRef} />
    </>
  );
}

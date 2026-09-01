"use client";
import { useRef, useMemo, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Center, Resize, Html, Line } from "@react-three/drei";
import { Model as BehemothModel } from "@/components/three/BehemothModel";

type BuildLabProps = {
  progressRef: React.MutableRefObject<{ value: number }>;
};

// ─── Camera Controller ───
function CameraController({ progressRef }: { progressRef: React.MutableRefObject<{ value: number }> }) {
  const { camera } = useThree();
  useFrame(() => {
    const p = progressRef.current.value;
    let tx = 0, ty = 0.5, tz = 18;
    
    if (p <= 1) {
      // Scene 01: Inactive, wide shot
      tx = 4; ty = 0.5; tz = 18;
    } else if (p <= 2) {
      // Scene 02: Activation, slightly closer
      const dp = p - 1;
      tx = 4 - dp * 2; ty = 0.5 + dp * 0.5; tz = 18 - dp * 3;
    } else if (p <= 3) {
      // Scene 03: Floating objects, orbiting
      const dp = p - 2;
      tx = Math.sin(dp * Math.PI * 0.5) * 6 + 2; 
      ty = 1.0 + dp * 0.5; 
      tz = Math.cos(dp * Math.PI * 0.5) * 12;
    } else if (p <= 4) {
      // Scene 04: Robot alive, push into core
      const dp = Math.min(1, p - 3);
      tx = Math.sin(Math.PI * 0.5) * 6 * (1 - dp);
      ty = 1.5 - dp * 0.5;
      tz = 12 * (1 - dp) + 4 * dp; // Push very close
    }

    camera.position.x += (tx - camera.position.x) * 0.05;
    camera.position.y += (ty - camera.position.y) * 0.05;
    camera.position.z += (tz - camera.position.z) * 0.05;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

// ─── Floating Connection Nodes ───
const NODES = [
  { id: "PERCEPTION", pos: [-4, 2, 2] },
  { id: "INTELLIGENCE", pos: [4, 3, -1] },
  { id: "CONTROL", pos: [-3, -1, 3] },
  { id: "AUTONOMY", pos: [3, -1, 2] },
];

function FloatingNodes({ progressRef }: { progressRef: React.MutableRefObject<{ value: number }> }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    const p = progressRef.current.value;
    if (groupRef.current) {
      // Fade in during scene 2->3, fade out at 4
      const targetScale = (p >= 2 && p < 3.8) ? 1 : 0;
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.1));
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  return (
    <group ref={groupRef} scale={0}>
      {NODES.map((node, i) => (
        <group key={node.id}>
          {/* Connection Line */}
          <Line points={[node.pos as any, [0, 0, 0]]} color="#00f0ff" transparent opacity={0.3} lineWidth={1} />
          
          {/* Node */}
          <mesh position={node.pos as any}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color="#00f0ff" />
            <Html center position={[0, -0.4, 0]} className="pointer-events-none">
              <div className="font-mono text-[9px] tracking-widest text-[#00f0ff] uppercase whitespace-nowrap bg-black/50 px-2 py-1 backdrop-blur-sm border border-[#00f0ff]/20">
                {node.id}
              </div>
            </Html>
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ─── Robot & Lights ───
function CinematicRobot({ progressRef }: { progressRef: React.MutableRefObject<{ value: number }> }) {
  const groupRef = useRef<THREE.Group>(null);
  const coreLightRef = useRef<THREE.PointLight>(null);
  const scanLightRef = useRef<THREE.SpotLight>(null);
  const [isActive, setIsActive] = useState(false);
  
  useFrame(() => {
    const p = progressRef.current.value;
    
    // Core glow intensity
    if (coreLightRef.current) {
      const targetIntensity = p >= 1 ? 5 : 0.5; // Scene 1+ starts glowing
      coreLightRef.current.intensity = THREE.MathUtils.lerp(coreLightRef.current.intensity, targetIntensity, 0.05);
    }
    
    // Sweeping scan light traveling up the body (Scene 2)
    if (scanLightRef.current) {
      if (p >= 1 && p < 2) {
        // p from 1 to 2 -> sweep y from -3 to 3
        scanLightRef.current.position.y = (p - 1) * 6 - 3;
        scanLightRef.current.intensity = 10;
      } else {
        scanLightRef.current.intensity = 0;
      }
    }

    // Activate robot animation in Scene 3+
    if (p >= 2.5 && !isActive) setIsActive(true);
    else if (p < 2.5 && isActive) setIsActive(false);
  });

  return (
    <group ref={groupRef} position={[0, -1.5, 0]}>
      {/* Core Emissive Light */}
      <pointLight ref={coreLightRef} position={[0, 1.5, 0]} color="#00f0ff" intensity={0.5} distance={10} />
      
      {/* Scanning Light */}
      <spotLight ref={scanLightRef} position={[0, -3, 4]} angle={0.5} penumbra={1} color="#00ff88" intensity={0} target-position={[0, 0, 0]} />

      <Center bottom>
        <Resize scale={3}>
          <BehemothModel rotation={[0, Math.PI, 0]} isActive={isActive} />
        </Resize>
      </Center>
    </group>
  );
}

export default function BuildLab({ progressRef }: BuildLabProps) {
  return (
    <>
      <color attach="background" args={["#02050A"]} />
      
      {/* Very dim ambient lighting for dark lab vibe */}
      <ambientLight intensity={0.1} color="#ffffff" />
      <directionalLight position={[5, 10, 5]} intensity={0.2} color="#ffffff" />
      <directionalLight position={[-5, 5, -5]} intensity={0.1} color="#00f0ff" />

      <FloatingNodes progressRef={progressRef} />
      <CameraController progressRef={progressRef} />
      
      <CinematicRobot progressRef={progressRef} />
    </>
  );
}

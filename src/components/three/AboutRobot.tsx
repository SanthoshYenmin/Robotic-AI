"use client";
import React, { useRef, useMemo, useEffect, useState } from "react";
import * as THREE from "three";
import { useFrame, useGraph } from "@react-three/fiber";
import { useGLTF, Html } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";

interface AboutRobotProps {
  progressRef: React.MutableRefObject<{ value: number }>;
}

export default function AboutRobot({ progressRef }: AboutRobotProps) {
  // Load model
  const { scene } = useGLTF("/models/robot.glb");
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone) as any;

  // We need two instances: one for wireframe, one for solid
  // To do this properly, we will clone the materials and create two meshes per object.
  const solidMaterials = useMemo(() => {
    const mats: Record<string, THREE.MeshStandardMaterial> = {};
    Object.keys(materials).forEach((key) => {
      const m = materials[key].clone() as THREE.MeshStandardMaterial;
      m.transparent = true;
      m.opacity = 0; // Start invisible
      mats[key] = m;
    });
    return mats;
  }, [materials]);

  const wireMaterials = useMemo(() => {
    const mats: Record<string, THREE.MeshStandardMaterial> = {};
    Object.keys(materials).forEach((key) => {
      const m = materials[key].clone() as THREE.MeshStandardMaterial;
      m.wireframe = true;
      m.transparent = true;
      m.opacity = 1; // Start fully visible
      m.emissive = new THREE.Color("#00f0ff");
      m.emissiveIntensity = 0.2;
      m.color = new THREE.Color("#00f0ff");
      mats[key] = m;
    });
    return mats;
  }, [materials]);

  const groupRef = useRef<THREE.Group>(null);
  const headLightRef = useRef<THREE.PointLight>(null);
  const coreLightRef = useRef<THREE.PointLight>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // HUD Labels State (for mobile detection)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Particle System for "Think" data streams
  const particleCount = isMobile ? 50 : 200;
  const [positions] = useState(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const r = 2 + Math.random() * 3;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  });

  useFrame(({ clock }) => {
    const p = progressRef.current.value; // 0 to 5
    const time = clock.getElapsedTime();

    // Stage 1: Perceive (Head lights up) -> starts at p=1
    const headIntensity = THREE.MathUtils.clamp((p - 0.8) * 2, 0, 1);
    if (headLightRef.current) {
      headLightRef.current.intensity = headIntensity * 5;
    }

    // Stage 2: Think (Core streams activate) -> starts at p=2
    const coreIntensity = THREE.MathUtils.clamp((p - 1.8) * 2, 0, 1);
    if (coreLightRef.current) {
      coreLightRef.current.intensity = coreIntensity * 10;
    }
    
    // Animate particles converging on core
    if (particlesRef.current && coreIntensity > 0) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        // Move towards origin (core)
        positions[i * 3] *= 0.98;
        positions[i * 3 + 1] *= 0.98;
        positions[i * 3 + 2] *= 0.98;
        
        // Reset if too close
        if (Math.abs(positions[i*3]) < 0.1 && Math.abs(positions[i*3+1]) < 0.1) {
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos((Math.random() * 2) - 1);
          const r = 3;
          positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
          positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
          positions[i * 3 + 2] = r * Math.cos(phi);
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      
      // Rotate particle system
      particlesRef.current.rotation.y = time * 0.5;
      (particlesRef.current.material as THREE.PointsMaterial).opacity = coreIntensity * 0.8;
    } else if (particlesRef.current) {
      (particlesRef.current.material as THREE.PointsMaterial).opacity = 0;
    }

    // Stage 3: Move (Animate joints) -> starts at p=3
    const moveFactor = THREE.MathUtils.clamp((p - 2.8), 0, 1);
    const smoothMove = moveFactor * moveFactor * (3 - 2 * moveFactor);
    
    if (nodes._rootJoint) {
      nodes._rootJoint.rotation.x = Math.sin(time) * 0.05 * smoothMove;
      nodes._rootJoint.rotation.z = Math.cos(time * 0.8) * 0.05 * smoothMove;
      
      if (groupRef.current) {
        groupRef.current.position.y = (isMobile ? -1 : -2) + Math.sin(time * 2) * 0.1 * smoothMove;
      }
    }

    // Stage 4: Adapt (Wireframe to Solid crossfade) -> starts at p=4
    const solidAlpha = THREE.MathUtils.clamp((p - 3.8) * 1.5, 0, 1);
    const wireAlpha = 1 - solidAlpha;
    
    Object.values(solidMaterials).forEach(m => m.opacity = solidAlpha);
    Object.values(wireMaterials).forEach(m => {
      m.opacity = wireAlpha;
      m.emissiveIntensity = 0.2 + Math.sin(time * 4) * 0.1;
    });
  });

  const hudLabels = [
    { text: "ROS / ROS 2", pos: [2, 1, 1], delay: 0 },
    { text: "AI", pos: [-2.5, 2, 0], delay: 1 },
    { text: "COMPUTER VISION", pos: [1.5, 3, -1], delay: 2 },
    { text: "SIMULATION", pos: [-1.5, 0.5, 1.5], delay: 3 },
    { text: "CONTROL", pos: [2.5, -1, 0], delay: 4 },
    { text: "AUTONOMY", pos: [-2, -1.5, -1], delay: 5 },
  ];

  return (
    <group ref={groupRef} dispose={null} scale={isMobile ? 0.8 : 1.2} position={[isMobile ? 0 : 2, isMobile ? -1 : -2, 0]}>
      {/* ── Head/Perceive Light ── */}
      <pointLight ref={headLightRef} position={[0, 5, 1]} color="#00f0ff" distance={5} decay={2} intensity={0} />
      
      {/* ── Core/Think Light ── */}
      <pointLight ref={coreLightRef} position={[0, 2, 0]} color="#00f0ff" distance={8} decay={2} intensity={0} />

      {/* ── Data Streams (Particles) ── */}
      <points ref={particlesRef} position={[0, 2, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#00f0ff"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* ── Wireframe Mesh ── */}
      <group scale={0.01}>
        <group position={[0, 87.468, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={51.68}>
          <primitive object={nodes._rootJoint} />
          <skinnedMesh geometry={nodes.Object_7.geometry} material={wireMaterials['Material.001']} skeleton={nodes.Object_7.skeleton} />
          <skinnedMesh geometry={nodes.Object_9.geometry} material={wireMaterials['Material.004']} skeleton={nodes.Object_9.skeleton} />
          <skinnedMesh geometry={nodes.Object_11.geometry} material={wireMaterials['Material.003']} skeleton={nodes.Object_11.skeleton} />
          <skinnedMesh geometry={nodes.Object_13.geometry} material={wireMaterials['Material.002']} skeleton={nodes.Object_13.skeleton} />
        </group>
      </group>

      {/* ── Solid Mesh ── */}
      <group scale={0.01}>
        <group position={[0, 87.468, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={51.68}>
          {/* We reuse the skeleton so they animate identically */}
          <skinnedMesh geometry={nodes.Object_7.geometry} material={solidMaterials['Material.001']} skeleton={nodes.Object_7.skeleton} />
          <skinnedMesh geometry={nodes.Object_9.geometry} material={solidMaterials['Material.004']} skeleton={nodes.Object_9.skeleton} />
          <skinnedMesh geometry={nodes.Object_11.geometry} material={solidMaterials['Material.003']} skeleton={nodes.Object_11.skeleton} />
          <skinnedMesh geometry={nodes.Object_13.geometry} material={solidMaterials['Material.002']} skeleton={nodes.Object_13.skeleton} />
        </group>
      </group>

      {/* ── HUD Labels ── */}
      {hudLabels.map((lbl, idx) => (
        // Only show a subset on mobile to reduce clutter
        (!isMobile || idx % 2 === 0) && (
          <OrbitingLabel
            key={lbl.text}
            text={lbl.text}
            radius={new THREE.Vector3(lbl.pos[0], lbl.pos[1], lbl.pos[2])}
            delay={lbl.delay}
            progressRef={progressRef}
          />
        )
      ))}
    </group>
  );
}

function OrbitingLabel({ text, radius, delay, progressRef }: { text: string; radius: THREE.Vector3; delay: number; progressRef: React.MutableRefObject<{ value: number }> }) {
  const ref = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const time = clock.getElapsedTime() + delay;
    const p = progressRef.current.value;
    
    // Labels only visible from stage 2 (Think) onwards
    const alpha = THREE.MathUtils.clamp((p - 1.5) * 2, 0, 1);
    ref.current.visible = alpha > 0.05;
    
    if (alpha > 0) {
      // Orbit around the center
      const speed = 0.5;
      ref.current.position.x = Math.sin(time * speed) * radius.x + Math.cos(time * speed * 0.5) * 0.5;
      ref.current.position.y = radius.y + Math.sin(time * speed * 0.7) * 0.5;
      ref.current.position.z = Math.cos(time * speed) * radius.z;
      
      const el = document.getElementById(`hud-label-${text}`);
      if (el) {
        el.style.opacity = alpha.toString();
        el.style.transform = `scale(${0.8 + alpha * 0.2})`;
      }
    }
  });

  return (
    <group ref={ref}>
      <Html center zIndexRange={[100, 0]}>
        <div
          id={`hud-label-${text}`}
          className="pointer-events-none whitespace-nowrap px-3 py-1 bg-black/40 backdrop-blur-md border border-[#00f0ff]/30 text-[#00f0ff] font-mono text-[9px] md:text-[10px] tracking-widest rounded-sm transition-opacity"
          style={{ opacity: 0 }}
        >
          {text}
        </div>
      </Html>
    </group>
  );
}

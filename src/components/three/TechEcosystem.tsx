"use client";

import { useRef, forwardRef, useImperativeHandle } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, Cylinder, Box, Torus, Line } from "@react-three/drei";
import * as THREE from "three";

export interface TechEcosystemRef {
  coreRef: React.RefObject<THREE.Group | null>;
  programmingGroupRef: React.RefObject<THREE.Group | null>;
  roboticsGroupRef: React.RefObject<THREE.Group | null>;
  visionGroupRef: React.RefObject<THREE.Group | null>;
  hardwareGroupRef: React.RefObject<THREE.Group | null>;
  connectionLinesRef: React.RefObject<THREE.Group | null>;
  cameraGroupRef: React.RefObject<THREE.Group | null>;
}

const TechEcosystem = forwardRef<TechEcosystemRef, {}>((_, ref) => {
  const coreRef = useRef<THREE.Group>(null);
  const programmingGroupRef = useRef<THREE.Group>(null);
  const roboticsGroupRef = useRef<THREE.Group>(null);
  const visionGroupRef = useRef<THREE.Group>(null);
  const hardwareGroupRef = useRef<THREE.Group>(null);
  const connectionLinesRef = useRef<THREE.Group>(null);
  const cameraGroupRef = useRef<THREE.Group>(null);
  
  // Specific animatable parts
  const coreProcessorRef = useRef<THREE.Mesh>(null);
  const coreRingsRef = useRef<THREE.Group>(null);
  const coreComponentsRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Group>(null);
  const robotArmRef = useRef<THREE.Group>(null);
  const cameraScannerRef = useRef<THREE.Group>(null);
  const dataSignalRef = useRef<THREE.Mesh>(null); // Floating signal in programming

  // Connection Lines Refs for GSAP Scaling
  const lineTopRef = useRef<THREE.Mesh>(null);
  const lineRightRef = useRef<THREE.Mesh>(null);
  const lineLeftRef = useRef<THREE.Mesh>(null);
  const lineBottomRef = useRef<THREE.Mesh>(null);

  useImperativeHandle(ref, () => ({
    coreRef,
    programmingGroupRef,
    roboticsGroupRef,
    visionGroupRef,
    hardwareGroupRef,
    connectionLinesRef,
    cameraGroupRef
  }));

  // Create a reusable material for glowing elements
  const glowMaterial = new THREE.MeshStandardMaterial({ color: "#00f0ff", emissive: "#00f0ff", emissiveIntensity: 1.5 });

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // AI Core internal animations
    if (coreRingsRef.current) {
      coreRingsRef.current.children[0].rotation.x += delta * 0.5;
      coreRingsRef.current.children[0].rotation.y += delta * 0.3;
      
      coreRingsRef.current.children[1].rotation.y -= delta * 0.6;
      coreRingsRef.current.children[1].rotation.z += delta * 0.4;
    }

    if (coreComponentsRef.current) {
      coreComponentsRef.current.rotation.y += delta;
      coreComponentsRef.current.children.forEach((child, i) => {
        child.position.y = Math.sin(time * 3 + i) * 0.2;
      });
    }

    if (coreProcessorRef.current) {
      const material = coreProcessorRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 1 + Math.sin(time * 4) * 0.8;
    }

    // Programming Particles
    if (particlesRef.current) {
      particlesRef.current.children.forEach((child, i) => {
        child.position.y += Math.sin(time * 2 + i) * 0.005;
        child.rotation.x += delta;
      });
    }
    if (dataSignalRef.current) {
      dataSignalRef.current.position.y = Math.sin(time * 5) * 0.5;
    }

    // Camera scanning
    if (cameraScannerRef.current) {
      cameraScannerRef.current.rotation.z = Math.sin(time * 3) * 0.6;
    }

    // Parallax
    if (cameraGroupRef.current) {
      cameraGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        cameraGroupRef.current.rotation.y,
        (state.pointer.x * Math.PI) / 10,
        0.05
      );
      cameraGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        cameraGroupRef.current.rotation.x,
        -(state.pointer.y * Math.PI) / 10,
        0.05
      );
    }
  });

  return (
    <group ref={cameraGroupRef}>
      
      {/* CENTRAL AI CORE */}
      <group ref={coreRef}>
        {/* Transparent Outer Shell */}
        <Sphere args={[1, 32, 32]}>
          <meshPhysicalMaterial color="#ffffff" transmission={0.9} opacity={0.2} transparent roughness={0.1} metalness={0.5} ior={1.5} />
        </Sphere>
        <Sphere args={[1.05, 16, 16]}>
          <meshStandardMaterial color="#00f0ff" wireframe transparent opacity={0.1} />
        </Sphere>

        {/* Mechanical Rings */}
        <group ref={coreRingsRef}>
          <Torus args={[1.2, 0.02, 16, 64]}>
            <meshStandardMaterial color="#333" metalness={0.8} />
          </Torus>
          <Torus args={[1.4, 0.01, 16, 64]}>
            <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.5} />
          </Torus>
        </group>

        {/* Internal Glowing Processor */}
        <Box ref={coreProcessorRef} args={[0.4, 0.4, 0.4]}>
           <meshStandardMaterial color="#fff" emissive="#00f0ff" emissiveIntensity={2} />
        </Box>

        {/* Small Rotating Components */}
        <group ref={coreComponentsRef}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Box key={i} args={[0.05, 0.05, 0.05]} position={[Math.cos((i * Math.PI) / 4) * 0.6, 0, Math.sin((i * Math.PI) / 4) * 0.6]}>
              <meshStandardMaterial color="#fff" emissive="#ffffff" emissiveIntensity={1} />
            </Box>
          ))}
        </group>
      </group>

      {/* CONNECTION LINES (Animated via GSAP scale) */}
      <group ref={connectionLinesRef}>
        {/* Core to Programming (Top) */}
        <mesh ref={lineTopRef} position={[0, 2, 0]} scale={[1, 0, 1]}>
          <cylinderGeometry args={[0.02, 0.02, 2]} />
          <meshBasicMaterial color="#00f0ff" transparent opacity={0.6} />
        </mesh>
        
        {/* Core to Robotics (Right) */}
        <mesh ref={lineRightRef} position={[2, 0, 0]} rotation={[0, 0, -Math.PI / 2]} scale={[1, 0, 1]}>
          <cylinderGeometry args={[0.02, 0.02, 2]} />
          <meshBasicMaterial color="#00f0ff" transparent opacity={0.6} />
        </mesh>

        {/* Core to Vision (Left) */}
        <mesh ref={lineLeftRef} position={[-2, 0, 0]} rotation={[0, 0, Math.PI / 2]} scale={[1, 0, 1]}>
          <cylinderGeometry args={[0.02, 0.02, 2]} />
          <meshBasicMaterial color="#00f0ff" transparent opacity={0.6} />
        </mesh>

        {/* Core to Hardware (Bottom) */}
        <mesh ref={lineBottomRef} position={[0, -2, 0]} scale={[1, 0, 1]}>
          <cylinderGeometry args={[0.02, 0.02, 2]} />
          <meshBasicMaterial color="#00f0ff" transparent opacity={0.6} />
        </mesh>
      </group>

      {/* 1. PROGRAMMING (Top Node) */}
      <group ref={programmingGroupRef} position={[0, 3.5, 0]} scale={0}>
        <group ref={particlesRef}>
          {Array.from({ length: 30 }).map((_, i) => (
            <Box key={i} args={[0.08, 0.08, 0.08]} position={[(Math.random() - 0.5) * 2, (Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 2]}>
              <meshStandardMaterial color={i % 3 === 0 ? "#00f0ff" : "#333"} emissive={i % 3 === 0 ? "#00f0ff" : "#000"} emissiveIntensity={0.8} />
            </Box>
          ))}
        </group>
        <Box ref={dataSignalRef} args={[0.4, 0.6, 0.4]}>
          <meshStandardMaterial color="#fff" wireframe />
        </Box>
      </group>

      {/* 2. ROBOTICS (Right Node) */}
      <group ref={roboticsGroupRef} position={[3.5, 0, 0]} scale={0}>
        <group ref={robotArmRef}>
          {/* Base */}
          <Cylinder args={[0.5, 0.6, 0.2, 16]}>
            <meshStandardMaterial color="#111" metalness={0.9} />
          </Cylinder>
          {/* Base Joint */}
          <Sphere args={[0.3, 16, 16]} position={[0, 0.4, 0]}>
            <meshStandardMaterial color="#00f0ff" wireframe />
          </Sphere>
          {/* Lower Arm Segment */}
          <Cylinder args={[0.12, 0.12, 1.2]} position={[0, 1.0, 0]}>
             <meshStandardMaterial color="#333" metalness={0.8} />
          </Cylinder>
          {/* Elbow Joint */}
          <Sphere args={[0.25, 16, 16]} position={[0, 1.6, 0]}>
            <meshStandardMaterial color="#00f0ff" wireframe />
          </Sphere>
          {/* Upper Arm Segment */}
          <Cylinder args={[0.1, 0.1, 0.8]} position={[0, 2.0, 0]} rotation={[0, 0, Math.PI / 6]}>
             <meshStandardMaterial color="#333" metalness={0.8} />
          </Cylinder>
          {/* Claw / End Effector */}
          <group position={[0.2, 2.4, 0]}>
            <Box args={[0.2, 0.1, 0.4]}>
              <meshStandardMaterial color="#111" />
            </Box>
            <Box args={[0.05, 0.3, 0.1]} position={[0, 0.2, 0.15]} material={glowMaterial} />
            <Box args={[0.05, 0.3, 0.1]} position={[0, 0.2, -0.15]} material={glowMaterial} />
          </group>
        </group>
      </group>

      {/* 3. AI & VISION (Left Node) */}
      <group ref={visionGroupRef} position={[-3.5, 0, 0]} scale={0}>
        {/* Main Camera Body */}
        <Box args={[0.8, 0.8, 1]}>
          <meshStandardMaterial color="#111" metalness={0.7} />
        </Box>
        <Box args={[0.9, 0.1, 1.1]} position={[0, 0.45, 0]}>
           <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.5} wireframe />
        </Box>
        
        {/* Large Lens */}
        <group position={[0, 0, 0.5]}>
          <Cylinder args={[0.35, 0.35, 0.2, 32]} rotation={[Math.PI/2, 0, 0]}>
            <meshStandardMaterial color="#222" metalness={0.9} />
          </Cylinder>
          <Cylinder args={[0.3, 0.3, 0.25, 32]} rotation={[Math.PI/2, 0, 0]}>
            <meshStandardMaterial color="#0a0a0a" metalness={1} roughness={0} />
          </Cylinder>
          {/* Glowing Eye Core */}
          <Sphere args={[0.15, 16, 16]} position={[0, 0, 0.15]} scale={[1, 1, 0.2]}>
            <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2} />
          </Sphere>
        </group>
        
        {/* Volumetric Scanning Laser */}
        <group ref={cameraScannerRef} position={[0, -0.2, 0.7]}>
          <Cylinder args={[0.01, 2, 0.01, 32, 1, true, 0, Math.PI]} rotation={[Math.PI/2, 0, 0]} position={[0, 0, 1]}>
            <meshBasicMaterial color="#00f0ff" transparent opacity={0.15} side={THREE.DoubleSide} depthWrite={false} />
          </Cylinder>
        </group>
      </group>

      {/* 4. HARDWARE (Bottom Node) */}
      <group ref={hardwareGroupRef} position={[0, -3.5, 0]} scale={0}>
        {/* Main Motherboard (Jetson Style) */}
        <Box args={[1.8, 0.1, 1.4]}>
          <meshStandardMaterial color="#051510" />
        </Box>
        
        {/* Circuit Traces (Wireframe) */}
        <Box args={[1.85, 0.1, 1.45]}>
           <meshStandardMaterial color="#00f0ff" wireframe transparent opacity={0.3} />
        </Box>
        
        {/* CPU Heat Sink */}
        <Box args={[0.8, 0.3, 0.8]} position={[0, 0.15, 0]}>
          <meshStandardMaterial color="#222" metalness={0.9} roughness={0.4} />
        </Box>
        
        {/* GPU/AI Chip Glowing */}
        <Box args={[0.5, 0.05, 0.5]} position={[0, 0.32, 0]}>
          <meshStandardMaterial color="#fff" emissive="#00f0ff" emissiveIntensity={1} />
        </Box>

        {/* Small Capacitors & Sensors */}
        {[-0.7, 0.7].map(x => (
          [-0.5, 0, 0.5].map(z => (
            <Cylinder key={`${x}-${z}`} args={[0.08, 0.08, 0.25, 8]} position={[x, 0.15, z]}>
              <meshStandardMaterial color="#ccc" metalness={1} />
            </Cylinder>
          ))
        ))}
        {/* Ports */}
        <Box args={[1.6, 0.2, 0.2]} position={[0, 0.1, 0.6]}>
           <meshStandardMaterial color="#111" metalness={0.8} />
        </Box>
      </group>

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={2} color="#00f0ff" />
      <pointLight position={[-5, -5, 5]} intensity={1} color="#ffffff" />
    </group>
  );
});

TechEcosystem.displayName = "TechEcosystem";

export default TechEcosystem;
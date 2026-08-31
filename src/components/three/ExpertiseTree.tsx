"use client";

import { useRef, forwardRef, useImperativeHandle, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Line, Sphere, Box, Cylinder, Torus, Center, Environment, Resize } from "@react-three/drei";
import * as THREE from "three";
import { Model as RobotA04Model } from "@/components/three/RobotA04Model";
import { Model as RobotHeadModel } from "@/components/three/RobotHeadModel";
import { Model as EyeRobotModel } from "@/components/three/EyeRobotModel";
import { Model as RobotArmModel } from "@/components/three/RobotArmModel";

export interface ExpertiseTreeRef {
  groupRef: React.RefObject<THREE.Group | null>;
  coreRef: React.RefObject<THREE.Group | null>;
  line1Ref: React.RefObject<any>; // Line component ref type is tricky
  line2Ref: React.RefObject<any>;
  line3Ref: React.RefObject<any>;
  line4Ref: React.RefObject<any>;
  node1Ref: React.RefObject<THREE.Group | null>;
  node2Ref: React.RefObject<THREE.Group | null>;
  node3Ref: React.RefObject<THREE.Group | null>;
  node4Ref: React.RefObject<THREE.Group | null>;
}

interface ExpertiseTreeProps {
  hoveredNode: number | null;
  onReady?: () => void;
}

const ExpertiseTree = forwardRef<ExpertiseTreeRef, ExpertiseTreeProps>(({ hoveredNode, onReady }, ref) => {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Group>(null);
  
  // Lines (using a Group to scale them easily for animation)
  const line1GroupRef = useRef<THREE.Group>(null);
  const line2GroupRef = useRef<THREE.Group>(null);
  const line3GroupRef = useRef<THREE.Group>(null);
  const line4GroupRef = useRef<THREE.Group>(null);

  // Nodes
  const node1Ref = useRef<THREE.Group>(null);
  const node2Ref = useRef<THREE.Group>(null);
  const node3Ref = useRef<THREE.Group>(null);
  const node4Ref = useRef<THREE.Group>(null);

  // Inner parts for hover animations
  const node2ScannerRef = useRef<THREE.Mesh>(null);
  const node4ArmRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (onReady) onReady();
  }, [onReady]);

  useImperativeHandle(ref, () => ({
    groupRef,
    coreRef,
    line1Ref: line1GroupRef,
    line2Ref: line2GroupRef,
    line3Ref: line3GroupRef,
    line4Ref: line4GroupRef,
    node1Ref,
    node2Ref,
    node3Ref,
    node4Ref
  }));

  useFrame((state, delta) => {
    // Continuous passive rotations
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.2;
      coreRef.current.rotation.x += delta * 0.1;
    }
    
    // Passive rotation for all 4 nodes
    if (node1Ref.current) node1Ref.current.rotation.y -= delta * 0.5;
    if (node2Ref.current) node2Ref.current.rotation.y -= delta * 0.5;
    if (node3Ref.current) node3Ref.current.rotation.y -= delta * 0.5;
    if (node4Ref.current) node4Ref.current.rotation.y -= delta * 0.5;

    // Hover Animations (Spin faster)
    if (hoveredNode === 1 && node1Ref.current) node1Ref.current.rotation.y -= delta * 2;
    if (hoveredNode === 2 && node2Ref.current) node2Ref.current.rotation.y -= delta * 2;
    if (hoveredNode === 3 && node3Ref.current) node3Ref.current.rotation.y -= delta * 2;
    if (hoveredNode === 4 && node4Ref.current) node4Ref.current.rotation.y -= delta * 2;
  });

  const nodePositions = {
    n1: [-3, 2, 0] as [number, number, number],
    n2: [3, 2, 0] as [number, number, number],
    n3: [-3, -2, 0] as [number, number, number],
    n4: [3, -2, 0] as [number, number, number],
  };

  return (
    <group ref={groupRef}>
      {/* Central AI Core */}
      <group ref={coreRef}>
        <Sphere args={[0.5, 32, 32]}>
          <meshStandardMaterial color="#ffffff" emissive="#00f0ff" emissiveIntensity={1} wireframe={true} />
        </Sphere>
        <Sphere args={[0.3, 16, 16]}>
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2} />
        </Sphere>
      </group>

      {/* Connection Lines (Scaled from 0 initially via GSAP) */}
      <group ref={line1GroupRef}>
        <Line points={[[0, 0, 0], nodePositions.n1]} color="#00f0ff" lineWidth={2} transparent opacity={0.3} />
      </group>
      <group ref={line2GroupRef}>
        <Line points={[[0, 0, 0], nodePositions.n2]} color="#00f0ff" lineWidth={2} transparent opacity={0.3} />
      </group>
      <group ref={line3GroupRef}>
        <Line points={[[0, 0, 0], nodePositions.n3]} color="#00f0ff" lineWidth={2} transparent opacity={0.3} />
      </group>
      <group ref={line4GroupRef}>
        <Line points={[[0, 0, 0], nodePositions.n4]} color="#00f0ff" lineWidth={2} transparent opacity={0.3} />
      </group>

      {/* Node 1: AI & Robotics (Robot Head) */}
      <group ref={node1Ref} position={nodePositions.n1}>
        <Center>
          <Resize scale={1.2}>
            <RobotHeadModel rotation={[0, Math.PI / 4, 0]} />
          </Resize>
        </Center>
      </group>

      {/* Node 2: Computer Vision (Eye Robot) */}
      <group ref={node2Ref} position={nodePositions.n2}>
        <Center>
          <Resize scale={1.2}>
            <EyeRobotModel rotation={[0, -Math.PI / 4, 0]} />
          </Resize>
        </Center>
      </group>

      {/* Node 3: Autonomous Systems (Real Robot) */}
      <group ref={node3Ref} position={nodePositions.n3}>
        <Center>
          <Resize scale={1.2}>
            <RobotA04Model rotation={[0, Math.PI / 8, 0]} />
          </Resize>
        </Center>
      </group>

      {/* Node 4: Robotics Automation (Robot Arm) */}
      <group ref={node4Ref} position={nodePositions.n4}>
        <Center>
          <Resize scale={1.2}>
            <RobotArmModel rotation={[0, -Math.PI / 4, 0]} />
          </Resize>
        </Center>
      </group>

      {/* Lighting & Environment for Metallic Reflections */}
      <ambientLight intensity={0.6} />
      <pointLight position={[0, 0, 5]} intensity={2} color="#00f0ff" />
      <directionalLight position={[0, 5, 5]} intensity={1} color="#ffffff" />
      <Environment preset="city" />
    </group>
  );
});

ExpertiseTree.displayName = "ExpertiseTree";

export default ExpertiseTree;
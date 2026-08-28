"use client";

import { useRef, forwardRef, useImperativeHandle } from "react";
import { useFrame } from "@react-three/fiber";
import { Line, Sphere, Box, Cylinder, Torus } from "@react-three/drei";
import * as THREE from "three";

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
}

const ExpertiseTree = forwardRef<ExpertiseTreeRef, ExpertiseTreeProps>(({ hoveredNode }, ref) => {
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
  const node3WheelsRef = useRef<THREE.Group>(null);
  const node4ArmRef = useRef<THREE.Group>(null);

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
    if (node1Ref.current) {
      node1Ref.current.rotation.y -= delta * 0.5;
      node1Ref.current.rotation.x -= delta * 0.3;
    }

    // Hover Animations
    if (hoveredNode === 1 && node1Ref.current) {
      node1Ref.current.rotation.y -= delta * 2; // Spin faster
    }
    if (hoveredNode === 2 && node2ScannerRef.current) {
      node2ScannerRef.current.rotation.z += delta * 4; // Scanner spins
    }
    if (hoveredNode === 3 && node3WheelsRef.current) {
      // Rotate all wheels
      node3WheelsRef.current.children.forEach(wheel => {
        wheel.rotation.x += delta * 5;
      });
    }
    if (hoveredNode === 4 && node4ArmRef.current) {
      node4ArmRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 4) * 0.5; // Arm swings
    } else if (node4ArmRef.current) {
      // return to neutral slowly
      node4ArmRef.current.rotation.z = THREE.MathUtils.lerp(node4ArmRef.current.rotation.z, 0, 0.1);
    }
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

      {/* Node 1: AI & Robotics (Neural Proxy) */}
      <group ref={node1Ref} position={nodePositions.n1}>
        <Box args={[0.8, 0.8, 0.8]}>
          <meshStandardMaterial color="#00f0ff" wireframe={true} transparent opacity={0.8} />
        </Box>
        <Sphere args={[0.2, 16, 16]}>
           <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.5} />
        </Sphere>
      </group>

      {/* Node 2: Computer Vision (Camera Proxy) */}
      <group ref={node2Ref} position={nodePositions.n2}>
        <Cylinder args={[0.4, 0.4, 0.6, 32]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} />
        </Cylinder>
        <Torus args={[0.4, 0.05, 16, 32]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.3]}>
           <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={1} />
        </Torus>
        <group ref={node2ScannerRef} position={[0, 0, 0.35]}>
          <Cylinder args={[0.1, 0, 0.8, 4]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.4]}>
            <meshBasicMaterial color="#00f0ff" wireframe transparent opacity={0.5} />
          </Cylinder>
        </group>
      </group>

      {/* Node 3: Autonomous Systems (Rover Proxy) */}
      <group ref={node3Ref} position={nodePositions.n3}>
        <Box args={[1.2, 0.3, 0.8]}>
          <meshStandardMaterial color="#333" metalness={0.7} roughness={0.3} />
        </Box>
        <group ref={node3WheelsRef}>
          {/* 4 Wheels */}
          {[-0.4, 0.4].map((x) => (
            [-0.4, 0.4].map((z) => (
              <Cylinder key={`${x}-${z}`} args={[0.2, 0.2, 0.1, 16]} rotation={[Math.PI / 2, 0, Math.PI / 2]} position={[x, -0.2, z]}>
                <meshStandardMaterial color="#00f0ff" wireframe />
              </Cylinder>
            ))
          ))}
        </group>
      </group>

      {/* Node 4: Robotics Automation (Arm Proxy) */}
      <group ref={node4Ref} position={nodePositions.n4}>
        <Cylinder args={[0.3, 0.4, 0.2, 16]} position={[0, -0.4, 0]}>
           <meshStandardMaterial color="#222" metalness={0.9} />
        </Cylinder>
        <group ref={node4ArmRef} position={[0, -0.3, 0]}>
          <Box args={[0.1, 1, 0.1]} position={[0, 0.5, 0]}>
             <meshStandardMaterial color="#444" />
          </Box>
          <Sphere args={[0.15, 16, 16]} position={[0, 1, 0]}>
             <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" />
          </Sphere>
          <Box args={[0.1, 0.8, 0.1]} position={[0.3, 1.3, 0]} rotation={[0, 0, -Math.PI / 4]}>
             <meshStandardMaterial color="#444" />
          </Box>
        </group>
      </group>

      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 5]} intensity={1} color="#00f0ff" />
    </group>
  );
});

ExpertiseTree.displayName = "ExpertiseTree";

export default ExpertiseTree;
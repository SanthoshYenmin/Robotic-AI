"use client";

import { useRef, forwardRef, useImperativeHandle } from "react";
import { useFrame } from "@react-three/fiber";
import { Icosahedron, Torus, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { random } from "maath";

export interface RoboticCoreRef {
  groupRef: React.RefObject<THREE.Group | null>;
  innerCoreRef: React.RefObject<THREE.Mesh | null>;
  ringsRef: React.RefObject<THREE.Group | null>;
}

const RoboticCore = forwardRef<RoboticCoreRef>((props, ref) => {
  const groupRef = useRef<THREE.Group>(null);
  const innerCoreRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Expose refs for GSAP animation in the parent
  useImperativeHandle(ref, () => ({
    groupRef,
    innerCoreRef,
    ringsRef
  }));

  // Generate particles for the orbiting dust
  const sphere = new Float32Array(500 * 3);
  random.inSphere(sphere, { radius: 3 });

  useFrame((state, delta) => {
    // Continuous passive rotation
    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.x += delta * 0.2;
      innerCoreRef.current.rotation.y += delta * 0.3;
    }
    
    if (ringsRef.current) {
      ringsRef.current.rotation.x -= delta * 0.1;
      ringsRef.current.rotation.z += delta * 0.15;
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y -= delta * 0.05;
      particlesRef.current.rotation.z -= delta * 0.02;
    }

    // Parallax effect following mouse
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        (state.pointer.x * Math.PI) / 6,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -(state.pointer.y * Math.PI) / 6,
        0.05
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Core */}
      <Icosahedron ref={innerCoreRef} args={[1, 1]} scale={0.5}>
        <meshStandardMaterial 
          color="#00f0ff" 
          emissive="#00f0ff" 
          emissiveIntensity={0.8} 
          wireframe={true} 
          transparent 
          opacity={0.8}
        />
      </Icosahedron>

      <Icosahedron args={[1, 2]} scale={0.45}>
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#ffffff" 
          emissiveIntensity={2} 
        />
      </Icosahedron>

      {/* Mechanical Rings */}
      <group ref={ringsRef}>
        <Torus args={[1.5, 0.02, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
        </Torus>
        <Torus args={[1.8, 0.01, 16, 100]} rotation={[0, Math.PI / 3, 0]}>
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.5} />
        </Torus>
        <Torus args={[2.1, 0.03, 16, 100]} rotation={[Math.PI / 4, 0, Math.PI / 4]}>
          <meshStandardMaterial color="#1a1a1a" metalness={1} roughness={0.1} />
        </Torus>
      </group>

      {/* Orbiting Particles */}
      <Points ref={particlesRef} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial 
          transparent 
          color="#00f0ff" 
          size={0.02} 
          sizeAttenuation={true} 
          depthWrite={false} 
          opacity={0.6}
        />
      </Points>

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00f0ff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ffffff" />
    </group>
  );
});

RoboticCore.displayName = "RoboticCore";

export default RoboticCore;
"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import RobotHotspots from "./RobotHotspots";

export default function NovaRobot() {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const torsoRef = useRef<THREE.Group>(null);

  // Premium Materials
  const armorMaterial = new THREE.MeshStandardMaterial({
    color: "#1a1a1a",
    roughness: 0.15,
    metalness: 0.9,
  });

  const jointMaterial = new THREE.MeshStandardMaterial({
    color: "#050505",
    roughness: 0.6,
    metalness: 0.9,
  });

  const emissiveMaterial = new THREE.MeshStandardMaterial({
    color: "#00f0ff",
    emissive: "#00f0ff",
    emissiveIntensity: 2,
    toneMapped: false,
  });

  const time = useRef(0);

  useFrame((state, delta) => {
    time.current += delta;
    
    // Mouse tracking for subtle parallax and head movement
    const pointerX = state.pointer.x;
    const pointerY = state.pointer.y;

    if (headRef.current) {
      // Head follows cursor
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, pointerX * 0.5, 0.1);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -pointerY * 0.5, 0.1);
    }

    if (torsoRef.current) {
      // Torso subtle parallax
      torsoRef.current.rotation.y = THREE.MathUtils.lerp(torsoRef.current.rotation.y, pointerX * 0.1, 0.05);
      torsoRef.current.rotation.x = THREE.MathUtils.lerp(torsoRef.current.rotation.x, -pointerY * 0.05, 0.05);
    }
    
    if (groupRef.current) {
      // Entire robot subtle floating
      groupRef.current.position.y = Math.sin(time.current) * 0.02;
    }
  });

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      <group ref={torsoRef}>
        {/* Torso Base */}
        <mesh position={[0, 1.2, 0]} material={armorMaterial}>
          <boxGeometry args={[0.7, 0.8, 0.4]} />
        </mesh>
        
        {/* Chest Core Indicator */}
        <mesh position={[0, 1.25, 0.21]} material={emissiveMaterial}>
          <cylinderGeometry args={[0.05, 0.05, 0.02, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        {/* Neck Joint */}
        <mesh position={[0, 1.65, 0]} material={jointMaterial}>
          <cylinderGeometry args={[0.1, 0.1, 0.2]} />
        </mesh>

        {/* Head */}
        <mesh ref={headRef} position={[0, 1.9, 0]} material={armorMaterial}>
          <boxGeometry args={[0.4, 0.5, 0.45]} />
          {/* Visor */}
          <mesh position={[0, 0.05, 0.23]} material={new THREE.MeshStandardMaterial({ color: "#000000", roughness: 0.1, metalness: 1 })}>
            <boxGeometry args={[0.3, 0.15, 0.05]} />
          </mesh>
          {/* Eye strip */}
          <mesh position={[0, 0.05, 0.26]} material={emissiveMaterial}>
            <planeGeometry args={[0.2, 0.02]} />
          </mesh>
        </mesh>

        {/* Shoulders */}
        <mesh position={[-0.45, 1.4, 0]} material={jointMaterial}>
          <sphereGeometry args={[0.15, 32, 32]} />
        </mesh>
        <mesh position={[0.45, 1.4, 0]} material={jointMaterial}>
          <sphereGeometry args={[0.15, 32, 32]} />
        </mesh>

        {/* Upper Arms */}
        <mesh position={[-0.55, 1.0, 0]} material={armorMaterial}>
          <cylinderGeometry args={[0.1, 0.08, 0.6]} />
        </mesh>
        <mesh position={[0.55, 1.0, 0]} material={armorMaterial}>
          <cylinderGeometry args={[0.1, 0.08, 0.6]} />
        </mesh>
      </group>

      {/* Pelvis */}
      <mesh position={[0, 0.7, 0]} material={armorMaterial}>
        <boxGeometry args={[0.5, 0.3, 0.35]} />
      </mesh>

      {/* Hip Joints */}
      <mesh position={[-0.2, 0.5, 0]} material={jointMaterial}>
        <sphereGeometry args={[0.12, 32, 32]} />
      </mesh>
      <mesh position={[0.2, 0.5, 0]} material={jointMaterial}>
        <sphereGeometry args={[0.12, 32, 32]} />
      </mesh>

      {/* Thighs */}
      <mesh position={[-0.2, 0.1, 0]} material={armorMaterial}>
        <cylinderGeometry args={[0.1, 0.09, 0.6]} />
      </mesh>
      <mesh position={[0.2, 0.1, 0]} material={armorMaterial}>
        <cylinderGeometry args={[0.1, 0.09, 0.6]} />
      </mesh>

      {/* Knees */}
      <mesh position={[-0.2, -0.25, 0]} material={jointMaterial}>
        <sphereGeometry args={[0.1, 32, 32]} />
      </mesh>
      <mesh position={[0.2, -0.25, 0]} material={jointMaterial}>
        <sphereGeometry args={[0.1, 32, 32]} />
      </mesh>

      {/* Calves */}
      <mesh position={[-0.2, -0.65, 0]} material={armorMaterial}>
        <cylinderGeometry args={[0.08, 0.06, 0.7]} />
      </mesh>
      <mesh position={[0.2, -0.65, 0]} material={armorMaterial}>
        <cylinderGeometry args={[0.08, 0.06, 0.7]} />
      </mesh>

      {/* Hotspots */}
      <RobotHotspots />
    </group>
  );
}

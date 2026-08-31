"use client";

import { useRef, forwardRef, useImperativeHandle, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Grid, Box, Cylinder, Line, Sphere, Center, Environment } from "@react-three/drei"; // Force HMR
import * as THREE from "three";
import { Model as RobotA04Model } from "@/components/three/RobotA04Model";

export interface AutonomousRoverRef {
  roverRef: React.RefObject<THREE.Group | null>;
  lidarBeamRef: React.RefObject<THREE.Mesh | null>;
  originalPathRef: React.RefObject<THREE.Group | null>;
  newPathRef: React.RefObject<THREE.Group | null>;
  obstacleRef: React.RefObject<THREE.Group | null>;
  cameraGroupRef: React.RefObject<THREE.Group | null>;
}

interface AutonomousRoverProps {
  onReady?: () => void;
}

const AutonomousRover = forwardRef<AutonomousRoverRef, AutonomousRoverProps>(({ onReady }, ref) => {
  const roverRef = useRef<THREE.Group>(null);
  const lidarBeamRef = useRef<THREE.Mesh>(null);
  const scannerHeadRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (onReady) onReady();
  }, [onReady]);


  const originalPathRef = useRef<THREE.Group>(null);
  const newPathRef = useRef<THREE.Group>(null);
  const obstacleRef = useRef<THREE.Group>(null);
  const cameraGroupRef = useRef<THREE.Group>(null);

  useImperativeHandle(ref, () => ({
    roverRef,
    lidarBeamRef,
    originalPathRef,
    newPathRef,
    obstacleRef,
    cameraGroupRef
  }));

  useFrame((state, delta) => {
    // Spin LiDAR head constantly
    if (scannerHeadRef.current) {
      scannerHeadRef.current.rotation.y += delta * 5;
    }

    // Parallax effect for the whole scene container (camera group)
    if (cameraGroupRef.current) {
      cameraGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        cameraGroupRef.current.rotation.y,
        (state.pointer.x * Math.PI) / 12,
        0.05
      );
      cameraGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        cameraGroupRef.current.rotation.x,
        -(state.pointer.y * Math.PI) / 12,
        0.05
      );
    }
  });

  const pathPoints1 = [
    new THREE.Vector3(0, 0.05, 5),
    new THREE.Vector3(0, 0.05, -5)
  ];

  const pathPoints2 = [
    new THREE.Vector3(0, 0.05, 1),
    new THREE.Vector3(2, 0.05, 0),
    new THREE.Vector3(2, 0.05, -3),
    new THREE.Vector3(0, 0.05, -5)
  ];

  return (
    <group ref={cameraGroupRef}>

      {/* Environment Grid */}
      <Grid
        args={[20, 20]}
        cellSize={1}
        cellThickness={1}
        cellColor="#00f0ff"
        sectionSize={5}
        sectionThickness={1.5}
        sectionColor="#00f0ff"
        fadeDistance={15}
        fadeStrength={1}
        position={[0, 0, 0]}
      />

      {/* Original Path (Straight) */}
      <group ref={originalPathRef}>
        <Line points={pathPoints1} color="#00f0ff" lineWidth={3} dashed dashScale={10} dashSize={1} dashOffset={0} />
      </group>

      {/* New Path (Avoidance) */}
      <group ref={newPathRef} visible={false}>
        <Line points={pathPoints2} color="#00f0ff" lineWidth={3} dashed dashScale={10} dashSize={1} dashOffset={0} />
      </group>

      {/* Obstacle */}
      <group ref={obstacleRef} position={[0, 0.5, 0]} scale={0}>
        <Box args={[1, 1, 1]}>
          <meshStandardMaterial color="#ff0044" wireframe={true} />
        </Box>
        <Box args={[0.9, 0.9, 0.9]}>
          <meshStandardMaterial color="#ff0044" transparent opacity={0.2} />
        </Box>
      </group>

      {/* The Rover */}
      <group ref={roverRef} position={[0, 0, 5]}>

        {/* Real 3D Robot Model */}
        <group position={[0, 0, 0]}>
          <Center top>
            {/* We rotate Math.PI so it faces the correct moving direction (-z) */}
            <RobotA04Model rotation={[0, Math.PI, 0]} scale={0.7} />
          </Center>
        </group>

        {/* Keep the LiDAR Scanner Beam for the animation effect */}
        <group position={[0, 2.0, 0]}>
          <Cylinder ref={scannerHeadRef} args={[0.01, 0.01, 0.01, 8]} position={[0, 0, 0]}>
            <meshBasicMaterial transparent opacity={0} />
          </Cylinder>

          {/* Sweeping Beam */}
          <Cylinder ref={lidarBeamRef} args={[0.01, 4, 0.1, 32, 1, true, 0, Math.PI / 3]} position={[0, 0, 0]} rotation={[0, (Math.PI * 5) / 6, 0]} scale={0}>
            <meshBasicMaterial color="#00f0ff" transparent opacity={0.15} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
          </Cylinder>
        </group>

      </group>

      {/* Lighting & Reflections */}
      <ambientLight intensity={0.8} />
      <pointLight position={[5, 10, 5]} intensity={2} color="#00f0ff" />
      <pointLight position={[-5, 5, -5]} intensity={1.5} color="#00ff88" />
      <directionalLight position={[0, 10, 10]} intensity={1.5} color="#ffffff" />
      <Environment preset="city" />
    </group>
  );
});

AutonomousRover.displayName = "AutonomousRover";

export default AutonomousRover;
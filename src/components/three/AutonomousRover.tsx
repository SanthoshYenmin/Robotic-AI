"use client";

import { useRef, forwardRef, useImperativeHandle } from "react";
import { useFrame } from "@react-three/fiber";
import { Grid, Box, Cylinder, Line, Sphere } from "@react-three/drei";
import * as THREE from "three";

export interface AutonomousRoverRef {
  roverRef: React.RefObject<THREE.Group | null>;
  lidarBeamRef: React.RefObject<THREE.Mesh | null>;
  originalPathRef: React.RefObject<THREE.Group | null>;
  newPathRef: React.RefObject<THREE.Group | null>;
  obstacleRef: React.RefObject<THREE.Group | null>;
  cameraGroupRef: React.RefObject<THREE.Group | null>;
}

const AutonomousRover = forwardRef<AutonomousRoverRef, {}>((_, ref) => {
  const roverRef = useRef<THREE.Group>(null);
  const lidarBeamRef = useRef<THREE.Mesh>(null);
  const scannerHeadRef = useRef<THREE.Mesh>(null);
  const wheelsRef = useRef<THREE.Group>(null);
  
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
    
    // Spin wheels if the rover is moving (we can check its velocity or just animate it constantly for effect)
    // Actually, we'll let GSAP move the rover. We can just spin wheels slightly based on time, or leave them static since it's stylized.
    if (wheelsRef.current) {
      wheelsRef.current.children.forEach((wheel) => {
        wheel.rotation.x -= delta * 2;
      });
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
        {/* Chassis */}
        <Box args={[1.2, 0.4, 1.8]} position={[0, 0.4, 0]}>
          <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} />
        </Box>
        <Box args={[1.3, 0.1, 1.9]} position={[0, 0.6, 0]}>
          <meshStandardMaterial color="#00f0ff" wireframe />
        </Box>

        {/* Wheels */}
        <group ref={wheelsRef}>
          {[-0.7, 0.7].map((x) => (
            [-0.6, 0.6].map((z) => (
              <Cylinder key={`${x}-${z}`} args={[0.3, 0.3, 0.2, 16]} rotation={[0, 0, Math.PI / 2]} position={[x, 0.3, z]}>
                <meshStandardMaterial color="#111" />
              </Cylinder>
            ))
          ))}
        </group>

        {/* LiDAR Sensor */}
        <group position={[0, 0.8, 0.4]}>
          <Cylinder args={[0.15, 0.15, 0.2, 16]}>
            <meshStandardMaterial color="#444" />
          </Cylinder>
          <Cylinder ref={scannerHeadRef} args={[0.1, 0.1, 0.15, 16]} position={[0, 0.15, 0]}>
            <meshStandardMaterial color="#111" />
            <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2} attach="material-1" />
          </Cylinder>
          
          {/* Sweeping Beam */}
          <Cylinder ref={lidarBeamRef} args={[0.01, 3, 0.1, 32, 1, true, 0, Math.PI / 4]} position={[0, 0.15, 0]} rotation={[0, 0, 0]} scale={0}>
             <meshBasicMaterial color="#00f0ff" transparent opacity={0.1} side={THREE.DoubleSide} depthWrite={false} />
          </Cylinder>
        </group>

        {/* Front Sensors/Lights */}
        <Sphere args={[0.05, 8, 8]} position={[0.4, 0.5, -0.9]}>
          <meshBasicMaterial color="#00f0ff" />
        </Sphere>
        <Sphere args={[0.05, 8, 8]} position={[-0.4, 0.5, -0.9]}>
          <meshBasicMaterial color="#00f0ff" />
        </Sphere>
      </group>

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 10, 5]} intensity={1} color="#00f0ff" />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color="#ffffff" />
    </group>
  );
});

AutonomousRover.displayName = "AutonomousRover";

export default AutonomousRover;
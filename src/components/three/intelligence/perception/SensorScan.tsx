import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export default function SensorScan() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // This plane represents the scanning laser moving through the warehouse
  return (
    <mesh ref={meshRef} position={[0, 1, 0]} rotation={[0, 0, 0]}>
      <planeGeometry args={[20, 10]} />
      <meshBasicMaterial 
        color="#00f0ff" 
        transparent 
        opacity={0.3} 
        side={THREE.DoubleSide} 
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

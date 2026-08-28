import { useRef } from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";

export default function DepthVisualization() {
  const groupRef = useRef<THREE.Group>(null);
  
  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Subtle depth grid on the floor */}
      <gridHelper args={[30, 30, "#00f0ff", "#0040ff"]} position={[0, 0.01, 0]} />
      
      {/* Depth Labels for objects */}
      <Html position={[-4.5, 2.5, -4.5]} center>
        <div className="bg-blue-900/50 backdrop-blur-sm border border-[#00f0ff]/30 px-2 py-1 rounded text-[#00f0ff] font-mono text-[8px] uppercase tracking-widest pointer-events-none">
          DIST: 4.82 M
        </div>
      </Html>
      
      <Html position={[4, 2.5, -2]} center>
        <div className="bg-blue-900/50 backdrop-blur-sm border border-[#00f0ff]/30 px-2 py-1 rounded text-[#00f0ff] font-mono text-[8px] uppercase tracking-widest pointer-events-none">
          DIST: 6.12 M
        </div>
      </Html>
    </group>
  );
}

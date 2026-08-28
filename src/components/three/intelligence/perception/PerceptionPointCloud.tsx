import { useRef, useMemo } from "react";
import * as THREE from "three";

export default function PerceptionPointCloud() {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Procedurally generate a point cloud that mimics the warehouse layout
  const particles = useMemo(() => {
    const count = 5000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color = new THREE.Color("#00f0ff");
    
    for (let i = 0; i < count; i++) {
      // Randomly distribute points to look like scanned surfaces (floor, walls, objects)
      const x = (Math.random() - 0.5) * 40;
      const z = (Math.random() - 0.5) * 40;
      const y = Math.random() > 0.8 ? Math.random() * 10 : 0; // mostly on floor, some on objects/walls
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    return { positions, colors };
  }, []);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={particles.positions.length / 3} 
          array={particles.positions} 
          itemSize={3} 
        />
        <bufferAttribute 
          attach="attributes-color" 
          count={particles.colors.length / 3} 
          array={particles.colors} 
          itemSize={3} 
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.05} 
        vertexColors 
        transparent 
        opacity={0.8} 
        blending={THREE.AdditiveBlending} 
        depthWrite={false}
      />
    </points>
  );
}

import { Html } from "@react-three/drei";

interface ObjectDetectionProps {
  position: [number, number, number];
  label: string;
  confidence: number;
}

export default function ObjectDetection({ position, label, confidence }: ObjectDetectionProps) {
  return (
    <group position={position}>
      {/* Bounding Box placeholder */}
      <mesh>
        <boxGeometry args={[1.1, 1.1, 1.1]} />
        <meshBasicMaterial color="#00f0ff" wireframe transparent opacity={0.3} />
      </mesh>
      
      {/* HTML Label */}
      <Html position={[0, 1, 0]} center>
        <div className="flex flex-col items-center pointer-events-none">
          <div className="w-[1px] h-8 bg-gradient-to-t from-[#00f0ff] to-transparent"></div>
          <div className="bg-black/80 backdrop-blur-md border border-[#00f0ff]/50 px-2 py-1 rounded text-[#00f0ff] font-mono text-[10px] uppercase tracking-widest whitespace-nowrap shadow-[0_0_10px_rgba(0,240,255,0.3)]">
            {label} <span className="opacity-70 ml-1">{confidence}%</span>
          </div>
        </div>
      </Html>
    </group>
  );
}

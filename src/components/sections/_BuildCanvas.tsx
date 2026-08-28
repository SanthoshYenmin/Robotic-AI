"use client";
import { Canvas } from "@react-three/fiber";
import BuildLab from "@/components/three/BuildLab";

export default function BuildCanvas({
  progressRef,
}: {
  progressRef: React.MutableRefObject<{ value: number }>;
}) {
  return (
    <Canvas camera={{ position: [0, 0.5, 10], fov: 50 }} gl={{ alpha: true, antialias: true }}>
      <BuildLab progressRef={progressRef} />
    </Canvas>
  );
}

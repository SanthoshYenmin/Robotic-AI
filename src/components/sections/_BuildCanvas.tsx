"use client";
import { View, PerspectiveCamera } from "@react-three/drei";
import BuildLab from "@/components/three/BuildLab";

export default function BuildCanvas({
  progressRef,
}: {
  progressRef: React.MutableRefObject<{ value: number }>;
}) {
  return (
    <View className="absolute inset-0 w-full h-full pointer-events-none">
      <PerspectiveCamera makeDefault position={[0, 0.5, 10]} fov={50} onUpdate={c => c.lookAt(0, 0, 0)} />
      <BuildLab progressRef={progressRef} />
    </View>
  );
}

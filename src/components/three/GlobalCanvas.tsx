"use client";

import { Canvas } from "@react-three/fiber";
import { View } from "@react-three/drei";

export default function GlobalCanvas() {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        eventSource={document.getElementById("root") as HTMLElement}
        className="pointer-events-none"
      >
        <View.Port />
      </Canvas>
    </div>
  );
}

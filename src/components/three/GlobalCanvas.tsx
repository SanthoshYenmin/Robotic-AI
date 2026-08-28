"use client";

import { Canvas } from "@react-three/fiber";
import RobotScene from "./RobotScene";

export default function GlobalCanvas() {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-[-1]">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        className="pointer-events-auto"
      >
        <RobotScene />
      </Canvas>
    </div>
  );
}

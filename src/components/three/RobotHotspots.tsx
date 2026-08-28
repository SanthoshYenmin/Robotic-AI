"use client";

import { Html } from "@react-three/drei";
import { useState } from "react";

type HotspotProps = {
  position: [number, number, number];
  title: string;
  description: string;
};

export function Hotspot({ position, title, description }: HotspotProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Html position={position} center zIndexRange={[100, 0]}>
      <div 
        className="relative group cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Glowing Point */}
        <div className="w-3 h-3 bg-[#00f0ff] rounded-full shadow-[0_0_15px_#00f0ff] relative z-10">
          <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-50"></div>
        </div>

        {/* Info Panel */}
        <div 
          className={`absolute left-6 top-1/2 -translate-y-1/2 w-48 transition-all duration-300 pointer-events-none ${
            hovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
          }`}
        >
          {/* Connecting Line */}
          <div className="absolute right-full top-1/2 -translate-y-1/2 w-4 h-[1px] bg-[#00f0ff]/50"></div>
          
          <div className="bg-black/80 backdrop-blur-md border border-white/10 p-3 rounded-sm">
            <h4 className="text-[#00f0ff] text-xs font-bold uppercase tracking-widest mb-1">{title}</h4>
            <p className="text-gray-300 text-[10px] leading-relaxed">{description}</p>
          </div>
        </div>
      </div>
    </Html>
  );
}

export default function RobotHotspots() {
  return (
    <>
      <Hotspot 
        position={[0, 1.6, 0.3]} 
        title="Vision System" 
        description="Multi-camera perception system designed to understand complex environments." 
      />
      <Hotspot 
        position={[0, 1.2, 0.4]} 
        title="Compute Core" 
        description="Real-time reasoning engine for complex physical tasks." 
      />
      <Hotspot 
        position={[0.5, 0.8, 0.2]} 
        title="Actuation" 
        description="High-torque motors for precise and powerful movement." 
      />
    </>
  );
}

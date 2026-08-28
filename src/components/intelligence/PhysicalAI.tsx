"use client";

import RevealText from "@/components/animations/RevealText";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import Badge3D from "@/components/ui/Badge3D";

export default function PhysicalAI() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left - rect.width / 2,
      y: e.clientY - rect.top - rect.height / 2,
    });
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
      className="py-48 bg-[#050505] flex items-center justify-center relative overflow-hidden"
    >
      {/* Interactive Physics Elements */}
      <motion.div 
        className="absolute w-32 h-32 md:w-64 md:h-64 border border-[#00f0ff]/20 rounded-full flex items-center justify-center"
        animate={{ 
          x: mousePos.x * -0.1, 
          y: mousePos.y * -0.1,
          rotate: mousePos.x * 0.05
        }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
      >
        <div className="w-2 h-2 bg-[#00f0ff] rounded-full"></div>
      </motion.div>
      
      <motion.div 
        className="absolute w-48 h-48 md:w-96 md:h-96 border border-white/5 rounded-sm rotate-45"
        animate={{ 
          x: mousePos.x * 0.05, 
          y: mousePos.y * 0.05,
        }}
        transition={{ type: "spring", stiffness: 30, damping: 30 }}
      />

      <div className="container mx-auto px-6 md:px-12 text-center relative z-10 pointer-events-none mb-6">
        <Badge3D text="06 — PHYSICAL AI" />
        <RevealText delay={0.2}>
          <h3 className="text-4xl md:text-6xl lg:text-8xl font-bold uppercase tracking-tighter leading-tight text-white mix-blend-difference">
            Intelligence that<br />
            <span className="text-gray-500">understands physics.</span>
          </h3>
        </RevealText>
      </div>
    </section>
  );
}

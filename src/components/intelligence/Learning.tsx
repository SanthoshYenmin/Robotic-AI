"use client";

import RevealText from "@/components/animations/RevealText";
import { motion } from "framer-motion";
import TiltWrapper from "@/components/animations/TiltWrapper";
import Badge3D from "@/components/ui/Badge3D";

const loopNodes = ["SIMULATION", "DATA", "TRAINING", "REAL WORLD", "IMPROVEMENT"];

export default function Learning() {
  return (
    <section className="py-32 md:py-48 min-h-screen bg-black relative border-t border-white/5 flex items-center overflow-hidden">
      
      {/* Background Graphic */}
      <div className="absolute inset-0 opacity-20 flex items-center justify-center">
        <div className="w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] rounded-full border border-[#00f0ff] mix-blend-screen animate-[spin_60s_linear_infinite]"></div>
        <div className="absolute w-[70vw] h-[70vw] md:w-[35vw] md:h-[35vw] rounded-full border border-white/10 animate-[spin_40s_linear_infinite_reverse]"></div>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col md:flex-row items-center gap-16 md:gap-24">
        
        {/* Left Side Content */}
        <div className="flex-1 text-center md:text-left">
          <Badge3D text="05 — LEARNING" />
          <RevealText delay={0.1}>
            <h3 className="text-4xl md:text-6xl font-[family-name:var(--font-display)] font-bold uppercase tracking-tight mb-8 leading-[1.1] text-gradient">
              Continuous iteration.
            </h3>
          </RevealText>
        </div>

        <div className="flex-1 relative max-w-4xl mx-auto flex flex-wrap justify-center gap-12">
          {loopNodes.map((node, index) => (
            <motion.div 
              key={node} 
              className="flex items-center gap-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <TiltWrapper>
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border border-white/10 bg-[#050505] flex items-center justify-center relative group hover:border-[#00f0ff]/50 transition-colors duration-500 cursor-default shadow-[0_0_30px_rgba(0,240,255,0.05)]">
                  {/* Orbital Particle */}
                  <motion.div 
                    className="absolute inset-0 rounded-full border border-dashed border-[#00f0ff]/30 opacity-0 group-hover:opacity-100 transition-opacity"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#00f0ff] rounded-full shadow-[0_0_10px_#00f0ff]"></div>
                  </motion.div>
                  
                  <span className="text-white font-mono text-[10px] md:text-xs uppercase tracking-widest text-center px-4">
                    {node}
                  </span>
                </div>
              </TiltWrapper>
              
              {index < loopNodes.length - 1 && (
                <div className="hidden md:block text-[#00f0ff] opacity-50">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

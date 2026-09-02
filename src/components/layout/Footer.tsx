"use client";

import { useRef } from "react";

export default function Footer() {
  const containerRef = useRef<HTMLElement>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer ref={containerRef} className="relative w-full bg-[#020406] text-white overflow-hidden border-t border-white/5">
        
        {/* ── Subtle Background Accents ── */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00f0ff]/30 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[400px] bg-[#00f0ff] opacity-[0.03] blur-[120px] pointer-events-none rounded-full" />
        
        {/* Tech Grid Pattern */}
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]"
          style={{ backgroundImage: "repeating-linear-gradient(to bottom,transparent,transparent 2px,rgba(0,0,0,1) 2px,rgba(0,0,0,1) 4px)" }}
        />

        <div className="container mx-auto px-8 md:px-16 relative z-20" style={{ paddingTop: '120px', paddingBottom: '120px' }}>
          
          {/* ── Top Section: Asymmetrical Layout ── */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-16">
            
            {/* Left: Powerful CTA */}
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-8">
                <span className="w-2 h-2 bg-[#00f0ff] shadow-[0_0_8px_#00f0ff]" />
                <span className="font-mono text-[10px] tracking-[0.3em] text-[#00f0ff] uppercase">
                  Initiate Sequence
                </span>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
                Ready to engineer <br />
                <span className="text-[#00f0ff]">the next frontier?</span>
              </h2>
              <p className="font-mono text-sm tracking-wide text-white/50 leading-relaxed max-w-md">
                Pioneering autonomous systems that push the boundaries of what's possible. Join us in forging the next era of intelligent robotics.
              </p>
            </div>

            {/* Right: Giant App Name */}
            <div className="lg:text-right flex flex-col lg:items-end">
              <h1 className="text-6xl md:text-[8rem] leading-[0.8] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 select-none">
                NOVA
              </h1>
              <div className="mt-4 flex items-center gap-4 w-full">
                <div className="h-[1px] flex-1 bg-white/20" />
                <p className="font-mono text-[10px] md:text-xs tracking-[0.5em] text-white/40 uppercase shrink-0">
                  Robotics Intelligence
                </p>
                <div className="h-[1px] flex-1 bg-white/20" />
              </div>
            </div>

          </div>
        </div>
      </footer>
    </>
  );
}

"use client";

import RevealText from "@/components/animations/RevealText";

export default function SolutionsHero() {
  return (
    <section className="relative w-full h-screen min-h-[800px] flex items-center justify-center overflow-hidden bg-black">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center opacity-40"
          style={{ backgroundImage: 'url(/images/manufacturing_robot_1787816160233.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80"></div>
      </div>
      <div className="absolute inset-0 z-0 bg-grid opacity-20 pointer-events-none"></div>
      
      <div className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center justify-center text-center mt-20 pointer-events-auto">
        <RevealText delay={0.2} noScrollTrigger>
          <div className="inline-block border border-[#00f0ff]/30 bg-[#00f0ff]/5 backdrop-blur-md px-4 py-1.5 rounded-full mb-8">
            <span className="text-xs uppercase tracking-[0.2em] text-[#00f0ff]">ENTERPRISE SOLUTIONS</span>
          </div>
        </RevealText>

        <RevealText delay={0.4} noScrollTrigger>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tight leading-[1.1] text-gradient mb-8">
            Built for<br />the Real World.
          </h1>
        </RevealText>

        <RevealText delay={0.6} noScrollTrigger>
          <p className="text-xl md:text-2xl text-gray-400 font-light tracking-wide max-w-2xl mx-auto">
            Ready to integrate into your existing infrastructure from day one.
          </p>
        </RevealText>
      </div>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
        <span className="text-[10px] uppercase tracking-[0.3em] font-mono text-white">Select Environment</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent"></div>
      </div>
    </section>
  );
}

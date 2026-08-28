"use client";

import RevealText from "@/components/animations/RevealText";

export default function FleetHero() {
  return (
    <section className="relative w-full h-screen min-h-[800px] flex items-center justify-center overflow-hidden bg-black">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center opacity-40"
          style={{ backgroundImage: 'url(/images/hospitality_robot_1787816234698.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80"></div>
      </div>
      <div className="absolute inset-0 z-0 bg-grid opacity-20 pointer-events-none"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col pointer-events-auto">
        <RevealText noScrollTrigger>
          <div className="inline-block border border-[#00f0ff]/30 bg-[#00f0ff]/5 backdrop-blur-md px-3 py-1 rounded-sm mb-6">
            <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#00f0ff]">Nova OS / Live</span>
          </div>
        </RevealText>

        <RevealText delay={0.2} noScrollTrigger>
          <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tight leading-none text-white drop-shadow-md">
            Global Fleet.
          </h1>
        </RevealText>
      </div>
    </section>
  );
}

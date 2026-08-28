"use client";

import RevealText from "@/components/animations/RevealText";

export default function DeploymentHero() {
  return (
    <section className="relative w-full h-screen min-h-[800px] flex items-center justify-center overflow-hidden bg-black text-center border-b border-white/5">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center opacity-40"
          style={{ backgroundImage: 'url(/images/logistics_robot_1787816200389.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80"></div>
      </div>
      <div className="absolute inset-0 z-0 bg-grid opacity-20 pointer-events-none"></div>
      
      <div className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center pointer-events-auto">
        <RevealText delay={0.2} noScrollTrigger>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight leading-none text-white drop-shadow-md mb-6">
            The Journey to Scale.
          </h1>
        </RevealText>
        <RevealText delay={0.4} noScrollTrigger>
           <p className="text-gray-400 font-light text-lg max-w-xl">
             From initial discovery in our simulation labs to massive fleet orchestration on your factory floor.
           </p>
        </RevealText>
      </div>
    </section>
  );
}

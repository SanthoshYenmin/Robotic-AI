"use client";

import RevealText from "@/components/animations/RevealText";

export default function FutureStatement() {
  return (
    <section className="h-screen bg-black flex items-center justify-center relative overflow-hidden group">
      {/* Cinematic Parallax Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 transition-transform duration-[30s] group-hover:scale-110"
          style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/nova_future_city_1787818765341.jpg)` }}
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black"></div>
      </div>
      
      <div className="container mx-auto px-6 md:px-12 text-center relative z-10">
        <RevealText>
          <h2 className="text-5xl md:text-8xl lg:text-9xl font-[family-name:var(--font-display)] font-bold uppercase tracking-tighter leading-[0.9] text-white">
            We are teaching<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-[#00f0ff]">machines to move</span><br />
            through our world.
          </h2>
        </RevealText>
      </div>
    </section>
  );
}

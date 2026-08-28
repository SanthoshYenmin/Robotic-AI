"use client";

import RevealText from "@/components/animations/RevealText";

const sections = [
  { id: "01", title: "ACTUATION", desc: "Custom-designed high-torque motors." },
  { id: "02", title: "VISION", desc: "Stereo depth and high-resolution perception." },
  { id: "03", title: "HANDS", desc: "Dexterous manipulation with tactile feedback." },
  { id: "04", title: "BALANCE", desc: "Real-time locomotion and stability control." },
  { id: "05", title: "ENERGY", desc: "High-density solid-state power architecture." },
  { id: "06", title: "CONTROL", desc: "Sub-millisecond nervous system routing." }
];

export default function TechSections() {
  return (
    <div id="tech-sections" className="relative w-full z-10 pointer-events-none">
      <div className="container mx-auto px-6 md:px-12 flex flex-col items-start pt-32 pb-64 gap-[50vh] pointer-events-auto">
        {sections.map((section) => (
          <div key={section.id} className="max-w-sm bg-black/60 backdrop-blur-md border border-white/10 p-8 rounded-sm">
            <RevealText>
              <h2 className="text-[#00f0ff] font-mono text-sm tracking-[0.2em] mb-2">{section.id}</h2>
              <h3 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-white mb-4">{section.title}</h3>
              <p className="text-gray-400 font-light leading-relaxed">{section.desc}</p>
            </RevealText>
          </div>
        ))}
      </div>
    </div>
  );
}

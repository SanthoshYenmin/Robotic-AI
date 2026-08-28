"use client";

import RevealText from "@/components/animations/RevealText";
import Button3D from "@/components/ui/Button3D";

export default function IntelligenceCTA() {
  return (
    <section className="py-32 bg-black border-t border-white/10 relative overflow-hidden">
      
      {/* Background Graphic */}
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none"></div>

      <div className="container mx-auto px-6 md:px-12 text-center relative z-10 flex flex-col items-center">
        <RevealText>
          <h2 className="text-5xl md:text-8xl font-bold uppercase tracking-tight text-white mb-8">
            The Future <br/>
            <span className="text-[#00f0ff]">Is Physical.</span>
          </h2>
        </RevealText>
        
        <RevealText delay={0.2}>
          <p className="text-xl text-gray-400 font-light mb-12 max-w-xl mx-auto">
            Explore what Nova can do in the real world.
          </p>
        </RevealText>
        
        <RevealText delay={0.4}>
          <Button3D text="Explore Nova" />
        </RevealText>
      </div>
    </section>
  );
}

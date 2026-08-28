"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import RevealText from "@/components/animations/RevealText";

gsap.registerPlugin(ScrollTrigger);

const stages = ["SEE", "UNDERSTAND", "PLAN", "ACT", "LEARN"];

export default function PhysicalIntelligence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    const container = containerRef.current;
    const marquee = marqueeRef.current;
    if (!container || !marquee) return;

    // Set up infinite scrolling marquee
    const marqueeItems = marquee.children;
    const totalWidth = Array.from(marqueeItems).reduce((acc, item) => acc + (item as HTMLElement).offsetWidth, 0);

    // Initial setup to handle infinite loop seamlessly by duplicating content in the render
    gsap.to(marquee, {
      x: `-=${totalWidth / 2}`,
      ease: "none",
      duration: 20,
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize(x => parseFloat(x) % (totalWidth / 2))
      }
    });

    // Scroll velocity skew effect
    const proxy = { skew: 0 };
    const skewSetter = gsap.quickSetter(marqueeItems, "skewX", "deg");
    const clamp = gsap.utils.clamp(-20, 20);

    ScrollTrigger.create({
      trigger: container,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const skew = clamp(self.getVelocity() / -100);
        
        // Only do work if skew changed significantly to save performance
        if (Math.abs(skew - proxy.skew) > 0.1) {
          proxy.skew = skew;
          gsap.to(proxy, {
            skew: 0,
            duration: 0.8,
            ease: "power3",
            overwrite: true,
            onUpdate: () => skewSetter(proxy.skew)
          });
        }
      }
    });

  }, { scope: containerRef });

  // Duplicate stages to ensure enough content for seamless infinite marquee
  const displayStages = [...stages, ...stages, ...stages];

  return (
    <section ref={containerRef} className="py-48 bg-[#111] relative overflow-hidden flex flex-col justify-center border-t border-white/5">
      <div className="container mx-auto px-6 md:px-12 mb-16 relative z-10">
        <RevealText>
          <h2 className="text-sm font-semibold tracking-[0.3em] uppercase text-[#00f0ff]">
            Physical Intelligence
          </h2>
        </RevealText>
      </div>

      {/* Infinite Marquee Wrapper */}
      <div className="w-full flex overflow-hidden whitespace-nowrap">
        <div ref={marqueeRef} className="flex items-center gap-16 md:gap-32 w-max">
          {displayStages.map((stage, index) => (
            <div key={`${stage}-${index}`} className="flex-shrink-0 flex items-center gap-8 will-change-transform">
              <h3 
                className="text-5xl md:text-[8rem] font-bold uppercase tracking-tighter text-transparent stroke-text leading-none" 
                style={{ WebkitTextStroke: "2px rgba(255,255,255,0.2)" }}
              >
                {stage}
              </h3>
              <div className="w-16 md:w-32 h-[2px] bg-white/20 relative">
                 <div className="absolute top-1/2 -translate-y-1/2 right-0 w-3 h-3 rounded-full bg-[#00f0ff]"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none mix-blend-overlay"></div>
    </section>
  );
}

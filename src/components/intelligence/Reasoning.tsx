"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import RevealText from "@/components/animations/RevealText";
import TiltWrapper from "@/components/animations/TiltWrapper";
import Badge3D from "@/components/ui/Badge3D";

const nodes = ["INPUT", "UNDERSTAND", "REASON", "PLAN", "ACTION"];

export default function Reasoning() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    if (!containerRef.current || !lineRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 60%",
        end: "bottom 80%",
        scrub: 1,
      }
    });

    // Start nodes slightly scaled down and faded
    gsap.set(nodesRef.current, { opacity: 0, scale: 0.8, x: (i) => i % 2 === 0 ? -50 : 50 });

    // Animate the line height
    tl.to(lineRef.current, {
      height: "100%",
      ease: "power2.inOut",
    }, 0);

    // Stagger nodes flying in and lighting up
    nodesRef.current.forEach((node, i) => {
      if (!node) return;
      const progress = i / (nodes.length - 1);
      const time = progress * tl.duration() * 0.8; // synchronize with line

      tl.to(node, {
        opacity: 1,
        scale: 1,
        x: 0,
        borderColor: "#00f0ff",
        color: "#ffffff",
        boxShadow: "0 0 30px rgba(0, 240, 255, 0.6)",
        backgroundColor: "rgba(0, 240, 255, 0.15)",
        duration: 0.3,
        ease: "back.out(1.5)"
      }, time);
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-32 md:py-48 min-h-[120svh] bg-[#050505] relative overflow-hidden flex items-center border-t border-white/5">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header */}
        <div className="mb-20">
          <RevealText>
            <Badge3D text="02 — REASONING" />
          </RevealText>
          <RevealText delay={0.1}>
            <h3 className="text-4xl md:text-6xl font-[family-name:var(--font-display)] font-bold uppercase tracking-tight mb-8 leading-[1.1] text-gradient max-w-4xl">
              Making sense of chaos.
            </h3>
          </RevealText>
          <RevealText delay={0.2}>
            <p className="text-xl text-gray-400 font-light max-w-lg leading-relaxed">
              Nova uses state-of-the-art multimodal reasoning models to understand intent, map environments, and dynamically solve physical puzzles.
            </p>
          </RevealText>
        </div>

        <div className="flex-1 relative py-12 flex justify-center min-h-[500px]">
          {/* Reasoning AI Image Background */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden border border-white/10 group">
             <div 
               className="absolute inset-0 bg-cover bg-center transition-transform duration-[15s] group-hover:scale-105 opacity-60"
               style={{ backgroundImage: 'url(/images/reasoning_ai_1787817026765.jpg)' }}
             />
             <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-transparent z-0"></div>
             {/* Pulse effect */}
             <div className="absolute inset-0 bg-[#00f0ff] opacity-0 animate-[pulse_4s_ease-in-out_infinite] mix-blend-overlay"></div>
          </div>

          {/* Animated Connecting Line */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-white/5 z-10">
            <div ref={lineRef} className="w-full h-0 bg-gradient-to-b from-[#00f0ff] to-[#00f0ff] relative">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#00f0ff] rounded-full blur-[2px]"></div>
            </div>
          </div>

          <TiltWrapper className="w-full max-w-xs z-20">
            <div className="flex flex-col gap-24 relative w-full justify-center">
              {nodes.map((node, i) => (
                <div 
                  key={node}
                  ref={(el) => {
                    nodesRef.current[i] = el;
                  }}
                  className="w-full bg-black/60 backdrop-blur-md border border-white/20 p-6 text-center rounded-sm text-gray-400 font-mono tracking-widest text-sm uppercase transition-all duration-300"
                >
                  {node}
                </div>
              ))}
            </div>
          </TiltWrapper>
        </div>
      </div>
    </section>
  );
}

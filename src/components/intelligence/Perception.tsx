"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import Badge3D from "@/components/ui/Badge3D";
import RevealText from "@/components/animations/RevealText";

gsap.registerPlugin(ScrollTrigger);

export default function Perception() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const finalStatementRef = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    if (!containerRef.current || !textContainerRef.current || !finalStatementRef.current) return;

    // Timeline for HTML elements synchronized with the 3D scene (0 to 1 progress)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        id: "perception-html-tl"
      }
    });

    // 0% - 15%: Initial Text is visible
    // 15% - 20%: Fade out initial text
    tl.to(textContainerRef.current, {
      opacity: 0,
      y: -50,
      duration: 0.05,
      ease: "power2.inOut"
    }, 0.15);

    // 25% - 40%: Show Image
    tl.to("#perception-visual-1", {
      opacity: 1,
      y: 0,
      duration: 0.1,
      ease: "power2.out"
    }, 0.25);

    // 35% - 50%: Animate scanner line over the image
    tl.to("#perception-scanner", {
      opacity: 1,
      duration: 0.02
    }, 0.35);
    tl.fromTo("#perception-scanner", {
      y: -200
    }, {
      y: 200,
      duration: 0.15,
      ease: "linear"
    }, 0.35);
    tl.to("#perception-scanner", {
      opacity: 0,
      duration: 0.02
    }, 0.50);

    // 70% - 80%: Fade out image
    tl.to("#perception-visual-1", {
      opacity: 0,
      scale: 1.1,
      duration: 0.1,
      ease: "power2.in"
    }, 0.70);

    // 90% - 96%: Final statement fades in
    tl.fromTo(finalStatementRef.current, {
      opacity: 0,
      y: 50
    }, {
      opacity: 1,
      y: 0,
      duration: 0.06,
      ease: "power2.out"
    }, 0.90);

  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="perception-section" className="relative w-full h-[800vh] bg-transparent">
      
      {/* Sticky Container for HTML Overlays */}
      <div className="sticky top-0 w-full h-screen flex flex-col justify-center pointer-events-none overflow-hidden z-10">
        
        {/* Initial Typography (0% - 15%) */}
        <div ref={textContainerRef} className="container mx-auto px-6 md:px-12 absolute left-0 right-0 top-[20%]">
          <RevealText>
            <Badge3D text="02 — PERCEPTION" />
          </RevealText>
          <RevealText delay={0.1}>
            <h3 className="text-5xl md:text-7xl font-[family-name:var(--font-display)] font-bold uppercase tracking-tight mb-6 leading-[1.1] text-white drop-shadow-lg">
              See the world.
            </h3>
          </RevealText>
          <RevealText delay={0.2}>
            <p className="text-xl md:text-2xl text-gray-300 font-light max-w-lg leading-relaxed drop-shadow-md">
              Before a robot can act, it needs to understand what surrounds it.
            </p>
          </RevealText>
        </div>

        {/* Cinematic Visuals during Scroll (added based on user feedback) */}
        <div className="absolute inset-0 w-full h-full pointer-events-none flex items-center justify-center">
           <img 
             src="/images/warehouse_robot_1787816175693.jpg" 
             alt="Robot Perception"
             className="w-[80vw] md:w-[60vw] rounded-2xl opacity-0 transform translate-y-24 shadow-[0_0_50px_rgba(0,240,255,0.2)] object-cover"
             id="perception-visual-1"
           />
           <div 
             className="absolute w-[80vw] md:w-[60vw] h-[2px] bg-[#00f0ff] shadow-[0_0_20px_#00f0ff] opacity-0"
             id="perception-scanner"
           ></div>
        </div>

        {/* Final Typography (96% - 100%) */}
        <div ref={finalStatementRef} className="container mx-auto px-6 md:px-12 absolute left-0 right-0 top-[45%] text-center opacity-0">
          <h3 className="text-4xl md:text-6xl font-[family-name:var(--font-display)] font-bold uppercase tracking-tight mb-4 text-white drop-shadow-2xl">
            Seeing is only the beginning.
          </h3>
          <p className="text-xl md:text-2xl text-[#00f0ff] font-mono uppercase tracking-widest drop-shadow-md">
            From pixels to perception.
          </p>
        </div>

      </div>

    </section>
  );
}

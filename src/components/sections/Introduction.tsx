"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Canvas } from "@react-three/fiber";
import RoboticCore, { RoboticCoreRef } from "@/components/three/RoboticCore";

gsap.registerPlugin(ScrollTrigger);

export default function Introduction() {
  const sectionRef = useRef<HTMLElement>(null);
  const coreRef = useRef<RoboticCoreRef>(null);
  
  // DOM Refs for animation
  const leftContentRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const scanLineRef = useRef<HTMLDivElement>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section || !isMounted) return;

    const group = coreRef.current?.groupRef?.current;
    const innerCore = coreRef.current?.innerCoreRef?.current;
    const rings = coreRef.current?.ringsRef?.current;

    // Initial state
    gsap.set(leftContentRef.current, { opacity: 0, x: -50 });
    gsap.set(labelsRef.current?.children || [], { opacity: 0, x: -20 });
    
    // Split title for word-by-word reveal
    const titleWords = titleRef.current?.querySelectorAll(".word") || [];
    gsap.set(titleWords, { opacity: 0, y: 20 });

    if (group) {
      // Start small and centered
      gsap.set(group.position, { x: 0, y: 0, z: 0 });
      gsap.set(group.scale, { x: 0.2, y: 0.2, z: 0.2 });
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=2000",
        pin: true,
        scrub: 1,
        refreshPriority: 9,
      }
    });

    // 1. Core expands and shifts right
    if (group && rings && innerCore) {
      tl.to(group.scale, { x: 0.65, y: 0.65, z: 0.65, duration: 2, ease: "power2.out" }, 0)
        .to(group.position, { x: 1.2, duration: 2, ease: "power2.inOut" }, 0)
        .to(rings.scale, { x: 1.2, y: 1.2, z: 1.2, duration: 2 }, 0) // Rings open up
        .to(innerCore.scale, { x: 0.8, y: 0.8, z: 0.8, duration: 2 }, 0); // Inner core expands slightly
    }

    // 2. Labels sequentially appear around the core
    if (labelsRef.current?.children) {
      tl.to(labelsRef.current.children, {
        opacity: 1,
        x: 0,
        stagger: 0.3,
        duration: 1,
        ease: "power2.out"
      }, 0.5);
    }

    // 3. Left content reveals
    tl.to(leftContentRef.current, { opacity: 1, x: 0, duration: 1, ease: "power3.out" }, 1);
    
    // Word by word title reveal
    if (titleWords.length > 0) {
      tl.to(titleWords, {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power2.out"
      }, 1.5);
    }

  }, { scope: sectionRef, dependencies: [isMounted] });

  // Handle CTA Hover Effect (Core pulse + Scan line)
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (coreRef.current?.innerCoreRef?.current) {
      gsap.to(coreRef.current.innerCoreRef.current.scale, { x: 1.1, y: 1.1, z: 1.1, duration: 0.3, yoyo: true, repeat: 1 });
    }
    if (scanLineRef.current) {
      gsap.fromTo(scanLineRef.current, 
        { y: "-100%", opacity: 0.5 }, 
        { y: "100%", opacity: 0, duration: 1.5, ease: "power1.inOut" }
      );
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <section ref={sectionRef} className="relative w-full h-[100svh] bg-[#050505] overflow-hidden">
      
      {/* Scanning Line (Triggered on CTA Hover) */}
      <div 
        ref={scanLineRef} 
        className="absolute top-0 left-0 w-full h-[20vh] bg-gradient-to-b from-transparent via-[#00f0ff]/10 to-transparent pointer-events-none z-30 opacity-0 transform -translate-y-full"
      />

      {/* Background Grid */}
      <div className="absolute inset-0 z-0 opacity-20" style={{
        backgroundImage: "linear-gradient(rgba(0,240,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.03) 1px, transparent 1px)",
        backgroundSize: "40px 40px"
      }} />

      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-10">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }} onCreated={() => setIsMounted(true)}>
          <RoboticCore ref={coreRef} />
        </Canvas>
      </div>

      {/* Interactive Labels overlay for 3D Core */}
      <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-end pr-[10vw]">
        <div ref={labelsRef} className="flex flex-col gap-12 text-[#00f0ff] font-mono text-xs uppercase tracking-[0.3em]">
          <div className="flex items-center gap-4">
            <span className="w-12 h-px bg-[#00f0ff]/50" />
            <span className="backdrop-blur-sm bg-black/20 px-3 py-1 border border-[#00f0ff]/20 rounded">AI Core</span>
          </div>
          <div className="flex items-center gap-4 translate-x-12">
            <span className="w-8 h-px bg-[#00f0ff]/50" />
            <span className="backdrop-blur-sm bg-black/20 px-3 py-1 border border-[#00f0ff]/20 rounded">Vision</span>
          </div>
          <div className="flex items-center gap-4 translate-x-4">
            <span className="w-16 h-px bg-[#00f0ff]/50" />
            <span className="backdrop-blur-sm bg-black/20 px-3 py-1 border border-[#00f0ff]/20 rounded">Motion</span>
          </div>
          <div className="flex items-center gap-4 -translate-x-8">
            <span className="w-20 h-px bg-[#00f0ff]/50" />
            <span className="backdrop-blur-sm bg-black/20 px-3 py-1 border border-[#00f0ff]/20 rounded">Decision</span>
          </div>
        </div>
      </div>

      {/* Foreground Content */}
      <div className="relative z-20 container mx-auto h-full px-6 md:px-12 lg:px-24 pt-32 pointer-events-none">
        
        <div ref={leftContentRef} className="w-full max-w-2xl pointer-events-auto">
          {/* Section Marker */}
          <div className="flex items-center gap-4 mb-16 opacity-50">
            <span className="text-white/40 font-mono text-sm tracking-widest">02</span>
            <div className="w-16 h-px bg-white/20" />
            <span className="text-white/40 font-mono text-sm uppercase tracking-widest">Introduction</span>
          </div>

          {/* Small Heading */}
          <p className="text-[#00f0ff] font-mono text-xs uppercase tracking-[0.4em] mb-6 flex items-center gap-4">
            <span className="w-2 h-2 bg-[#00f0ff]" />
            01 / WHO I AM
          </p>

          {/* Title */}
          <h2 ref={titleRef} className="text-4xl md:text-5xl lg:text-[4rem] font-black text-white leading-[1.05] tracking-tighter mb-8 uppercase flex flex-wrap gap-x-4 gap-y-2">
            {/* Split text for word animation */}
            {"Turning Ideas Into Intelligent Machines.".split(" ").map((word, i) => (
              <span key={i} className={`word inline-block ${word === "Intelligent" || word === "Machines." ? "text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40" : ""}`}>
                {word}
              </span>
            ))}
          </h2>

          {/* Content */}
          <p className="text-white/60 text-base md:text-lg lg:text-xl font-light leading-relaxed max-w-lg mb-12">
            I’m a robotics engineer passionate about building machines that can see, understand, move, and make decisions. I combine <span className="text-white font-medium">software, hardware, AI,</span> and <span className="text-white font-medium">intelligent algorithms</span> to transform ideas into practical robotic systems.
          </p>

          {/* Button */}
          <button 
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="group relative inline-flex items-center gap-4 px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden transition-all duration-500 hover:border-[#00f0ff]/50 hover:shadow-[0_0_30px_rgba(0,240,255,0.2)]"
          >
            {/* Button inner glow */}
            <div className="absolute inset-0 w-0 bg-[#00f0ff]/10 group-hover:w-full transition-all duration-500 ease-out" />
            
            <span className="relative z-10 text-white group-hover:text-[#00f0ff] font-mono text-xs uppercase tracking-widest transition-colors duration-300">
              More About Me
            </span>
            
            <svg 
              className={`relative z-10 w-4 h-4 text-white/50 group-hover:text-[#00f0ff] transform transition-transform duration-300 ${isHovered ? "translate-x-2" : ""}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>

        </div>
      </div>
    </section>
  );
}
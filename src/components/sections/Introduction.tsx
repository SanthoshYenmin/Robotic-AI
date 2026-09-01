"use client";

import { useRef, useState } from "react";
import { usePreloaderReady } from "@/hooks/usePreloaderReady";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import { View, PerspectiveCamera } from "@react-three/drei";
import RoboticCore, { RoboticCoreRef } from "@/components/three/RoboticCore";

gsap.registerPlugin(ScrollTrigger);

export default function Introduction() {
  const sectionRef = useRef<HTMLElement>(null);
  const coreRef = useRef<RoboticCoreRef>(null);

  // DOM Refs for animation
  const leftContentRef = useRef<HTMLDivElement>(null);
  const labelsRefDesktop = useRef<HTMLDivElement>(null);
  const labelsRefMobile = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const scanLineRef = useRef<HTMLDivElement>(null);

  const [isHovered, setIsHovered] = useState(false);
  const isMounted = usePreloaderReady();

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section || !isMounted) return;

    const group = coreRef.current?.groupRef?.current;
    const innerCore = coreRef.current?.innerCoreRef?.current;
    const rings = coreRef.current?.ringsRef?.current;

    let mm = gsap.matchMedia();

    // Initial state
    gsap.set(leftContentRef.current, { opacity: 0, y: 30 });
    gsap.set(labelsRefDesktop.current?.children || [], { opacity: 0, x: -20 });
    gsap.set(labelsRefMobile.current?.children || [], { opacity: 0, x: -20 });

    // Split title for word-by-word reveal
    const titleWords = titleRef.current?.querySelectorAll(".word") || [];
    gsap.set(titleWords, { opacity: 0, y: 20 });

    if (group) {
      // Start small and centered
      gsap.set(group.position, { x: 0, y: 0, z: 0 });
      gsap.set(group.scale, { x: 0.2, y: 0.2, z: 0.2 });
    }

    mm.add({
      isDesktop: "(min-width: 768px)",
      isMobile: "(max-width: 767px)"
    }, (context) => {
      let { isDesktop } = context.conditions as { isDesktop: boolean };

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

      // 1. Core expands and shifts
      if (group && rings && innerCore) {
        // Offset starting position and scale on mobile so it doesn't overlap text
        if (!isDesktop) {
          gsap.set(group.position, { x: 1.0, y: -0.5 });
          gsap.set(group.scale, { x: 0.1, y: 0.1, z: 0.1 });
        }

        tl.to(group.scale, {
          x: isDesktop ? 0.65 : 0.15,
          y: isDesktop ? 0.65 : 0.15,
          z: isDesktop ? 0.65 : 0.15,
          duration: 2, ease: "power2.out"
        }, 0)
          .to(group.position, {
            x: isDesktop ? 1.2 : 1.5, // Shift right on mobile
            y: isDesktop ? 0 : -1.5, // Shift down on mobile but keep on screen
            duration: 2, ease: "power2.inOut"
          }, 0)
          .to(rings.scale, { x: 1.2, y: 1.2, z: 1.2, duration: 2 }, 0)
          .to(innerCore.scale, { x: 0.8, y: 0.8, z: 0.8, duration: 2 }, 0);
      }

      // 2. Labels sequentially appear
      const activeLabels = isDesktop ? labelsRefDesktop.current?.children : labelsRefMobile.current?.children;
      if (activeLabels) {
        tl.to(activeLabels, {
          opacity: 1,
          x: 0,
          stagger: 0.3,
          duration: 1,
          ease: "power2.out"
        }, 0.5);
      }

      // 3. Left content reveals
      tl.to(leftContentRef.current, { opacity: 1, y: 0, x: 0, duration: 1, ease: "power3.out" }, 1);

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
    });

    return () => mm.revert();
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
    <section ref={sectionRef} className="relative w-full h-[100svh] bg-transparent overflow-hidden">

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
      <div className="absolute inset-0 z-0">
        <View className="absolute inset-0 w-full h-full pointer-events-none">
          <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
          <RoboticCore ref={coreRef} />
        </View>
      </div>

      {/* Interactive Labels overlay for 3D Core - DESKTOP ONLY */}
      <div className="absolute inset-0 z-20 pointer-events-none hidden md:flex flex-row items-center justify-end pr-[10vw]">
        <div ref={labelsRefDesktop} className="flex flex-col gap-12 text-[#00f0ff] font-mono text-xs uppercase tracking-[0.3em] origin-right">
          <div className="flex items-center gap-4">
            <span className="w-12 h-px bg-[#00f0ff]/50" />
            <span style={{ padding: '0.25rem 0.75rem' }} className="backdrop-blur-sm bg-black/20 border border-[#00f0ff]/20 rounded">AI Core</span>
          </div>
          <div className="flex items-center gap-4 translate-x-12">
            <span className="w-8 h-px bg-[#00f0ff]/50" />
            <span style={{ padding: '0.25rem 0.75rem' }} className="backdrop-blur-sm bg-black/20 border border-[#00f0ff]/20 rounded">Vision</span>
          </div>
          <div className="flex items-center gap-4 translate-x-4">
            <span className="w-16 h-px bg-[#00f0ff]/50" />
            <span style={{ padding: '0.25rem 0.75rem' }} className="backdrop-blur-sm bg-black/20 border border-[#00f0ff]/20 rounded">Motion</span>
          </div>
          <div className="flex items-center gap-4 -translate-x-8">
            <span className="w-20 h-px bg-[#00f0ff]/50" />
            <span style={{ padding: '0.25rem 0.75rem' }} className="backdrop-blur-sm bg-black/20 border border-[#00f0ff]/20 rounded">Decision</span>
          </div>
        </div>
      </div>

      {/* Foreground Content */}
      <div className="relative z-20 container mx-auto h-full pointer-events-none flex flex-col justify-center">

        <div ref={leftContentRef} className="w-full max-w-2xl pointer-events-auto">
          {/* Section Marker */}
          <div className="section-label">
            <span className="section-label-text">WHO I AM</span>
          </div>

          {/* Title */}
          <h2 ref={titleRef} className="section-heading flex flex-wrap gap-x-2 md:gap-x-4 gap-y-1 md:gap-y-2">
            {"Turning Ideas Into Intelligent Machines.".split(" ").map((word, i) => (
              <span key={i} className={`word ${word.includes("Intelligent") || word.includes("Machines") ? "text-[#00f0ff]" : ""}`}>
                {word}
              </span>
            ))}
          </h2>

          {/* Content */}
          <p className="section-body mb-8">
            I'm a robotics engineer passionate about building machines that can see, understand, move, and make decisions. I combine <strong>software, hardware, AI,</strong> and <strong>intelligent algorithms</strong> to transform ideas into practical robotic systems.
          </p>

          {/* MOBILE ONLY LABELS - Right below the text so there's no gap */}
          <div ref={labelsRefMobile} className="flex md:hidden flex-col gap-3 text-[#00f0ff] font-mono text-xs uppercase tracking-[0.3em] origin-left">
            <div className="flex items-center gap-4">
              <span className="w-8 h-px bg-[#00f0ff]/50" />
              <span style={{ padding: '0.25rem 0.75rem' }} className="backdrop-blur-sm bg-black/20 border border-[#00f0ff]/20 rounded">AI Core</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-12 h-px bg-[#00f0ff]/50" />
              <span style={{ padding: '0.25rem 0.75rem' }} className="backdrop-blur-sm bg-black/20 border border-[#00f0ff]/20 rounded">Vision</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-6 h-px bg-[#00f0ff]/50" />
              <span style={{ padding: '0.25rem 0.75rem' }} className="backdrop-blur-sm bg-black/20 border border-[#00f0ff]/20 rounded">Motion</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-10 h-px bg-[#00f0ff]/50" />
              <span style={{ padding: '0.25rem 0.75rem' }} className="backdrop-blur-sm bg-black/20 border border-[#00f0ff]/20 rounded">Decision</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
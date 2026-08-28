"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import Badge3D from "@/components/ui/Badge3D";
import Button3D from "@/components/ui/Button3D";

export default function HeroIntelligence() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline();

    // Animate badge
    tl.fromTo(".hero-badge",
      { y: -30, opacity: 0, rotateX: -90 },
      { y: 0, opacity: 1, rotateX: 0, duration: 1, ease: "back.out(1.7)" }
    );

    // Animate lines of text
    tl.fromTo(".hero-text-line",
      { y: 100, opacity: 0, rotateX: 90 },
      { y: 0, opacity: 1, rotateX: 0, duration: 1, stagger: 0.2, ease: "power3.out" },
      "-=0.5"
    );

    // Animate paragraph
    tl.fromTo(".hero-desc",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power2.out" },
      "-=0.5"
    );

    // Animate CTA
    tl.fromTo(".hero-cta",
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: "elastic.out(1, 0.5)" },
      "-=0.5"
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full h-screen min-h-[800px] flex flex-col justify-center overflow-hidden perspective-[1000px]">

      {/* Background Video */}
      <div className="absolute inset-0 z-0 flex items-center justify-center bg-black">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-60"
          src="/videos/hero-banner.webm"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center justify-center text-center">

        {/* 3D Section Badge */}
        <Badge3D text="NOVA INTELLIGENCE / 01" />

        {/* 3D Text Reveal */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tight leading-tight text-white drop-shadow-2xl mb-8 flex flex-col">
          <span className="block overflow-hidden pb-1"><span className="block hero-text-line opacity-0 origin-bottom">The Mind</span></span>
          <span className="block overflow-hidden pb-1"><span className="block hero-text-line opacity-0 origin-bottom">Behind The</span></span>
          <span className="block overflow-hidden pb-1"><span className="block hero-text-line opacity-0 origin-bottom text-[#00f0ff]">Machine.</span></span>
        </h1>

        <p className="hero-desc text-lg md:text-xl text-gray-300 font-light tracking-wide max-w-2xl mx-auto drop-shadow-xl mb-12 opacity-0">
          Intelligence designed to perceive, reason and act in the physical world.
        </p>

        {/* 3D CTA Button */}
        <Button3D text="Explore Intelligence" />

      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-50">
        <span className="text-[10px] uppercase tracking-[0.3em] text-white font-mono">System Init</span>
        <div className="w-[1px] h-16 bg-gradient-to-b from-white to-transparent"></div>
      </div>

    </section>
  );
}

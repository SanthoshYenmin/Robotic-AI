"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const containerRef = useRef<HTMLElement>(null);
  const footerContentRef = useRef<HTMLDivElement>(null);

  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Parallax effect for the giant text
    gsap.from(textRef.current, {
      y: 100,
      opacity: 0,
      duration: 1,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom bottom",
        scrub: 1,
      }
    });
  }, { scope: containerRef });

  return (
    <>
      {/* ── Massive Top Spacer to separate from previous section ── */}
      <div className="w-full h-[20vh] bg-[#0a0a0a]" />

      <footer ref={containerRef} className="relative w-full bg-[#020508] text-white overflow-hidden border-t border-white/5 flex flex-col justify-between" style={{ minHeight: '70vh' }}>
      
      {/* ── Background Glow ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[400px] bg-[#00f0ff] opacity-[0.04] blur-[120px] pointer-events-none rounded-full" />
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]"
        style={{ backgroundImage: "repeating-linear-gradient(to bottom,transparent,transparent 2px,rgba(0,0,0,1) 2px,rgba(0,0,0,1) 4px)" }}
      />

      {/* ── Main Content Grid ── */}
      <div ref={footerContentRef} className="container mx-auto px-6 md:px-12 pt-[120px] pb-8 relative z-20 flex-1 flex flex-col justify-between">
        
        {/* Top Section: CTA & Links */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-16 lg:gap-8 mb-24">
          
          {/* Left: CTA */}
          <div className="max-w-xl">
            <div className="section-label mb-6">
              <span className="section-label-text">CONNECT</span>
            </div>
            <h2 className="section-heading mb-6" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
              Ready to <br />
              <span className="heading-gradient">Build The Future?</span>
            </h2>
            <p className="section-body">
              Whether you need a custom robotics solution, AI integration, or autonomous systems architecture. Let's discuss your mission.
            </p>
          </div>

          {/* Right: Links */}
          <div className="flex gap-16 md:gap-24 font-mono text-xs tracking-widest uppercase">
            <div className="flex flex-col gap-6">
              <span className="text-white/30 mb-2">Navigation</span>
              {['Home', 'Figure'].map((link) => (
                <Link 
                  key={link} 
                  href={link === 'Home' ? '/' : '/figure'} 
                  className="text-white/60 hover:text-[#00f0ff] hover:translate-x-2 transition-all"
                >
                  {link}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-6">
              <span className="text-white/30 mb-2">Socials</span>
              {['GitHub ↗', 'LinkedIn ↗', 'Email ↗'].map((link) => (
                <a key={link} href="#" className="text-white/60 hover:text-[#00f0ff] hover:translate-x-2 transition-all">
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section: Copyright & Status */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-white/10 font-mono text-[10px] tracking-widest uppercase">
          <div className="text-white/40">
            &copy; 2026 —  NOVA ROBOTICS
          </div>
          <div className="flex items-center gap-3 text-[#00f0ff]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-pulse" />
            SYSTEM STATUS: OPERATIONAL
          </div>
        </div>

      </div>

      {/* ── Giant Background Text ── */}
      <div ref={textRef} className="absolute bottom-[-5%] left-0 w-full overflow-hidden flex justify-center pointer-events-none z-10 select-none">
        <h1 className="text-[25vw] leading-[0.75] font-black uppercase tracking-tighter stroke-text opacity-40 select-none">
          NOVA
        </h1>
      </div>

    </footer>
    </>
  );
}


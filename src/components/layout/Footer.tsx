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

  return (
    <div className="w-full px-4 md:px-8 pb-8 md:pb-12 pt-4">
      <footer ref={containerRef} className="relative bg-[#020810] text-white overflow-hidden pt-24 pb-16 rounded-3xl border border-white/10 shadow-[0_10px_40px_rgba(0,240,255,0.03)]">
        
        {/* ── Background Scanlines ── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.015]"
        style={{ backgroundImage: "repeating-linear-gradient(to bottom,transparent,transparent 2px,rgba(0,0,0,1) 2px,rgba(0,0,0,1) 4px)" }}
      />

      {/* ── Actual Footer Content ── */}
      <div ref={footerContentRef} className="container mx-auto spx flex flex-col w-full relative z-20 pointer-events-auto pt-16 pb-8">
        
        {/* Bottom Area */}
        <div className="w-full">
          {/* Bottom Links */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 pb-8">
            
            <div className="flex flex-wrap gap-12 md:gap-24">
              <div className="flex flex-col gap-5">
                {['WORK', 'ABOUT', 'TECHNOLOGY'].map((link) => (
                  <Link 
                    key={link} 
                    href={link === 'ABOUT' ? '/about' : `/#${link.toLowerCase()}`} 
                    className="font-mono text-sm tracking-[0.3em] text-white/60 hover:text-[#00f0ff] hover:scale-105 transform origin-left transition-all uppercase"
                  >
                    {link}
                  </Link>
                ))}
              </div>
              <div className="flex flex-col gap-5">
                {['PROCESS', 'FIGURE', 'CONTACT'].map((link) => (
                  <Link 
                    key={link} 
                    href={link === 'FIGURE' ? '/figure' : `/#${link.toLowerCase()}`} 
                    className="font-mono text-sm tracking-[0.3em] text-white/60 hover:text-[#00f0ff] hover:scale-105 transform origin-left transition-all uppercase"
                  >
                    {link}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-8 md:gap-12">
              <div className="flex flex-col gap-5 text-left md:text-right items-start md:items-end">
                {['GITHUB ↗', 'LINKEDIN ↗', 'EMAIL ↗'].map((link) => (
                  <a key={link} href="#" className="font-mono text-sm tracking-[0.3em] text-white/60 hover:text-[#00f0ff] hover:scale-105 transform origin-right transition-all uppercase">
                    {link}
                  </a>
                ))}
              </div>
            </div>

          </div>

          {/* Tiny Status Text (Now in flow, not absolute) */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full pointer-events-none pb-2 gap-4 mt-8 pt-6 border-t border-white/10">
            <div className="font-mono text-xs tracking-[0.4em] text-[#00f0ff] animate-pulse">
              SYSTEM STATUS: READY
            </div>
            <div className="font-mono text-xs tracking-[0.4em] text-white/40">
              &copy; 2026 — SANthosh &middot; NOVA ROBOTICS
            </div>
          </div>
        </div>

      </div>
      </footer>
    </div>
  );
}


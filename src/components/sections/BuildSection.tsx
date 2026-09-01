"use client";
import { useRef, useState, lazy, Suspense } from "react";
import { usePreloaderReady } from "@/hooks/usePreloaderReady";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import { motion, AnimatePresence, useInView } from "framer-motion";

const BuildCanvas = lazy(() => import("@/components/sections/_BuildCanvas"));
gsap.registerPlugin(ScrollTrigger);

const SCENES = [
  {
    id: 0,
    title: "Ready to Build\nSomething Autonomous?",
    desc: "Have an idea, a challenge, or a robotic system in mind? Let’s turn it into an intelligent machine that can perceive, decide, move, and adapt.",
    support: "From concept and simulation to a working autonomous system — let’s build what’s next."
  }
];

export default function BuildSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [stage, setStage] = useState(0);
  const progressRef = useRef({ value: 0 });
  const isMounted = usePreloaderReady();
  const isInView = useInView(sectionRef, { margin: "2000px 0px 2000px 0px" });

  useGSAP(() => {
    if (!isMounted) return;
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=5000",
        pin: true,
        scrub: 1.5,
        refreshPriority: 5,
        onUpdate(self) {
          progressRef.current.value = self.progress * 5;
          const s = self.progress < 0.02 ? 0 : Math.min(4, Math.floor(self.progress * 5));
          setStage(prev => {
            if (prev !== s) return s;
            return prev;
          });
        },
      },
    });
    tl.to({}, { duration: 5 });
  }, { scope: sectionRef, dependencies: [isMounted] });

  const isFinal = stage >= 4;

  return (
    <section ref={sectionRef} className="relative w-full h-screen bg-black text-white overflow-hidden">
      
      {/* ── Background: 3D Scene ── */}
      <div className="absolute inset-0 z-0 bg-black">
        <Suspense fallback={<div className="absolute inset-0 bg-black" />}>
          {isInView && <BuildCanvas progressRef={progressRef} />}
        </Suspense>
      </div>

      {/* ── Overlay for text readability (Scenes 0-3) ── */}
      <AnimatePresence>
        {!isFinal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10 pointer-events-none md:w-1/2"
          />
        )}
      </AnimatePresence>

      {/* ── Final Scene Fade out overlay ── */}
      <AnimatePresence>
        {isFinal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-black z-10 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* ── Section Label (06 / LET'S BUILD) ── */}
      <div className="absolute z-30 pointer-events-none spx-l" style={{ top: "80px" }}>
        <div className="section-label">
          <span className="section-label-num">06</span>
          <div className="section-label-divider" />
          <span className="section-label-text">LET'S BUILD</span>
        </div>
      </div>

      {/* ── Scene 01-03: Left Side Text ── */}
      <div className="absolute inset-0 z-30 pointer-events-none flex flex-col">
        <AnimatePresence mode="wait">
          {(!isFinal && stage >= 0) && (
            <motion.div
              key="intro-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute top-[160px] spx-l max-w-lg pointer-events-auto"
            >
              <h2 className="section-heading mb-6 whitespace-pre-line">{SCENES[0].title}</h2>
              <p className="section-body mb-6">{SCENES[0].desc}</p>
              <p className="section-body text-white/40 italic">{SCENES[0].support}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Scene 04-05: Final CTA (Center) ── */}
      <div className="absolute inset-0 z-40 pointer-events-none flex flex-col items-center justify-center">
        <AnimatePresence>
          {isFinal && (
            <motion.div
              key="cta-center"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              className="flex flex-col items-center text-center pointer-events-auto px-6"
            >
              <div className="font-mono text-[10px] tracking-[0.5em] text-[#00f0ff] mb-8 uppercase animate-pulse flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00ff88]" />
                SYSTEM READY
              </div>
              <h2 className="section-heading mb-12" style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}>
                Ready to Build<br/>Something Autonomous?
              </h2>

              <a href="#" className="font-mono text-xs tracking-widest text-white/50 hover:text-white transition-colors flex items-center gap-2">
                LET'S CONNECT <span>↗</span>
              </a>
              
              <div className="mt-16 text-white/30 font-light text-sm italic tracking-wide">
                Ideas become intelligent machines when we build them.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
    </section>
  );
}

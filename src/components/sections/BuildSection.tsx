"use client";
import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// Lazy-load the heavy 3D canvas so it never blocks SSR
const BuildCanvas = dynamic(() => import("@/components/sections/_BuildCanvas"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[#020810]" />,
});

gsap.registerPlugin(ScrollTrigger);

// ─── Stage data ────────────────────────────────────────────────────────────────
const STAGES = [
  {
    phase: "DORMANT",
    title: "Ready to Build\nSomething Autonomous?",
    desc: "From the first idea to a fully working robotic system — complex challenges become intelligent machines built to perceive, decide, move, and adapt.",
  },
  {
    phase: "INTELLIGENCE ACTIVATES",
    title: "The System\nComes Online.",
    desc: "Perception, decision-making, and autonomy. The foundations of every robot I build.",
    labels: [
      { text: "PERCEPTION",   top: "20%", left: "8%"  },
      { text: "INTELLIGENCE", top: "32%", left: "72%" },
      { text: "MOVEMENT",     top: "68%", left: "6%"  },
      { text: "AUTONOMY",     top: "78%", left: "74%" },
    ],
  },
  {
    phase: "ASSEMBLY",
    title: "Components\nConnecting.",
    desc: "Every part has a purpose. Every connection enables a new capability.",
    parts: [
      { text: "◈ CAMERA",  top: "14%", left: "44%" },
      { text: "◈ ARM-L",   top: "45%", left: "4%"  },
      { text: "◈ ARM-R",   top: "45%", left: "78%" },
      { text: "◈ CPU",     top: "80%", left: "44%" },
      { text: "◈ SENSOR",  top: "28%", left: "76%" },
      { text: "◈ GRIPPER", top: "68%", left: "77%" },
    ],
  },
  {
    phase: "AUTONOMOUS",
    title: "From an Idea\nTo an Autonomous Machine.",
    desc: "The system is live. Sensors active. Intelligence online. Ready to operate in the real world.",
  },
  {
    phase: "DEPLOY",
    title: "Let's Build.",
    desc: "Have a problem worth solving? Let's design the system, build the intelligence, and bring it to life.",
    cta: true,
  },
];

// ─── Component ─────────────────────────────────────────────────────────────────
export default function BuildSection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const [stage, setStage] = useState(-1);
  const progressRef = useRef({ value: 0 });

  useGSAP(() => {
    gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=5000",
        pin: true,
        scrub: 1.5,
        refreshPriority: 5,
        onUpdate(self) {
          progressRef.current.value = self.progress * 5;
          const s = self.progress < 0.02 ? -1 : Math.min(4, Math.floor(self.progress * 5));
          setStage(s);
        },
      },
    }).to({}, { duration: 5 });
  }, { scope: sectionRef });

  const cur = STAGES[Math.max(0, stage)];
  const isFinal = stage >= 4;

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen bg-[#020810] text-white overflow-hidden"
    >
      {/* ── 3D canvas ── */}
      <div className="absolute inset-0 z-0">
        <BuildCanvas progressRef={progressRef} />
      </div>

      {/* ── Scanlines ── */}
      <div
        className="absolute inset-0 z-10 pointer-events-none opacity-[0.018]"
        style={{ backgroundImage: "repeating-linear-gradient(to bottom,transparent,transparent 2px,rgba(0,0,0,1) 2px,rgba(0,0,0,1) 4px)" }}
      />

      {/* ── Dark vignette ── */}
      <div className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(2,8,16,0.8) 100%)" }} />

      {/* ── Final black overlay ── */}
      <AnimatePresence>
        {isFinal && (
          <motion.div
            key="blackout"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.88 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 bg-[#020810] z-20 pointer-events-none"
          />
        )}
      </AnimatePresence>



      {/* ── Intelligence labels (stage 1) ── */}
      <AnimatePresence>
        {stage === 1 && cur?.labels?.map((lbl, i) => (
          <motion.div
            key={lbl.text}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: i * 0.18, duration: 0.4 }}
            className="absolute z-25 pointer-events-none font-mono text-[9px] tracking-[0.4em] text-[#00f0ff] flex items-center gap-1.5"
            style={{ top: lbl.top, left: lbl.left }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-pulse" />
            {lbl.text}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* ── Assembly part labels (stage 2) ── */}
      <AnimatePresence>
        {stage === 2 && cur?.parts?.map((pt, i) => (
          <motion.div
            key={pt.text}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            exit={{ opacity: 0 }}
            transition={{ delay: i * 0.12 }}
            className="absolute z-25 pointer-events-none font-mono text-[9px] tracking-[0.3em] text-white/60 border border-white/10 px-2 py-1 bg-black/25 backdrop-blur-sm"
            style={{ top: pt.top, left: pt.left }}
          >
            {pt.text}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* ── Autonomous status bar (stage 3) ── */}
      <AnimatePresence>
        {stage === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-8 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
          >
            <div className="flex items-center gap-6 px-6 py-2 border border-[#00f0ff]/30 bg-[#00f0ff]/5 backdrop-blur-md">
              {["SENSORS: ACTIVE", "AI: ONLINE", "MOTORS: ENGAGED"].map((s) => (
                <div key={s} className="font-mono text-[9px] tracking-[0.3em] text-[#00f0ff] flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#00ff88] animate-pulse" />
                  {s}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Top-Left: Section Label ── */}
      <div className="absolute z-30 pointer-events-none spx-l" style={{ top: "80px" }}>
        <div className="section-label">
          <span className="section-label-num">07</span>
          <div className="section-label-divider" />
          <span className="section-label-text">06 / LET&apos;S BUILD</span>
        </div>
      </div>

      {/* ── Top-Right: Telemetry (Stages 0-3) ── */}
      <AnimatePresence>
        {!isFinal && stage >= 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-[80px] right-6 md:right-12 z-30 font-mono text-[9px] md:text-[10px] tracking-widest text-[#00f0ff] opacity-70 text-right pointer-events-none"
          >
            <div className="mb-2">ASSEMBLY BAY: 04</div>
            <div className="mb-2">STATUS: {cur?.phase || "DORMANT"}</div>
            <div className="mb-2">INTEGRITY: {(stage * 25).toString().padStart(3, '0')}%</div>
            <div className="animate-pulse">UPLINK: ACTIVE</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Dynamic Layout (Stage Text) ── */}
      <div className="absolute inset-0 z-30 pointer-events-none flex flex-col">
        <AnimatePresence mode="wait">
          {/* STAGES 0-3: Top-Left Alignment */}
          {!isFinal && stage >= 0 && (
            <motion.div
              key={`stage-${stage}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute top-[160px] spx-l max-w-md pointer-events-auto"
            >
              <div className="font-mono text-[9px] tracking-[0.4em] text-[#00f0ff] mb-3 uppercase">
                {cur?.phase}
              </div>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-[1.05] text-white mb-4">
                {cur?.title}
              </h2>
              <p className="text-sm font-light leading-relaxed text-white/50 max-w-sm">
                {cur?.desc}
              </p>
            </motion.div>
          )}

          {/* STAGE 4 (FINAL): Center Alignment */}
          {isFinal && (
            <motion.div
              key="stage-final"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-auto z-40 px-6"
            >
              <div className="font-mono text-[10px] tracking-[0.5em] text-[#00f0ff] mb-6 uppercase animate-pulse">
                SYSTEM DEPLOYMENT READY
              </div>
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none text-white mb-6">
                {cur?.title}
              </h2>
              <p className="text-base md:text-lg font-light leading-relaxed text-white/60 max-w-2xl mb-10">
                {cur?.desc}
              </p>
              
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <Link
                  href="/contact"
                  className="group relative flex items-center gap-4 px-10 py-5 bg-[#00f0ff] text-black font-bold text-sm uppercase tracking-widest transition-all duration-300 hover:bg-white hover:scale-[1.03] shadow-[0_0_30px_rgba(0,240,255,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.5)]"
                >
                  START A PROJECT →
                </Link>
                <a
                  href="mailto:hello@novarobotics.dev"
                  className="flex items-center gap-3 px-10 py-5 border border-white/20 text-white font-medium text-sm uppercase tracking-widest transition-all duration-300 hover:border-[#00f0ff] hover:text-[#00f0ff] bg-black/50 backdrop-blur-md"
                >
                  LET&apos;S CONNECT ↗
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Stage progress indicator — right edge ── */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3 pointer-events-none">
        {STAGES.map((s, i) => (
          <div
            key={s.phase}
            className="rounded-full transition-all duration-500"
            style={{
              width: 6,
              height: i === stage ? 28 : 6,
              background: i <= stage ? "#00f0ff" : "rgba(255,255,255,0.12)",
              boxShadow: i === stage ? "0 0 10px #00f0ff" : "none",
            }}
          />
        ))}
      </div>
    </section>
  );
}

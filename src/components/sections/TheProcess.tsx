"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Canvas } from "@react-three/fiber";
import ProcessLab from "../three/ProcessLab";
import { motion, AnimatePresence } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

// ─── Stage data ───────────────────────────────────────────────
const STAGES = [
  {
    id: "01",
    phase: "IMAGINE",
    codename: "MISSION BRIEF",
    desc: "Target location locked. Objective parameters set. Mission authorised.",
    telemetry: { objective: "LOCKED", path: "PENDING", sensor: "OFFLINE", ai: "STANDBY" },
    color: "#00f0ff",
    image: "/images/process/stage-01-imagine.jfif",
  },
  {
    id: "02",
    phase: "DESIGN",
    codename: "BLUEPRINT SCAN",
    desc: "Engineering scan complete. Sensor array mapped. Hardware layout finalised.",
    telemetry: { objective: "LOCKED", path: "CALCULATING", sensor: "CALIBRATING", ai: "STANDBY" },
    color: "#00f0ff",
    image: "/images/process/stage-02-design.jfif",
  },
  {
    id: "03",
    phase: "SIMULATE",
    codename: "DIGITAL TWIN",
    desc: "Virtual environment active. Obstacle avoidance running. Path optimised.",
    telemetry: { objective: "LOCKED", path: "OPTIMISED", sensor: "ACTIVE", ai: "LEARNING" },
    color: "#ffaa00",
    image: "/images/process/stage-03-simulate.jfif",
  },
  {
    id: "04",
    phase: "BUILD",
    codename: "MATERIALISE",
    desc: "Blueprint transferred to hardware. Virtual → Physical. Integration complete.",
    telemetry: { objective: "CONFIRMED", path: "LOADED", sensor: "ONLINE", ai: "LOADING" },
    color: "#00f0ff",
    image: "/images/process/stage-04-build.jfif",
  },
  {
    id: "05",
    phase: "TRAIN",
    codename: "AI TRAINING",
    desc: "Neural model active. Object recognition at 98.7%. Behaviours learned.",
    telemetry: { objective: "CONFIRMED", path: "READY", sensor: "SCANNING", ai: "ACTIVE" },
    color: "#00ff88",
    image: "/images/process/stage-05-train.jfif",
  },
  {
    id: "06",
    phase: "DEPLOY",
    codename: "AUTONOMOUS MODE",
    desc: "All systems nominal. Robot deployed. Mission in progress. No human input required.",
    telemetry: { objective: "IN PROGRESS", path: "EXECUTING", sensor: "LIVE", ai: "AUTONOMOUS" },
    color: "#ff4444",
    image: "/images/process/stage-06-deploy.jfif",
  },
];

type TelemetryKey = "objective" | "path" | "sensor" | "ai";

const STATUS_COLORS: Record<string, string> = {
  LOCKED: "#00f0ff",
  PENDING: "#ffffff44",
  OFFLINE: "#ffffff22",
  STANDBY: "#ffffff44",
  CALCULATING: "#ffaa00",
  CALIBRATING: "#ffaa00",
  OPTIMISED: "#00ff88",
  ACTIVE: "#00ff88",
  LEARNING: "#00ff88",
  CONFIRMED: "#00f0ff",
  LOADED: "#00f0ff",
  ONLINE: "#00ff88",
  LOADING: "#ffaa00",
  READY: "#00ff88",
  SCANNING: "#00ff88",
  "IN PROGRESS": "#ff4444",
  EXECUTING: "#ff4444",
  LIVE: "#00ff88",
  AUTONOMOUS: "#ff4444",
};

// ─── Telemetry row component ───────────────────────────────────
function TelRow({ label, value }: { label: string; value: string }) {
  const col = STATUS_COLORS[value] ?? "#ffffff66";
  return (
    <div className="flex items-center justify-between gap-3 py-1.5 border-b border-white/5">
      <span className="font-mono text-[10px] text-white/40 uppercase tracking-[0.2em]">{label}</span>
      <span className="font-mono text-[10px] tracking-widest flex items-center gap-1.5" style={{ color: col }}>
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: col, boxShadow: `0 0 4px ${col}` }}
        />
        {value}
      </span>
    </div>
  );
}

// ─── Main section ──────────────────────────────────────────────
export default function TheProcess() {
  const sectionRef = useRef<HTMLElement>(null);
  const [stage, setStage] = useState(-1); // -1 = before entering

  const progressRef = useRef({ value: 0 });

  // ── GSAP pin:true — most reliable approach when other sections above also use GSAP pin
  // GSAP handles position tracking, pin-spacer creation, and scroll progress internally.
  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=6000",
        pin: true,        // GSAP pins the section and creates the scroll spacer
        scrub: 1,
        refreshPriority: 5,
        onUpdate: (self) => {
          progressRef.current.value = self.progress * 6;
          const s = self.progress < 0.005 ? -1 : Math.min(5, Math.floor(self.progress * 6));
          setStage(s);
        },
      }
    });
    // Empty tween drives the timeline duration (6 units for 6 stages)
    tl.to({}, { duration: 6 });
  });

  const current = STAGES[Math.max(0, stage)];

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen bg-[#02080a] text-white overflow-hidden"
    >
      {/* All content sits inside — GSAP makes it fill viewport during pin */}
      <div className="absolute inset-0">

        {/* 3D Canvas */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Canvas camera={{ position: [0, 3, 9], fov: 50 }} gl={{ alpha: true, antialias: true }}>
            <ProcessLab progressRef={progressRef} />
          </Canvas>
        </div>

        {/* ── DEBUG: scroll progress bar ── */}
        <div className="absolute top-0 left-0 w-full h-0.5 bg-white/10 z-50 pointer-events-none">
          <div
            className="h-full bg-[#00f0ff] transition-none"
            style={{ width: `${((Math.max(0, stage) / 5) * 100)}%` }}
          />
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none font-mono text-[10px] text-white/40 tracking-widest">
          STAGE {stage} / PROGRESS {progressRef.current.value.toFixed(2)}
        </div>

        {/* ════════════════════════════════════════
            DESKTOP LAYOUT
        ════════════════════════════════════════ */}
        <div className="hidden md:grid absolute inset-0 z-10" style={{ gridTemplateColumns: "280px 1fr 240px" }}>

          {/* ── Left: Stage info ── */}
          <div className="flex flex-col justify-between px-8 md:px-12 pointer-events-none" style={{ paddingTop: '128px', paddingBottom: '128px' }}>

            {/* Mission header */}
            <div>
              <div className="font-mono text-[9px] text-white/30 tracking-[0.4em] uppercase mb-1">
                MISSION 001
              </div>
              <div className="font-mono text-[9px] text-[#00f0ff] tracking-[0.3em] uppercase mb-6">
                AUTONOMOUS SYSTEM
              </div>

              {/* Stage number & phase */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={stage}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="font-mono text-[9px] tracking-[0.4em] mb-1" style={{ color: current?.color ?? "#00f0ff" }}>
                    {current?.id ?? "00"} / {current?.codename ?? "INITIALISING"}
                  </div>
                  <h2
                    className="text-5xl font-black uppercase tracking-tighter leading-none mb-4"
                    style={{ textShadow: `0 0 30px ${current?.color ?? "#00f0ff"}44` }}
                  >
                    {current?.phase ?? "—"}
                  </h2>
                  <p className="text-white/50 text-sm font-light leading-relaxed max-w-[220px]">
                    {current?.desc ?? "Waiting for mission start…"}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Stage progress dots */}
            <div>
              <div className="font-mono text-[8px] text-white/25 tracking-[0.3em] mb-3 uppercase">
                Stage Progress
              </div>
              <div className="flex gap-2.5 items-center">
                {STAGES.map((s, i) => (
                  <div key={s.id} className="flex flex-col items-center gap-1">
                    <div
                      className="transition-all duration-500"
                      style={{
                        width: i === stage ? 10 : 6,
                        height: i === stage ? 10 : 6,
                        borderRadius: "50%",
                        background: i <= stage ? (s.color) : "rgba(255,255,255,0.1)",
                        boxShadow: i === stage ? `0 0 8px ${s.color}` : "none",
                      }}
                    />
                    <span
                      className="font-mono text-[7px] tracking-wider"
                      style={{ color: i <= stage ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)" }}
                    >
                      {s.id}
                    </span>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="mt-3 w-full h-px bg-white/10 relative">
                <motion.div
                  className="absolute top-0 left-0 h-full"
                  style={{ background: "linear-gradient(to right, #00f0ff, #0088ff)" }}
                  animate={{ width: `${((Math.max(0, stage) / 5) * 100)}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>
          </div>

          {/* ── Centre: transparent, shows 3D canvas ── */}
          <div />

          {/* ── Right: Mission telemetry ── */}
          <div className="flex flex-col justify-center p-8 pointer-events-none">
            <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-sm overflow-hidden">

              {/* Stage image */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`img-${stage}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-full overflow-hidden"
                  style={{ aspectRatio: '16/9' }}
                >
                  {current?.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={current.image}
                      alt={current.phase}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {/* Overlay tint matching stage colour */}
                  <div
                    className="absolute inset-0"
                    style={{ background: `linear-gradient(to top, ${current?.color ?? '#00f0ff'}33 0%, transparent 60%)` }}
                  />
                  {/* Stage label on image */}
                  <div
                    className="absolute bottom-2 left-3 font-mono text-[9px] tracking-[0.3em] uppercase"
                    style={{ color: current?.color ?? '#00f0ff' }}
                  >
                    {current?.id} / {current?.codename}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Telemetry rows */}
              <div className="p-5">
                <div className="font-mono text-[8px] text-[#00f0ff] tracking-[0.4em] uppercase mb-4 pb-2 border-b border-white/10">
                  Mission Status
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={stage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-0"
                  >
                    {(["objective", "path", "sensor", "ai"] as TelemetryKey[]).map((key) => (
                      <TelRow
                        key={key}
                        label={key}
                        value={current?.telemetry[key] ?? "—"}
                      />
                    ))}
                  </motion.div>
                </AnimatePresence>

                {/* Live coordinates */}
                <div className="mt-4 pt-3 border-t border-white/5">
                  <div className="font-mono text-[8px] text-white/25 tracking-widest">
                    LAT 13.0827° N
                  </div>
                  <div className="font-mono text-[8px] text-white/25 tracking-widest mt-0.5">
                    LON 80.2707° E
                  </div>
                  <div
                    className="font-mono text-[8px] tracking-widest mt-2 animate-pulse"
                    style={{ color: stage >= 0 ? "#00ff88" : "#ffffff22" }}
                  >
                    {stage >= 0 ? "● SYSTEM ACTIVE" : "○ AWAITING"}
                  </div>
                </div>
              </div>
            </div>

            {/* Final deploy message */}
            <AnimatePresence>
              {stage === 5 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mt-4 bg-[#ff4444]/10 border border-[#ff4444]/40 p-4 rounded-sm text-center"
                >
                  <div className="font-mono text-[9px] text-[#ff4444] tracking-[0.3em] uppercase">
                    FROM IDEA → AUTONOMY
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ════════════════════════════════════════
            MOBILE LAYOUT
        ════════════════════════════════════════ */}
        <div className="md:hidden absolute inset-0 z-10 flex flex-col justify-between p-6">

          {/* Top HUD */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-mono text-[8px] text-white/30 tracking-[0.3em]">MISSION 001</div>
              <div className="font-mono text-[8px] text-[#00f0ff] tracking-[0.3em]">AUTONOMOUS SYSTEM</div>
            </div>
            <div
              className="font-mono text-[8px] tracking-widest animate-pulse"
              style={{ color: stage >= 0 ? "#00ff88" : "#ffffff33" }}
            >
              {stage >= 0 ? "● ACTIVE" : "○ STANDBY"}
            </div>
          </div>

          {/* Stage card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.97 }}
              transition={{ duration: 0.35 }}
              className="bg-black/60 backdrop-blur-md border border-white/10 rounded-sm overflow-hidden pointer-events-none"
            >
              {/* Stage image on mobile */}
              {current?.image && (
                <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={current.image}
                    alt={current.phase}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: `linear-gradient(to top, ${current.color}44 0%, transparent 60%)` }}
                  />
                </div>
              )}

              <div className="p-5">
                <div
                  className="font-mono text-[9px] tracking-[0.4em] uppercase mb-2"
                  style={{ color: current?.color ?? "#00f0ff" }}
                >
                  {current?.id ?? "00"} / {current?.codename ?? "INITIALISING"}
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tighter leading-none mb-3">
                  {current?.phase ?? "—"}
                </h3>
                <p className="text-white/55 text-xs leading-relaxed mb-4">{current?.desc}</p>

                {/* Mini telemetry */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {(["objective", "path", "sensor", "ai"] as TelemetryKey[]).map((key) => (
                    <TelRow key={key} label={key} value={current?.telemetry[key] ?? "—"} />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Stage dots */}
          <div className="flex gap-3 justify-center items-center">
            {STAGES.map((s, i) => (
              <div key={s.id} className="flex flex-col items-center gap-1">
                <div
                  className="transition-all duration-500 rounded-full"
                  style={{
                    width: i === stage ? 10 : 6,
                    height: i === stage ? 10 : 6,
                    background: i <= stage ? s.color : "rgba(255,255,255,0.12)",
                    boxShadow: i === stage ? `0 0 8px ${s.color}` : "none",
                  }}
                />
                <span className="font-mono text-[7px]" style={{ color: i <= stage ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.2)" }}>
                  {s.id}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Scan-line overlay (subtle CRT effect) ── */}
        <div
          className="absolute inset-0 z-20 pointer-events-none opacity-[0.015]"
          style={{
            backgroundImage: "repeating-linear-gradient(to bottom, transparent, transparent 2px, rgba(0,0,0,1) 2px, rgba(0,0,0,1) 4px)",
          }}
        />
      </div>
    </section>
  );
}

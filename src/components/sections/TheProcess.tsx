"use client";

import { useRef, Suspense, useState } from "react";
import { usePreloaderReady } from "@/hooks/usePreloaderReady";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import { View, PerspectiveCamera } from "@react-three/drei";
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
    image: import.meta.env.BASE_URL + "images/process/stage-01-imagine.jfif",
  },
  {
    id: "02",
    phase: "DESIGN",
    codename: "BLUEPRINT SCAN",
    desc: "Engineering scan complete. Sensor array mapped. Hardware layout finalised.",
    telemetry: { objective: "LOCKED", path: "CALCULATING", sensor: "CALIBRATING", ai: "STANDBY" },
    color: "#00f0ff",
    image: import.meta.env.BASE_URL + "images/process/stage-02-design.jfif",
  },
  {
    id: "03",
    phase: "SIMULATE",
    codename: "DIGITAL TWIN",
    desc: "Virtual environment active. Obstacle avoidance running. Path optimised.",
    telemetry: { objective: "LOCKED", path: "OPTIMISED", sensor: "ACTIVE", ai: "LEARNING" },
    color: "#ffaa00",
    image: import.meta.env.BASE_URL + "images/process/stage-03-simulate.jfif",
  },
  {
    id: "04",
    phase: "BUILD",
    codename: "MATERIALISE",
    desc: "Blueprint transferred to hardware. Virtual → Physical. Integration complete.",
    telemetry: { objective: "CONFIRMED", path: "LOADED", sensor: "ONLINE", ai: "LOADING" },
    color: "#00f0ff",
    image: import.meta.env.BASE_URL + "images/process/stage-04-build.jfif",
  },
  {
    id: "05",
    phase: "TRAIN",
    codename: "AI TRAINING",
    desc: "Neural model active. Object recognition at 98.7%. Behaviours learned.",
    telemetry: { objective: "CONFIRMED", path: "READY", sensor: "SCANNING", ai: "ACTIVE" },
    color: "#00ff88",
    image: import.meta.env.BASE_URL + "images/process/stage-05-train.jfif",
  },
  {
    id: "06",
    phase: "DEPLOY",
    codename: "AUTONOMOUS MODE",
    desc: "All systems nominal. Robot deployed. Mission in progress. No human input required.",
    telemetry: { objective: "IN PROGRESS", path: "EXECUTING", sensor: "LIVE", ai: "AUTONOMOUS" },
    color: "#ff4444",
    image: import.meta.env.BASE_URL + "images/process/stage-06-deploy.jfif",
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
    <div style={{ padding: '0.6rem 0' }} className="flex items-center justify-between gap-3 border-b border-white/5">
      <span className="font-mono text-[10px] leading-none text-white/40 uppercase tracking-[0.2em]">{label}</span>
      <span className="font-mono text-[10px] leading-none tracking-widest flex items-center gap-2" style={{ color: col }}>
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
  const isMounted = usePreloaderReady();

  const progressRef = useRef({ value: 0 });

  // ── GSAP pin:true — most reliable approach when other sections above also use GSAP pin
  // GSAP handles position tracking, pin-spacer creation, and scroll progress internally.
  useGSAP(() => {
    if (!isMounted) return;
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=6000",
        pin: true,        // GSAP pins the section and creates the scroll spacer
        scrub: 1,
        refreshPriority: 5,
        onUpdate: (self) => {
          const val = self.progress * 6;
          progressRef.current.value = val;
          const s = self.progress < 0.005 ? -1 : Math.min(5, Math.floor(val));
          setStage(s);

          // Update DOM directly for smooth text without React re-render overhead
          const textEl = document.getElementById("process-progress-text");
          if (textEl) {
            textEl.innerText = `STAGE ${Math.max(0, s)} / PROGRESS ${val.toFixed(2)}`;
          }
          const barEl = document.getElementById("process-progress-bar");
          if (barEl) {
            barEl.style.width = `${(Math.max(0, s) / 5) * 100}%`;
          }
        },
      }
    });
    // Empty tween drives the timeline duration (6 units for 6 stages)
    tl.to({}, { duration: 6 });
  }, { scope: sectionRef, dependencies: [isMounted] });

  const current = STAGES[Math.max(0, stage)];

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen bg-transparent text-white overflow-hidden"
    >
      {/* All content sits inside — GSAP makes it fill viewport during pin */}
      <div className="absolute inset-0">

        {/* 3D Canvas */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <View className="absolute inset-0 w-full h-full pointer-events-none">
            <PerspectiveCamera makeDefault position={[0, 3, 9]} fov={50} onUpdate={c => c.lookAt(0, 0, 0)} />
            <Suspense fallback={null}>
              <ProcessLab progressRef={progressRef} />
            </Suspense>
          </View>
        </div>

        {/* ── DEBUG: scroll progress bar ── */}
        <div className="absolute top-0 left-0 w-full h-0.5 bg-white/10 z-50 pointer-events-none">
          <div
            id="process-progress-bar"
            className="h-full bg-[#00f0ff] transition-none"
            style={{ width: `${((Math.max(0, stage) / 5) * 100)}%` }}
          />
        </div>
        <div
          id="process-progress-text"
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none font-mono text-[10px] text-white/40 tracking-widest"
        >
          STAGE {Math.max(0, stage)} / PROGRESS {progressRef.current.value.toFixed(2)}
        </div>

        {/* ════════════════════════════════════════
            DESKTOP LAYOUT
        ════════════════════════════════════════ */}
        <div className="hidden md:flex absolute inset-0 z-10 justify-between w-full pointer-events-none">

          {/* ── Left: Stage info ── */}
          <div className="flex flex-col justify-between h-full" style={{ paddingLeft: 'var(--section-px)', paddingRight: '2rem', paddingTop: '128px', paddingBottom: '128px', width: 'clamp(320px, 30vw, 420px)' }}>

            {/* Mission header */}
            <div>
              <div className="section-label mb-8">
                <span className="section-label-text">THE PROCESS</span>
              </div>

              {/* Stage number & phase */}
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={stage}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="font-mono text-[10px] tracking-[0.4em] mb-2" style={{ color: current?.color ?? "#00f0ff" }}>
                    {current?.id ?? "00"} / {current?.codename ?? "INITIALISING"}
                  </div>
                  <h2
                    className="section-heading mb-6"
                    style={{ textShadow: `0 0 30px ${current?.color ?? "#00f0ff"}44` }}
                  >
                    {current?.phase ?? "—"}
                  </h2>
                  <p className="section-body">
                    {current?.desc ?? "Waiting for mission start…"}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Stage progress dots */}
            <div>
              <div className="font-mono text-[9px] text-white/30 tracking-[0.3em] mb-4 uppercase">
                Stage Progress
              </div>
              <div className="flex gap-3 items-center">
                {STAGES.map((s, i) => (
                  <div key={s.id} className="flex flex-col items-center gap-2">
                    <div
                      className="transition-all duration-500 rounded-full"
                      style={{
                        width: i === stage ? 12 : 8,
                        height: i === stage ? 12 : 8,
                        background: i <= stage ? (s.color) : "rgba(255,255,255,0.1)",
                        boxShadow: i === stage ? `0 0 10px ${s.color}` : "none",
                      }}
                    />
                    <span
                      className="font-mono text-[8px] tracking-wider"
                      style={{ color: i <= stage ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.3)" }}
                    >
                      {s.id}
                    </span>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="mt-4 w-full h-px bg-white/10 relative">
                <motion.div
                  className="absolute top-0 left-0 h-full"
                  style={{ background: "linear-gradient(to right, #00f0ff, #0088ff)" }}
                  animate={{ width: `${((Math.max(0, stage) / 5) * 100)}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>
          </div>

          {/* ── Right: Mission telemetry ── */}
          <div className="flex flex-col justify-center h-full" style={{ paddingRight: 'var(--section-px)', width: 'clamp(280px, 25vw, 360px)' }}>
            <div
              className="bg-[#050c12]/80 backdrop-blur-xl border border-[#00f0ff]/10 rounded-sm overflow-hidden shadow-[0_0_30px_rgba(0,240,255,0.05)]"
              style={{ maxHeight: 'calc(100vh - 80px)', overflowY: 'auto' }}
            >

              {/* Stage image */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`img-${stage}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-full overflow-hidden border-b border-white/5"
                  style={{ height: '160px' }}
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
                    className="absolute bottom-3 left-4 flex items-center justify-center bg-black/80 backdrop-blur-md rounded-md border border-white/10"
                    style={{ padding: '0.4rem 0.75rem', color: current?.color ?? '#00f0ff' }}
                  >
                    <span 
                      className="font-mono text-[10px] uppercase leading-none" 
                      style={{ letterSpacing: '0.3em', marginRight: '-0.3em', marginTop: '1px' }}
                    >
                      {current?.id} / {current?.codename}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Telemetry rows */}
              <div style={{ padding: '1.5rem' }}>
                <div 
                  className="font-mono text-[9px] leading-none text-[#00f0ff] tracking-[0.4em] uppercase border-b border-white/10 flex items-center gap-2"
                  style={{ paddingBottom: '1rem', marginBottom: '1rem' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-pulse" />
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
                <div className="flex flex-col gap-1" style={{ marginTop: '1rem' }}>
                  <div className="font-mono text-[10px] text-white/50 tracking-widest leading-relaxed">
                    LAT 13.0827° N
                  </div>
                  <div className="font-mono text-[10px] text-white/50 tracking-widest leading-relaxed mb-2">
                    LON 80.2707° E
                  </div>
                  <div
                    className="font-mono text-[9px] tracking-[0.2em] animate-pulse uppercase flex items-center gap-2"
                    style={{ color: stage >= 0 ? "#00ff88" : "#ffffff22" }}
                  >
                    {stage >= 0 ? "● SYSTEM ACTIVE" : "○ AWAITING DEPLOYMENT"}
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
                  style={{ padding: '1rem' }}
                  className="mt-4 bg-[#ff4444]/10 border border-[#ff4444]/40 rounded-sm text-center"
                >
                  <div className="font-mono text-[10px] text-[#ff4444] tracking-[0.3em] uppercase">
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
        <div style={{ padding: '1.5rem' }} className="md:hidden absolute inset-0 z-10 flex flex-col justify-between">

          {/* Top HUD */}
          <div className="flex items-center justify-between">
            <div className="section-label mb-0 scale-90 origin-left">
              <span className="section-label-text">PROCESS</span>
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

              <div style={{ padding: '1.25rem' }}>
                <div
                  className="font-mono text-[9px] tracking-[0.4em] uppercase mb-2"
                  style={{ color: current?.color ?? "#00f0ff" }}
                >
                  {current?.id ?? "00"} / {current?.codename ?? "INITIALISING"}
                </div>
                <h3 className="section-heading mb-3" style={{ fontSize: "2rem" }}>
                  {current?.phase ?? "—"}
                </h3>
                <p className="section-body text-xs mb-4">{current?.desc}</p>

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

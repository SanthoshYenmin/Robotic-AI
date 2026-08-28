"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";

const AboutCanvas = dynamic(() => import("@/components/three/AboutCanvas"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[#020810]" />,
});

gsap.registerPlugin(ScrollTrigger);

const STAGES = [
  {
    phase: "01 — WHO I AM",
    title: "I Build Machines\nThat Think, Move\n& Adapt.",
    desc: "I'm a robotics-focused developer passionate about turning complex ideas into intelligent, autonomous systems. I combine software, AI, simulation, and robotics to build machines that can understand their environment and act within it.",
  },
  {
    phase: "01 — PERCEIVE",
    title: "Understanding\nThe Environment.",
    desc: "Every intelligent system starts with perception. Processing sensor data to map, locate, and understand the surrounding world.",
  },
  {
    phase: "02 — THINK",
    title: "Data Streams\nTo Decisions.",
    desc: "Routing telemetry and sensor fusion through core intelligence. Making real-time, deterministic decisions.",
  },
  {
    phase: "03 — MOVE",
    title: "Motion &\nControl.",
    desc: "Translating thought into physical action. Precise kinematics, joint control, and dynamic balancing.",
  },
  {
    phase: "04 — ADAPT",
    title: "Autonomous\nSystems.",
    desc: "A fully realized machine. Ready to integrate into human environments and adapt to unpredictable changes.",
  },
];

export default function AboutCinematic() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef({ value: 0 });
  const [stage, setStage] = useState(0);

  useGSAP(() => {
    gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=5000",
        pin: true,
        scrub: 1.5,
        refreshPriority: 10,
        onUpdate(self) {
          // progress goes from 0 to 1
          // We scale it to 0 to 4.99
          progressRef.current.value = self.progress * 4.99; 
          setStage(Math.min(4, Math.floor(self.progress * 5)));
        },
      },
    }).to({}, { duration: 5 });
  }, { scope: sectionRef });

  const cur = STAGES[Math.min(4, Math.max(0, stage))];

  return (
    <section ref={sectionRef} className="relative w-full h-[100svh] bg-[#020810] overflow-hidden">
      
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 opacity-20" style={{
        backgroundImage: "linear-gradient(rgba(0,240,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.03) 1px, transparent 1px)",
        backgroundSize: "40px 40px"
      }} />

      {/* Main Layout */}
      <div className="relative w-full h-full flex flex-col md:flex-row z-10 pointer-events-none">
        
        {/* Left/Top Side: Text */}
        <div className="w-full md:w-1/2 h-[50vh] md:h-full flex items-center px-6 md:px-12 lg:px-24 pt-[10vh] md:pt-0">
          <div className="w-full max-w-xl">
            
            {/* Top Label */}
            <div className="absolute top-[80px] md:top-[120px] left-6 md:left-12 lg:left-24">
              <div className="section-label">
                <span className="section-label-num">02</span>
                <div className="section-label-divider" />
                <span className="section-label-text">01 / THE BUILDER</span>
              </div>
            </div>

            {/* Cinematic Text Reveal */}
            <div className="relative h-[250px] md:h-[300px] flex flex-col justify-center mt-8 md:mt-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={cur.phase}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute inset-0 flex flex-col justify-center pointer-events-auto"
                >
                  <div className="font-mono text-[10px] tracking-[0.4em] text-[#00f0ff] mb-4 uppercase">
                    {cur.phase}
                  </div>
                  <h2 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-[1.05] text-white mb-6 whitespace-pre-line">
                    {cur.title}
                  </h2>
                  <p className="text-sm md:text-base font-light leading-relaxed text-white/60 max-w-md">
                    {cur.desc}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right/Bottom Side: 3D Canvas */}
        <div className="w-full md:w-1/2 h-[50vh] md:h-full relative pointer-events-auto">
          <div className="absolute inset-0">
            <AboutCanvas progressRef={progressRef} />
          </div>
        </div>

      </div>

    </section>
  );
}

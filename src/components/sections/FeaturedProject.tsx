"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Canvas } from "@react-three/fiber";
import AutonomousRover, { AutonomousRoverRef } from "@/components/three/AutonomousRover";

gsap.registerPlugin(ScrollTrigger);

export default function FeaturedProject() {
  const sectionRef = useRef<HTMLElement>(null);
  const roverComponentRef = useRef<AutonomousRoverRef>(null);
  
  const [isMounted, setIsMounted] = useState(false);
  
  // HTML Refs
  const techStackRef = useRef<HTMLDivElement>(null);
  const hudSystemRef = useRef<HTMLDivElement>(null);
  const hudMissionRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);
  
  // Dynamic HUD Values
  const [hudData, setHudData] = useState({
    speed: 0.0,
    dist: 0.0,
    obstacles: 0
  });
  const hudDataRef = useRef(hudData); // To allow GSAP to tween it

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section || !isMounted || !roverComponentRef.current) return;

    const { 
      roverRef, lidarBeamRef, originalPathRef, newPathRef, obstacleRef, cameraGroupRef 
    } = roverComponentRef.current;

    if (!roverRef?.current) return;

    let mm = gsap.matchMedia();

    // Custom GSAP update function for HUD
    const updateHUD = () => {
      setHudData({
        speed: Number(hudDataRef.current.speed.toFixed(1)),
        dist: Number(hudDataRef.current.dist.toFixed(1)),
        obstacles: Math.round(hudDataRef.current.obstacles)
      });
    };

    // Shared timeline sequence
    const createSequence = (tl: gsap.core.Timeline) => {
      // 1. Activation
      tl.to(lidarBeamRef!.current!.scale, { x: 1, y: 1, z: 1, duration: 0.5 }, 0)
        .to(hudSystemRef.current, { opacity: 1, duration: 0.5 }, 0);

      // 2. Start Moving
      tl.to(roverRef.current!.position, { z: 1, duration: 2, ease: "none" }, 1)
        .to(hudDataRef.current, { speed: 1.8, dist: 4.0, onUpdate: updateHUD, duration: 2 }, 1);

      // 3. Obstacle Detected
      tl.to(hudDataRef.current, { speed: 0.0, onUpdate: updateHUD, duration: 0.2 }, 3)
        .to(obstacleRef!.current!.scale, { x: 1, y: 1, z: 1, duration: 0.5, ease: "back.out(2)" }, 3)
        .to(hudDataRef.current, { obstacles: 1, onUpdate: updateHUD, duration: 0.1 }, 3);

      // 4. Recalculate Path
      tl.to(originalPathRef!.current!, { visible: false, duration: 0 }, 3.5)
        .to(newPathRef!.current!, { visible: true, duration: 0 }, 3.5)
        .to(techStackRef.current, { opacity: 1, y: 0, duration: 0.5 }, 3.5);

      // 5. Navigate New Path
      tl.to(hudDataRef.current, { speed: 1.5, onUpdate: updateHUD, duration: 0.5 }, 4)
        .to(roverRef.current!.rotation, { y: Math.PI / 4, duration: 0.5 }, 4)
        .to(roverRef.current!.position, { x: 2, z: 0, duration: 1, ease: "none" }, 4.5)
        .to(hudDataRef.current, { dist: 8.5, onUpdate: updateHUD, duration: 1 }, 4.5)
        
        .to(roverRef.current!.rotation, { y: 0, duration: 0.5 }, 5.5)
        .to(roverRef.current!.position, { z: -3, duration: 1.5, ease: "none" }, 6)
        .to(hudDataRef.current, { dist: 16.0, onUpdate: updateHUD, duration: 1.5 }, 6)

        .to(roverRef.current!.rotation, { y: -Math.PI / 4, duration: 0.5 }, 7.5)
        .to(roverRef.current!.position, { x: 0, z: -5, duration: 1, ease: "none" }, 8)
        .to(hudDataRef.current, { dist: 24.6, onUpdate: updateHUD, duration: 1 }, 8);

      // 6. Mission Complete
      tl.to(hudDataRef.current, { speed: 0.0, onUpdate: updateHUD, duration: 0.5 }, 9)
        .to(hudMissionRef.current, { opacity: 1, scale: 1, duration: 0.5 }, 9)
        .to(btnRef.current, { opacity: 1, y: 0, duration: 0.5 }, 9.5);
    };

    // ------------------------------------
    // DESKTOP ANIMATION
    // ------------------------------------
    mm.add("(min-width: 768px)", () => {
      // Initial states
      gsap.set(techStackRef.current, { opacity: 0, y: 20 });
      gsap.set(hudSystemRef.current, { opacity: 0 });
      gsap.set(hudMissionRef.current, { opacity: 0, scale: 0.9 });
      gsap.set(btnRef.current, { opacity: 0, y: 20 });
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=5000",
          pin: true,
          scrub: 1,
          refreshPriority: 7,
        }
      });

      // Camera wide to close-up
      tl.to(cameraGroupRef!.current!.position, { z: 2, y: -1, duration: 9, ease: "none" }, 0);

      createSequence(tl);
    });

    // ------------------------------------
    // MOBILE ANIMATION
    // ------------------------------------
    mm.add("(max-width: 767px)", () => {
      // Setup identical timeline, but mapped to a taller scroll container
      // Mobile HTML cards will just be visually placed over this sequence.
      // Initial states
      gsap.set(techStackRef.current, { opacity: 0, y: 20 });
      gsap.set(hudSystemRef.current, { opacity: 0 });
      gsap.set(hudMissionRef.current, { opacity: 0, scale: 0.9 });
      gsap.set(btnRef.current, { opacity: 0, y: 20 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=6000", // Longer scroll for mobile to allow distinct steps
          pin: false, // Don't pin the whole section, let the content scroll naturally while the Canvas is sticky
          scrub: 1,
        }
      });
      
      // Keep camera further back for mobile
      gsap.set(cameraGroupRef!.current!.position, { z: 4, y: 2 });
      
      createSequence(tl);
    });

    return () => mm.revert();
  }, { scope: sectionRef, dependencies: [isMounted] });

  return (
    <section ref={sectionRef} className="relative w-full min-h-[100svh] md:h-[100svh] bg-[#050505] overflow-hidden">
      
      {/* 3D Scene - Sticky for mobile, Absolute for desktop */}
      <div className="sticky top-0 w-full h-[100svh] z-10 md:absolute md:inset-0">
        <Canvas camera={{ position: [0, 4, 10], fov: 45 }} gl={{ alpha: true, antialias: true }} onCreated={() => setIsMounted(true)}>
          <AutonomousRover ref={roverComponentRef} />
        </Canvas>
      </div>

      {/* HTML Overlays */}
      <div className="relative z-20 w-full h-full pointer-events-none">
        
        {/* Dynamic HUD Grid (Top Right) */}
        <div className="absolute top-[128px] spx-r font-mono text-[10px] md:text-xs text-[#00f0ff] opacity-70 tracking-widest text-right pointer-events-none z-30">
          <div className="mb-2">LAT 13.0827° N</div>
          <div className="mb-2">LON 80.2707° E</div>
          <div className="mb-2">SPD {hudData.speed} m/s</div>
          <div className="mb-2">DST {hudData.dist} m</div>
          <div>OBS {hudData.obstacles.toString().padStart(2, '0')}</div>
        </div>

        {/* ─── TOP LEFT: Title & Intro ─── */}
        <div className="absolute top-[128px] spx-l w-[calc(100%-2rem)] md:max-w-md pointer-events-auto">
          
          {/* Section Marker */}
          <div className="section-label">
            <span className="section-label-num">04</span>
            <div className="section-label-divider" />
            <span className="section-label-text">03 / FEATURED</span>
          </div>

          {/* Title */}
          <h2 className="section-heading">
            Autonomous Robotics,<br/>
            <span className="heading-gradient">Built to Move.</span>
          </h2>

          {/* Description */}
          <p className="section-body mb-10">
            An autonomous mobile robot designed to navigate dynamic environments, detect obstacles, and make intelligent movement decisions in real time.
          </p>

        </div>

        {/* ─── BOTTOM LEFT: HUD Status Alerts ─── */}
        <div className="absolute bottom-12 spx-l pointer-events-auto z-30 hidden md:block">
          <div ref={hudSystemRef} className="flex flex-col gap-3 font-mono text-[10px] tracking-[0.2em] text-[#00ff88] border-l-[2px] border-[#00ff88]/30 pl-5">
            <div className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#00ff88]"></span>SYSTEM: ONLINE</div>
            <div className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#00ff88]"></span>AI: ACTIVE</div>
            <div className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#00ff88]"></span>VISION: ACTIVE</div>
            <div className="flex items-center gap-3 text-[#00f0ff] animate-pulse"><span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]"></span>LIDAR: SCANNING</div>
          </div>
        </div>

        {/* ─── BOTTOM RIGHT: Tech Stack ─── */}
        <div className="absolute bottom-12 spx-r pointer-events-auto z-30 hidden md:flex flex-col items-end">
          <div ref={techStackRef} className="flex flex-wrap justify-end gap-3 max-w-sm">
            {['ROS 2', 'Python', 'Computer Vision', 'LiDAR', 'AI'].map(tech => (
              <span key={tech} className="px-4 py-1.5 bg-[#00f0ff]/5 border border-[#00f0ff]/20 text-[#00f0ff] font-mono text-[9px] uppercase tracking-[0.2em]">
                {tech}
              </span>
            ))}
            <div className="w-full mt-3 text-[#ff0044] font-mono text-[9px] tracking-[0.2em] animate-pulse border border-[#ff0044]/30 px-4 py-2 bg-[#ff0044]/10 inline-block uppercase text-right">
              OBSTACLE AVOIDANCE ENGAGED
            </div>
          </div>
        </div>

        {/* ─── TOP CENTER: Mission Complete & CTA ─── */}
        <div className="absolute top-[128px] left-1/2 transform -translate-x-1/2 flex flex-col items-center pointer-events-auto z-40 w-[90%] md:w-auto">
          
          {/* Mission Complete */}
          <div ref={hudMissionRef} className="w-full min-w-[300px] bg-[#00f0ff]/5 border border-[#00f0ff]/20 p-6 backdrop-blur-md mb-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent opacity-50" />
            <div className="text-white font-bold tracking-[0.2em] uppercase mb-2 text-sm md:text-base">Mission Complete</div>
            <div className="text-[#00f0ff] font-mono text-[9px] md:text-[10px] tracking-[0.3em]">AUTONOMOUS NAVIGATION — SUCCESS</div>
          </div>

          {/* Button */}
          <div ref={btnRef}>
            <a href="#case-study" className="group inline-flex items-center gap-4 px-8 py-4 bg-white text-black font-bold text-xs uppercase tracking-[0.2em] hover:bg-[#00f0ff] transition-all duration-300">
              <span>View Case Study</span>
              <span className="font-mono transform group-hover:translate-x-2 transition-transform duration-300">→</span>
            </a>
          </div>

        </div>

      </div>
      
      {/* Mobile spacer to force scroll height */}
      <div className="md:hidden w-full h-[6000px] absolute top-0 pointer-events-none" />
    </section>
  );
}
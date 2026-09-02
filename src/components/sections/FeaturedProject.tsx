"use client";

import { useRef, useState, useEffect, Suspense } from "react";
import { usePreloaderReady } from "@/hooks/usePreloaderReady";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import { View, PerspectiveCamera } from "@react-three/drei";
import { motion, Variants } from "framer-motion";
import AutonomousRover, { AutonomousRoverRef } from "@/components/three/AutonomousRover";

gsap.registerPlugin(ScrollTrigger);

// Animation Variants for Mobile Stagger
const mobileContainerVars: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

const mobileItemVars: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export default function FeaturedProject() {
  const sectionRef = useRef<HTMLElement>(null);
  const roverComponentRef = useRef<AutonomousRoverRef>(null);
  const mobileRoverRef = useRef<AutonomousRoverRef>(null);

  const isMounted = usePreloaderReady();
  const [desktopLoaded, setDesktopLoaded] = useState(false);
  const [mobileLoaded, setMobileLoaded] = useState(false);

  // HTML Refs
  const titleContainerRef = useRef<HTMLDivElement>(null);
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
  const hudDataRef = useRef({ speed: 0, dist: 0, obstacles: 0 }); // To allow GSAP to tween it

  // Custom GSAP update function for HUD (reusable for both mobile and desktop)
  const updateHUD = () => {
    setHudData({
      speed: Number(hudDataRef.current.speed.toFixed(1)),
      dist: Number(hudDataRef.current.dist.toFixed(1)),
      obstacles: Math.round(hudDataRef.current.obstacles)
    });
  };

  // --- MOBILE ANIMATION HOOK ---
  // Runs once on mount, no dependencies. 
  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    let mm = gsap.matchMedia();
    mm.add("(max-width: 767px)", () => {
      // Find the HUD Data block to animate the numbers on scrub
      const hudDataEl = document.querySelector(".hud-data-anim");
      if (!hudDataEl) return;

      // Reset ref to 0 explicitly before animating to ensure fresh start
      gsap.set(hudDataRef.current, { speed: 0, dist: 0, obstacles: 0 });
      gsap.to(hudDataRef.current, {
        speed: 1.5,
        dist: 24.6,
        obstacles: 1,
        ease: "none", // Best for scrubbing
        onUpdate: updateHUD,
        scrollTrigger: {
          trigger: hudDataEl,
          start: "top 80%",   // Start counting when it enters view
          end: "bottom 30%",  // Finish counting when it reaches the upper part of the screen
          scrub: 1            // Link the numbers to the scroll position!
        }
      });
    });

    return () => mm.revert();
  }, { scope: sectionRef });

  // --- MOBILE 3D ROVER ANIMATION HOOK ---
  // Depends on modelLoaded so it waits for the GLTF to be ready
  useGSAP(() => {
    let mm = gsap.matchMedia();
    mm.add("(max-width: 767px)", () => {
      const section = sectionRef.current;
      const hudDataEl = document.querySelector(".hud-data-anim");
      const missionBadge = document.querySelector(".mobile-mission-badge");
      if (!section || !hudDataEl || !missionBadge || !mobileRoverRef.current?.roverRef?.current) return;

      const rover = mobileRoverRef.current.roverRef.current;

      // Reset states explicitly
      gsap.set(hudDataRef.current, { speed: 0, dist: 0, obstacles: 0 });
      gsap.set(rover.position, { x: 0, y: -0.5, z: 1.5 });
      gsap.set(rover.rotation, { x: 0, y: -Math.PI / 4, z: 0 });
      gsap.set(rover.scale, { x: 0.6, y: 0.6, z: 0.6 }); // Scale down for mobile view

      // Create a pinned timeline for the mobile scrub
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "bottom bottom", // Wait until the entire section is fully in view before pinning!
          end: "+=1500",          // Require 1500px of scrolling to finish the animation
          pin: true,
          scrub: 1,
          refreshPriority: 7      // Critical: Ensures sections below calculate offsets AFTER this pin adds 1500px spacing
        }
      });

      // 1. Animate Numbers & Rover simultaneously for the first 80% of the scroll
      tl.to(hudDataRef.current, {
        speed: 1.5,
        dist: 24.6,
        obstacles: 1,
        ease: "none",
        onUpdate: updateHUD,
        duration: 0.8
      }, 0);

      tl.to(rover.position, {
        z: -1, // Drive forward
        ease: "none",
        duration: 0.8
      }, 0);

      // 2. Finally, pop in the Mission Complete badge in the last 20% of the scroll
      tl.fromTo(missionBadge,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.2,
          ease: "back.out(1.5)"
        },
        0.8 // Start this animation at 80% of the timeline
      );
    });

    return () => mm.revert();
  }, { scope: sectionRef, dependencies: [mobileLoaded] });

  // --- DESKTOP ANIMATION HOOK ---
  // Depends on modelLoaded because it targets 3D canvas elements
  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    let mm = gsap.matchMedia();

    // ------------------------------------
    // DESKTOP ANIMATION (Depends on 3D)
    // ------------------------------------
    mm.add("(min-width: 768px)", () => {
      if (!desktopLoaded || !roverComponentRef.current) return;

      const {
        roverRef, lidarBeamRef, originalPathRef, newPathRef, obstacleRef, cameraGroupRef
      } = roverComponentRef.current;

      if (!roverRef?.current) return;

      // Initial states
      gsap.set(techStackRef.current, { opacity: 0, y: 20 });
      gsap.set(hudSystemRef.current, { opacity: 0 });
      gsap.set(hudMissionRef.current, { opacity: 0, scale: 0.9 });

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

      // Shared timeline sequence
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
        .to(roverRef.current!.rotation, { y: -1.107, duration: 0.5 }, 4) // Turn Right to face (2, 0, -1)
        .to(roverRef.current!.position, { x: 2, z: 0, duration: 1, ease: "none" }, 4.5)
        .to(hudDataRef.current, { dist: 8.5, onUpdate: updateHUD, duration: 1 }, 4.5)

        .to(roverRef.current!.rotation, { y: 0, duration: 0.5 }, 5.5) // Turn Forward to face (0, 0, -3)
        .to(roverRef.current!.position, { z: -3, duration: 1.5, ease: "none" }, 6)
        .to(hudDataRef.current, { dist: 16.0, onUpdate: updateHUD, duration: 1.5 }, 6)

        .to(roverRef.current!.rotation, { y: Math.PI / 4, duration: 0.5 }, 7.5) // Turn Left to face (-2, 0, -2)
        .to(roverRef.current!.position, { x: 0, z: -5, duration: 1, ease: "none" }, 8)
        .to(hudDataRef.current, { dist: 24.6, onUpdate: updateHUD, duration: 1 }, 8);

      // 6. Mission Complete
      tl.to(hudDataRef.current, { speed: 0.0, onUpdate: updateHUD, duration: 0.5 }, 9)
        .to(hudMissionRef.current, { opacity: 1, scale: 1, duration: 0.5 }, 9);
    });

    return () => mm.revert();
  }, { scope: sectionRef, dependencies: [desktopLoaded] });

  return (
    <section ref={sectionRef} className="relative w-full min-h-[100svh] md:h-[100svh] bg-transparent overflow-hidden">

      {/* 3D Scene - Desktop Only */}
      <div className="hidden md:block absolute inset-0 z-0">
        <View className="absolute inset-0 w-full h-full pointer-events-none">
          <PerspectiveCamera makeDefault position={[0, 4, 10]} fov={45} onUpdate={c => c.lookAt(0, 0, 0)} />
          <Suspense fallback={null}>
            {isMounted && <AutonomousRover ref={roverComponentRef} onReady={() => setDesktopLoaded(true)} />}
          </Suspense>
        </View>
      </div>

      {/* HTML Overlays (Desktop Only) */}
      <div className="hidden md:block relative z-20 w-full h-full pointer-events-none">

        {/* Dynamic HUD Grid (Top Right) */}
        <div className="absolute top-[128px] spx-r font-mono text-[10px] md:text-xs text-[#00f0ff] opacity-70 tracking-widest text-right pointer-events-none z-30">
          <div className="mb-2">LAT 13.0827° N</div>
          <div className="mb-2">LON 80.2707° E</div>
          <div className="mb-2">SPD {hudData.speed} m/s</div>
          <div className="mb-2">DST {hudData.dist} m</div>
          <div>OBS {hudData.obstacles.toString().padStart(2, '0')}</div>
        </div>

        {/* ─── TOP LEFT: Title & Intro ─── */}
        <div ref={titleContainerRef} className="absolute top-[128px] spx-l max-w-md pointer-events-auto">

          {/* Section Marker */}
          <div className="section-label">
            <span className="section-label-text">FEATURED PROJECT</span>
          </div>

          {/* Title */}
          <h2 className="section-heading">
            Autonomous Robotics,<br />
            <span className="text-[#00f0ff]">Built to Move.</span>
          </h2>

          {/* Description */}
          <p className="section-body">
            An autonomous mobile robot designed to navigate dynamic environments, detect obstacles, and make intelligent movement decisions in real time.
          </p>

        </div>

        {/* ─── BOTTOM LEFT: HUD Status Alerts ─── */}
        <div className="absolute bottom-12 spx-l pointer-events-auto z-30">
          <div ref={hudSystemRef} style={{ paddingLeft: '0.5rem' }} className="flex flex-col gap-3 font-mono text-[10px] tracking-[0.2em] text-[#00ff88] border-l-[2px] border-[#00ff88]/30">
            <div className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#00ff88]"></span>SYSTEM: ONLINE</div>
            <div className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#00ff88]"></span>AI: ACTIVE</div>
            <div className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#00ff88]"></span>VISION: ACTIVE</div>
            <div className="flex items-center gap-3 text-[#00f0ff] animate-pulse"><span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]"></span>LIDAR: SCANNING</div>
          </div>
        </div>

        {/* ─── BOTTOM RIGHT: Tech Stack ─── */}
        <div className="absolute bottom-12 right-[var(--section-px)] pointer-events-auto z-30 flex flex-col items-end">
          <div ref={techStackRef} className="flex flex-wrap justify-end gap-3 max-w-sm">
            {['ROS 2', 'Python', 'Computer Vision', 'LiDAR', 'AI'].map(tech => (
              <span key={tech} style={{ padding: '0.5rem 0.5rem' }} className="bg-[#00f0ff]/5 border border-[#00f0ff]/20 text-[#00f0ff] font-mono text-[9px] uppercase tracking-[0.2em]">
                {tech}
              </span>
            ))}
            <div style={{ padding: '0.5rem 0.5rem' }} className="w-full mt-3 text-[#ff0044] font-mono text-[9px] tracking-[0.2em] animate-pulse border border-[#ff0044]/30 bg-[#ff0044]/10 inline-block uppercase text-right">
              OBSTACLE AVOIDANCE ENGAGED
            </div>
          </div>
        </div>

        {/* ─── BOTTOM CENTER: Mission Complete & CTA ─── */}
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 flex flex-col items-center pointer-events-auto z-40">

          {/* Mission Complete */}
          <div ref={hudMissionRef} style={{ padding: '0.5rem' }} className="w-full min-w-[300px] bg-[#00f0ff]/5 border border-[#00f0ff]/20 backdrop-blur-md mb-8 text-center relative overflow-hidden shadow-[0_0_30px_rgba(0,240,255,0.1)]">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent opacity-50" />
            <div className="text-white font-bold tracking-[0.2em] uppercase mb-2 text-base">Mission Complete</div>
            <div className="text-[#00f0ff] font-mono text-[10px] tracking-[0.3em]">AUTONOMOUS NAVIGATION — SUCCESS</div>
          </div>
        </div>

      </div>

      {/* Mobile Layout (No 3D, Static Text) */}
      <motion.div
        className="md:hidden flex flex-col justify-start min-h-[100svh] relative z-20 gap-8"
        style={{ paddingTop: '15vh', paddingBottom: '15vh', paddingLeft: '2rem', paddingRight: '2rem' }}
        variants={mobileContainerVars}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >

        <motion.div variants={mobileItemVars} className="section-label">
          <span className="section-label-text">FEATURED PROJECT</span>
        </motion.div>

        <motion.h2 variants={mobileItemVars} className="section-heading max-md:text-[1.3rem]">
          Autonomous Robotics,<br />
          <span className="heading-gradient">Built to Move.</span>
        </motion.h2>

        <motion.p variants={mobileItemVars} className="section-body text-white/70 max-md:text-[0.9rem] max-md:leading-relaxed">
          An autonomous mobile robot designed to navigate dynamic environments, detect obstacles, and make intelligent movement decisions in real time.
        </motion.p>

        {/* Dashboard Row: Stats on Left, 3D on Right */}
        <motion.div variants={mobileItemVars} className="flex w-full items-center justify-between gap-4">

          {/* Left Column: Stats */}
          <div className="w-1/2 flex flex-col gap-8">
            {/* HUD System Status (Static) */}
            <div style={{ paddingLeft: '1.5rem' }} className="flex flex-col gap-3 font-mono text-[10px] tracking-[0.2em] text-[#00ff88] border-l-[2px] border-[#00ff88]/30">
              <div className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#00ff88]"></span>SYSTEM: ONLINE</div>
              <div className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#00ff88]"></span>AI: ACTIVE</div>
              <div className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#00ff88]"></span>VISION: ACTIVE</div>
              <div className="flex items-center gap-3 text-[#00f0ff] animate-pulse"><span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]"></span>LIDAR: SCANNING</div>
            </div>

            {/* HUD Data (Animated Numbers) */}
            <div style={{ paddingLeft: '1.5rem' }} className="font-mono text-[11px] text-[#00f0ff] opacity-80 tracking-widest border-l-[2px] border-[#00f0ff]/30 py-2 hud-data-anim">
              <div className="mb-3">LAT 13.0827° N</div>
              <div className="mb-3">LON 80.2707° E</div>
              <div className="mb-3">SPD {hudData.speed} m/s</div>
              <div className="mb-3">DST {hudData.dist} m</div>
              <div>OBS {hudData.obstacles.toString().padStart(2, '0')}</div>
            </div>
          </div>

          {/* Right Column: 3D Rover Box */}
          <div className="w-1/2 h-48 bg-gradient-to-b from-[#00f0ff]/10 to-transparent border border-[#00f0ff]/20 rounded-lg relative overflow-hidden shadow-[inset_0_0_20px_rgba(0,240,255,0.1)] flex items-center justify-center">
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#00f0ff]/50"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#00f0ff]/50"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#00f0ff]/50"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#00f0ff]/50"></div>

            {/* The Mobile 3D Canvas */}
            <View className="absolute inset-0 w-full h-full pointer-events-none">
              <PerspectiveCamera makeDefault position={[3, 2, 3]} fov={45} onUpdate={c => c.lookAt(0, 0, 0)} />
              <ambientLight intensity={1.5} />
              <directionalLight position={[5, 10, 5]} intensity={2} />
              <Suspense fallback={null}>
                <AutonomousRover ref={mobileRoverRef} onReady={() => setMobileLoaded(true)} />
              </Suspense>
            </View>
          </div>

        </motion.div>

        {/* Tech Stack */}
        <motion.div variants={mobileItemVars} className="flex flex-wrap gap-3">
          {['ROS 2', 'Python', 'Computer Vision', 'LiDAR', 'AI'].map(tech => (
            <span key={tech} style={{ padding: '0.5rem 0.75rem' }} className="bg-[#00f0ff]/5 border border-[#00f0ff]/20 text-[#00f0ff] font-mono text-[10px] uppercase tracking-[0.2em]">
              {tech}
            </span>
          ))}
        </motion.div>

        {/* Mobile Mission Complete badge (Animated by GSAP at the end) */}
        <div className="mobile-mission-badge opacity-0 p-6 bg-[#00f0ff]/5 border border-[#00f0ff]/20 backdrop-blur-md text-center relative overflow-hidden shadow-[0_0_30px_rgba(0,240,255,0.1)]">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent opacity-50" />
          <div className="text-white font-bold tracking-[0.2em] uppercase text-base mb-2">Mission Complete</div>
          <div className="text-[#00f0ff] font-mono text-[9px] tracking-[0.25em]">AUTONOMOUS NAVIGATION — SUCCESS</div>
        </div>

      </motion.div>
    </section>
  );
}
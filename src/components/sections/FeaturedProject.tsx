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
        
        {/* Dynamic HUD Grid (Always visible on top) */}
        <div className="fixed md:absolute top-12 right-6 md:top-32 md:right-12 font-mono text-[10px] md:text-xs text-[#00f0ff] opacity-70 tracking-widest text-right pointer-events-none z-30">
          <div className="mb-2">LAT 13.0827° N</div>
          <div className="mb-2">LON 80.2707° E</div>
          <div className="mb-2">SPD {hudData.speed} m/s</div>
          <div className="mb-2">DST {hudData.dist} m</div>
          <div>OBS {hudData.obstacles.toString().padStart(2, '0')}</div>
        </div>

        {/* Desktop Split Layout / Mobile Vertical Scroll Container */}
        <div className="container mx-auto h-full flex flex-col md:flex-row relative z-20">
          
          {/* Left Content */}
          <div className="w-full md:w-1/3 px-6 md:px-12 flex flex-col justify-start pointer-events-auto h-full overflow-y-visible relative" style={{ paddingTop: '128px' }}>
            
            <div className="md:static">
              {/* Section Marker */}
              <div className="flex items-center gap-4 mb-6 opacity-50">
                <span className="text-white/40 font-mono text-sm tracking-widest">04</span>
                <div className="w-16 h-px bg-white/20" />
                <span className="text-[#00f0ff] font-mono text-sm uppercase tracking-[0.3em]">03 / FEATURED</span>
              </div>

              {/* Title */}
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-[1.1] tracking-tighter mb-6 uppercase">
                Autonomous Robotics, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">Built to Move.</span>
              </h2>

              <p className="text-white/60 text-sm md:text-base font-light leading-relaxed mb-8 max-w-sm">
                An autonomous mobile robot designed to navigate dynamic environments, detect obstacles, and make intelligent movement decisions in real time.
              </p>

              {/* HUD Status Alerts (Triggered by GSAP) */}
              <div ref={hudSystemRef} className="flex flex-col gap-2 font-mono text-[10px] tracking-widest text-green-400 mb-8 border-l border-green-400/50 pl-4">
                <div>SYSTEM: ONLINE</div>
                <div>AI: ACTIVE</div>
                <div>VISION: ACTIVE</div>
                <div className="animate-pulse text-[#00f0ff]">LIDAR: SCANNING</div>
              </div>

              {/* Tech Stack (Triggered by GSAP during recalculation) */}
              <div ref={techStackRef} className="flex flex-wrap gap-2 mb-12">
                {['ROS 2', 'Python', 'Computer Vision', 'LiDAR', 'AI'].map(tech => (
                  <span key={tech} className="px-3 py-1 bg-[#00f0ff]/10 border border-[#00f0ff]/20 text-[#00f0ff] font-mono text-[10px] uppercase tracking-wider rounded-sm">
                    {tech}
                  </span>
                ))}
                <div className="w-full mt-2 text-[#ff0044] font-mono text-[10px] tracking-widest animate-pulse border border-[#ff0044]/30 px-3 py-1 bg-[#ff0044]/10 inline-block rounded-sm">
                  OBSTACLE AVOIDANCE ENGAGED
                </div>
              </div>

              {/* Mission Complete (Triggered by GSAP at end) */}
              <div ref={hudMissionRef} className="w-full max-w-sm bg-[#00f0ff]/10 border border-[#00f0ff]/30 p-4 rounded-sm backdrop-blur-md mb-8 text-center shadow-[0_0_20px_rgba(0,240,255,0.2)]">
                <div className="text-white font-bold tracking-widest uppercase mb-1 text-sm">Mission Complete</div>
                <div className="text-[#00f0ff] font-mono text-[10px] tracking-widest">AUTONOMOUS NAVIGATION — SUCCESS</div>
              </div>

              {/* Button */}
              <div ref={btnRef}>
                <a href="#case-study" className="group inline-flex items-center gap-4 px-6 py-3 bg-white text-black font-bold text-xs uppercase tracking-widest rounded hover:shadow-[0_0_25px_rgba(0,240,255,0.6)] hover:bg-[#00f0ff] transition-all duration-300">
                  <span>View Case Study</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>

            </div>
          </div>
          
          {/* Right side blank to allow 3D visibility */}
          <div className="hidden md:block w-2/3 h-full pointer-events-none" />

        </div>
      </div>
      
      {/* Mobile spacer to force scroll height */}
      <div className="md:hidden w-full h-[6000px] absolute top-0 pointer-events-none" />
    </section>
  );
}
"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Canvas } from "@react-three/fiber";
import TechEcosystem, { TechEcosystemRef } from "@/components/three/TechEcosystem";

gsap.registerPlugin(ScrollTrigger);

export default function TechnologyStack() {
  const sectionRef = useRef<HTMLElement>(null);
  const ecosystemRef = useRef<TechEcosystemRef>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  // HTML Refs
  const headingRef = useRef<HTMLDivElement>(null);
  const systemStatusRef = useRef<HTMLDivElement>(null);
  const categoryRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    if (!sectionRef.current || !isMounted || !ecosystemRef.current) return;

    const {
      coreRef,
      programmingGroupRef,
      roboticsGroupRef,
      visionGroupRef,
      hardwareGroupRef,
      connectionLinesRef,
    } = ecosystemRef.current;

    let mm = gsap.matchMedia();

    // DESKTOP ANIMATION SEQUENCE (Scroll-driven lines and nodes)
    mm.add("(min-width: 768px)", () => {
      // Setup HTML
      gsap.set(categoryRefs.current, { opacity: 0, y: 20 });
      gsap.set(systemStatusRef.current, { opacity: 0, scale: 0.9 });
      gsap.set(headingRef.current, { opacity: 0, y: 20 });

      // Setup 3D Initial State
      // Core starts large
      gsap.set(coreRef!.current!.scale, { x: 1, y: 1, z: 1 });
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=3000",
          pin: true,
          scrub: 1,
          refreshPriority: 6,
        }
      });

      // 1. Heading fades in
      tl.to(headingRef.current, { opacity: 1, y: 0, duration: 0.5 }, 0);

      // 2. Lines start drawing out
      const lineTop = connectionLinesRef!.current!.children[0];
      const lineRight = connectionLinesRef!.current!.children[1];
      const lineLeft = connectionLinesRef!.current!.children[2];
      const lineBottom = connectionLinesRef!.current!.children[3];

      tl.to(lineLeft.scale, { y: 1, duration: 1 }, 1)
        .to(lineRight.scale, { y: 1, duration: 1 }, 1)
        .to(lineTop.scale, { y: 1, duration: 1 }, 1)
        .to(lineBottom.scale, { y: 1, duration: 1 }, 1);

      // 3. Sequential Node Activation (3D + HTML text)
      // Vision (Left)
      tl.to(visionGroupRef!.current!.scale, { x: 1, y: 1, z: 1, duration: 0.5 }, 2)
        .to(categoryRefs.current[0], { opacity: 1, y: 0, duration: 0.5 }, 2);
      
      // Programming (Top)
      tl.to(programmingGroupRef!.current!.scale, { x: 1, y: 1, z: 1, duration: 0.5 }, 3)
        .to(categoryRefs.current[1], { opacity: 1, y: 0, duration: 0.5 }, 3);

      // Hardware (Bottom)
      tl.to(hardwareGroupRef!.current!.scale, { x: 1, y: 1, z: 1, duration: 0.5 }, 4)
        .to(categoryRefs.current[2], { opacity: 1, y: 0, duration: 0.5 }, 4);

      // Robotics (Right)
      tl.to(roboticsGroupRef!.current!.scale, { x: 1, y: 1, z: 1, duration: 0.5 }, 5)
        .to(categoryRefs.current[3], { opacity: 1, y: 0, duration: 0.5 }, 5);

      // 4. System Connected Final State
      tl.to(systemStatusRef.current, { opacity: 1, scale: 1, duration: 0.5 }, 6)
        .to(coreRef!.current!.scale, { x: 1.2, y: 1.2, z: 1.2, duration: 0.5 }, 6);
    });


    // MOBILE ANIMATION SEQUENCE (Vertical Story)
    mm.add("(max-width: 767px)", () => {
      // Setup HTML
      gsap.set(systemStatusRef.current, { opacity: 0, scale: 0.9 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=5000",
          scrub: 1,
        }
      });

      // 1. Initial Core Reveal (Wait a bit)
      tl.to(coreRef!.current!.scale, { x: 1, y: 1, z: 1, duration: 1 }, 0);

      // 2. Vision (Mobile card 1)
      tl.to(visionGroupRef!.current!.scale, { x: 1, y: 1, z: 1, duration: 1 }, 1)
        .to(visionGroupRef!.current!.position, { y: 1.5, x: 0, duration: 1 }, 1); 

      // 3. Programming (Mobile card 2)
      tl.to(programmingGroupRef!.current!.scale, { x: 1, y: 1, z: 1, duration: 1 }, 2)
        .to(programmingGroupRef!.current!.position, { y: -1.5, x: 0, duration: 1 }, 2);

      // 4. Hardware (Mobile card 3)
      tl.to(hardwareGroupRef!.current!.scale, { x: 1, y: 1, z: 1, duration: 1 }, 3)
        .to(hardwareGroupRef!.current!.position, { y: 2, x: 0, duration: 1 }, 3);

      // 5. Robotics (Mobile card 4)
      tl.to(roboticsGroupRef!.current!.scale, { x: 1, y: 1, z: 1, duration: 1 }, 4)
        .to(roboticsGroupRef!.current!.position, { y: -2, x: 0, duration: 1 }, 4);

      // 6. Connect All & System Active
      tl.to(systemStatusRef.current, { opacity: 1, scale: 1, duration: 1 }, 5)
        .to(coreRef!.current!.scale, { x: 1.3, y: 1.3, z: 1.3, duration: 1 }, 5);
    });

    return () => mm.revert();
  }, { scope: sectionRef, dependencies: [isMounted] });


  return (
    <section ref={sectionRef} className="relative w-full bg-[#08080a] text-white overflow-hidden">
      
      {/* 3D Canvas Background */}
      <div className="sticky top-0 md:absolute w-full h-[100svh] z-10 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 9], fov: 45 }} gl={{ alpha: true, antialias: true }} onCreated={() => setIsMounted(true)}>
          <TechEcosystem ref={ecosystemRef} />
        </Canvas>
      </div>

      {/* DESKTOP LAYOUT */}
      <div className="hidden md:flex flex-col container mx-auto px-6 lg:px-12 pt-32 pb-16 relative z-20 min-h-[100svh] justify-between pointer-events-none">
        
        {/* Header - Fixed format and more breathing space */}
        <div ref={headingRef} className="w-full text-center mb-24">
          <div className="flex items-center justify-center gap-4 mb-6 opacity-50">
            <div className="w-16 h-px bg-white/20" />
            <span className="text-[#00f0ff] font-mono text-sm uppercase tracking-[0.3em]">04 / TECHNOLOGY</span>
            <div className="w-16 h-px bg-white/20" />
          </div>
          <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter mb-6">
            The Technology <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">Behind the Intelligence.</span>
          </h2>
          <p className="text-white/60 font-light max-w-xl mx-auto">
            From low-level hardware control to high-level AI, I work with a modern robotics stack to turn complex ideas into functional systems.
          </p>
        </div>

        {/* Categories / Scroll Targets */}
        <div className="grid grid-cols-2 gap-y-72 justify-between w-full h-full flex-grow mt-12 pointer-events-auto relative">
          
          {/* Top Left (Vision) */}
          <div ref={(el) => { categoryRefs.current[0] = el; }} className="self-start">
            <h3 className="text-[#00f0ff] font-mono text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
              <span className="text-lg">👁️</span> AI & Vision
            </h3>
            <p className="text-xl font-bold tracking-wider">OpenCV · ML · Deep Learning</p>
            <div className="text-white/40 font-mono text-[10px] mt-2 border border-white/10 px-2 py-1 inline-block bg-white/5 rounded-sm">
              SCANNING ENVIRONMENT...
            </div>
          </div>

          {/* Top Right (Programming) */}
          <div ref={(el) => { categoryRefs.current[1] = el; }} className="self-start text-right">
            <h3 className="text-[#00f0ff] font-mono text-xs uppercase tracking-widest mb-2 flex items-center justify-end gap-2">
              Programming <span className="text-lg text-white/70">{"{ }"}</span>
            </h3>
            <p className="text-xl font-bold tracking-wider">Python · C++ · JavaScript</p>
            <div className="text-white/40 font-mono text-[10px] mt-2 border border-white/10 px-2 py-1 inline-block bg-white/5 rounded-sm">
              DATA PROCESSING...
            </div>
          </div>

          {/* Bottom Left (Hardware) */}
          <div ref={(el) => { categoryRefs.current[2] = el; }} className="self-end">
            <h3 className="text-[#00f0ff] font-mono text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
              <span className="text-lg text-white/70">▣</span> Hardware
            </h3>
            <p className="text-xl font-bold tracking-wider">Arduino · Pi · Jetson · Sensors</p>
            <div className="text-white/40 font-mono text-[10px] mt-2 border border-white/10 px-2 py-1 inline-block bg-white/5 rounded-sm">
              COMPONENTS ONLINE
            </div>
          </div>

          {/* Bottom Right (Robotics) */}
          <div ref={(el) => { categoryRefs.current[3] = el; }} className="self-end text-right">
            <h3 className="text-[#00f0ff] font-mono text-xs uppercase tracking-widest mb-2 flex items-center justify-end gap-2">
              Robotics <span className="text-lg">🦾</span>
            </h3>
            <p className="text-xl font-bold tracking-wider">ROS · ROS 2 · Gazebo · MoveIt</p>
            <div className="text-white/40 font-mono text-[10px] mt-2 border border-white/10 px-2 py-1 inline-block bg-white/5 rounded-sm">
              ACTUATORS ENGAGED
            </div>
          </div>

          {/* System Status Center Overlay */}
          <div ref={systemStatusRef} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-16 pointer-events-none">
            <div className="px-6 py-2 bg-[#00f0ff]/10 border border-[#00f0ff]/40 rounded backdrop-blur-md shadow-[0_0_20px_rgba(0,240,255,0.2)]">
              <span className="text-[#00f0ff] font-mono text-xs tracking-[0.3em] uppercase">System Connected</span>
            </div>
          </div>

        </div>
      </div>


      {/* MOBILE LAYOUT (Vertical Scroll) */}
      <div className="md:hidden relative z-20 pointer-events-none">
        
        {/* Intro */}
        <div className="h-[100svh] flex flex-col justify-center px-6 pt-16">
          <div className="flex items-center gap-4 mb-6 opacity-50">
            <span className="text-[#00f0ff] font-mono text-xs uppercase tracking-widest">04 / TECHNOLOGY</span>
            <div className="flex-1 h-px bg-white/20" />
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-6 leading-tight">
            The Technology <br/>Behind the <br/>Intelligence.
          </h2>
          <p className="text-white/60 font-light text-sm max-w-sm">
            From low-level hardware control to high-level AI, I work with a modern robotics stack to turn complex ideas into functional systems.
          </p>
        </div>

        {/* Vertical Story Cards mapping to 3D Nodes */}
        {[
          { num: "01", icon: "👁️", title: "AI & Vision", stack: "OpenCV · ML · Deep Learning", status: "SCANNING ENVIRONMENT..." },
          { num: "02", icon: "{ }", title: "Programming", stack: "Python · C++ · JavaScript", status: "DATA PROCESSING..." },
          { num: "03", icon: "▣", title: "Hardware", stack: "Arduino · Pi · NVIDIA Jetson", status: "COMPONENTS CONNECTED" },
          { num: "04", icon: "🦾", title: "Robotics", stack: "ROS · ROS 2 · Gazebo · MoveIt", status: "SYSTEM ACTIVE" }
        ].map((item, i) => (
          <div key={i} className="h-[100svh] flex items-end pb-24 px-6 pointer-events-auto">
            <div className="bg-black/60 backdrop-blur-md border border-white/10 p-6 rounded-lg w-full shadow-2xl">
              <div className="flex justify-between items-start mb-4">
                <span className="text-white/40 font-mono text-sm tracking-widest">{item.num}</span>
                <span className="text-2xl grayscale opacity-70">{item.icon}</span>
              </div>
              <h3 className="text-xl font-bold uppercase tracking-wider mb-2 text-[#00f0ff]">{item.title}</h3>
              <p className="text-white/80 font-mono text-sm leading-relaxed mb-4">{item.stack}</p>
              <div className="text-[#00f0ff]/60 font-mono text-[10px] uppercase tracking-widest border border-[#00f0ff]/20 px-3 py-1.5 inline-block bg-[#00f0ff]/5 rounded-sm w-full text-center">
                {item.status}
              </div>
            </div>
          </div>
        ))}
        
        {/* Mobile Final System Active */}
        <div className="h-[50svh] flex items-center justify-center px-6">
           <div className="px-6 py-3 bg-[#00f0ff]/10 border border-[#00f0ff]/40 rounded backdrop-blur-md text-center shadow-[0_0_30px_rgba(0,240,255,0.3)]">
              <span className="text-[#00f0ff] font-bold text-sm tracking-[0.3em] uppercase block mb-1">Ecosystem Operational</span>
              <span className="text-white/60 font-mono text-[10px] tracking-widest">ALL NODES SYNCHRONIZED</span>
            </div>
        </div>

      </div>

    </section>
  );
}
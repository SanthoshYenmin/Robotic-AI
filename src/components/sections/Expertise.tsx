"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import ExpertiseTree, { ExpertiseTreeRef } from "@/components/three/ExpertiseTree";

gsap.registerPlugin(ScrollTrigger);

export default function Expertise() {
  const sectionRef = useRef<HTMLElement>(null);
  const treeRef = useRef<ExpertiseTreeRef>(null);
  
  const [isMounted, setIsMounted] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  // HTML Element Refs
  const titleRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const card4Ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section || !isMounted || !treeRef.current) return;

    const { 
      coreRef, line1Ref, line2Ref, line3Ref, line4Ref,
      node1Ref, node2Ref, node3Ref, node4Ref
    } = treeRef.current;

    let mm = gsap.matchMedia();

    // ------------------------------------
    // DESKTOP ANIMATION
    // ------------------------------------
    mm.add("(min-width: 768px)", () => {
      // Initial 3D states — target .scale (Vector3) directly, not wrapped in array
      if (line1Ref.current) gsap.set(line1Ref.current.scale, { x: 0, y: 0, z: 0 });
      if (line2Ref.current) gsap.set(line2Ref.current.scale, { x: 0, y: 0, z: 0 });
      if (line3Ref.current) gsap.set(line3Ref.current.scale, { x: 0, y: 0, z: 0 });
      if (line4Ref.current) gsap.set(line4Ref.current.scale, { x: 0, y: 0, z: 0 });
      if (node1Ref.current) gsap.set(node1Ref.current.scale, { x: 0, y: 0, z: 0 });
      if (node2Ref.current) gsap.set(node2Ref.current.scale, { x: 0, y: 0, z: 0 });
      if (node3Ref.current) gsap.set(node3Ref.current.scale, { x: 0, y: 0, z: 0 });
      if (node4Ref.current) gsap.set(node4Ref.current.scale, { x: 0, y: 0, z: 0 });

      // Reset positions in case they were changed by mobile
      if (node1Ref.current) gsap.set(node1Ref.current.position, { x: -3, y: 2, z: 0 });
      if (node2Ref.current) gsap.set(node2Ref.current.position, { x: 3, y: 2, z: 0 });
      if (node3Ref.current) gsap.set(node3Ref.current.position, { x: -3, y: -2, z: 0 });
      if (node4Ref.current) gsap.set(node4Ref.current.position, { x: 3, y: -2, z: 0 });

      // Initial HTML states
      gsap.set([card1Ref.current, card2Ref.current, card3Ref.current, card4Ref.current], { opacity: 0, y: 20 });
      gsap.set(titleRef.current, { opacity: 0, scale: 0.9 });
      if (coreRef.current) gsap.set(coreRef.current.scale, { x: 1, y: 1, z: 1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=4000",
          pin: true,
          scrub: 1,
          refreshPriority: 8,
        }
      });

      // Step 1: AI & Robotics (Top Left)
      tl.to(line1Ref.current!.scale, { x: 1, y: 1, z: 1, duration: 1 }, 0)
        .to(node1Ref.current!.scale, { x: 1, y: 1, z: 1, duration: 1, ease: "back.out(1.7)" }, 0.5)
        .to(card1Ref.current, { opacity: 1, y: 0, duration: 1 }, 1);

      // Step 2: Computer Vision (Top Right)
      tl.to(line2Ref.current!.scale, { x: 1, y: 1, z: 1, duration: 1 }, 2)
        .to(node2Ref.current!.scale, { x: 1, y: 1, z: 1, duration: 1, ease: "back.out(1.7)" }, 2.5)
        .to(card2Ref.current, { opacity: 1, y: 0, duration: 1 }, 3);

      // Step 3: Autonomous Systems (Bottom Left)
      tl.to(line3Ref.current!.scale, { x: 1, y: 1, z: 1, duration: 1 }, 4)
        .to(node3Ref.current!.scale, { x: 1, y: 1, z: 1, duration: 1, ease: "back.out(1.7)" }, 4.5)
        .to(card3Ref.current, { opacity: 1, y: 0, duration: 1 }, 5);

      // Step 4: Robotics Automation (Bottom Right)
      tl.to(line4Ref.current!.scale, { x: 1, y: 1, z: 1, duration: 1 }, 6)
        .to(node4Ref.current!.scale, { x: 1, y: 1, z: 1, duration: 1, ease: "back.out(1.7)" }, 6.5)
        .to(card4Ref.current, { opacity: 1, y: 0, duration: 1 }, 7);

      // Final Step: Central Title Reveals
      tl.to(coreRef.current!.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 2, ease: "power2.inOut" }, 8)
        .to(titleRef.current, { opacity: 1, scale: 1, duration: 2, ease: "power2.out" }, 8);
    });

    // ------------------------------------
    // MOBILE ANIMATION
    // ------------------------------------
    mm.add("(max-width: 767px)", () => {
      // Hide all lines on mobile — target .scale (Vector3) individually
      if (line1Ref.current) gsap.set(line1Ref.current.scale, { x: 0, y: 0, z: 0 });
      if (line2Ref.current) gsap.set(line2Ref.current.scale, { x: 0, y: 0, z: 0 });
      if (line3Ref.current) gsap.set(line3Ref.current.scale, { x: 0, y: 0, z: 0 });
      if (line4Ref.current) gsap.set(line4Ref.current.scale, { x: 0, y: 0, z: 0 });

      // Center all nodes and hide them initially
      const nodes = [node1Ref.current, node2Ref.current, node3Ref.current, node4Ref.current];
      nodes.forEach(node => {
        if (node) {
          gsap.set(node.position, { x: 0, y: 1, z: 0 });
          gsap.set(node.scale, { x: 0, y: 0, z: 0 });
        }
      });

      // HTML setup
      gsap.set([card1Ref.current, card2Ref.current, card3Ref.current, card4Ref.current], { opacity: 0, y: 50 });

      // Intro ScrollTrigger — target .scale (Vector3)
      if (coreRef.current) {
        gsap.to(coreRef.current.scale, {
          x: 1.5, y: 1.5, z: 1.5,
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=500",
            scrub: 1,
          }
        });
      }

      // Helper for mobile scroll steps
      const setupMobileCard = (cardRef: any, nodeRef: THREE.Group | null) => {
        if (!nodeRef || !coreRef.current) return;
        gsap.to(cardRef, {
          opacity: 1, y: 0, duration: 0.5,
          scrollTrigger: {
            trigger: cardRef,
            start: "top 80%",
            toggleActions: "play reverse play reverse",
          }
        });

        // Target .scale (Vector3) not the group itself
        gsap.to(nodeRef.scale, {
          x: 1.5, y: 1.5, z: 1.5, duration: 0.5, ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: cardRef,
            start: "top 70%",
            toggleActions: "play reverse play reverse",
          }
        });

        // Hide core when a specific node is active
        gsap.to(coreRef.current.scale, {
          x: 0, y: 0, z: 0, duration: 0.5,
          scrollTrigger: {
            trigger: cardRef,
            start: "top 70%",
            toggleActions: "play reverse play reverse",
          }
        });
      };

      setupMobileCard(card1Ref.current, node1Ref.current);
      setupMobileCard(card2Ref.current, node2Ref.current);
      setupMobileCard(card3Ref.current, node3Ref.current);
      setupMobileCard(card4Ref.current, node4Ref.current);
    });

    return () => mm.revert(); // Cleanup matchMedia
  }, { scope: sectionRef, dependencies: [isMounted] });

  const Card = ({ refObj, num, title, desc, onHover, onLeave, alignClass }: any) => (
    <div 
      ref={refObj} 
      onMouseEnter={onHover} 
      onMouseLeave={onLeave}
      className={`w-[85vw] max-w-sm md:w-72 p-6 md:p-8 backdrop-blur-md bg-black/60 border border-white/10 hover:border-[#00f0ff]/50 transition-colors duration-300 mx-auto md:mx-0 ${alignClass}`}
    >
      <div className="text-[#00f0ff] font-mono text-xs tracking-widest mb-2 md:mb-4">{num}</div>
      <h3 className="text-white font-bold text-lg md:text-xl mb-2 md:mb-4">{title}</h3>
      <p className="text-white/60 text-sm leading-relaxed">{desc}</p>
    </div>
  );

  return (
    <section ref={sectionRef} className="relative w-full md:h-screen bg-[#0a0f12] md:overflow-hidden">
      
      {/* 3D Scene - Sticky for mobile, Absolute for desktop */}
      <div className="sticky top-0 w-full h-[100svh] z-10 pointer-events-none md:absolute md:inset-0">
        
        {/* Background Grid */}
        <div className="absolute inset-0 z-0 opacity-10" style={{
          backgroundImage: "linear-gradient(rgba(0,240,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }} />

        <Canvas camera={{ position: [0, 0, 7], fov: 50 }} gl={{ alpha: true, antialias: true }} onCreated={() => setIsMounted(true)}>
          <ExpertiseTree ref={treeRef} hoveredNode={hoveredNode} />
        </Canvas>
        
        {/* Central Title Reveal (Desktop Only) */}
        <div ref={titleRef} className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none z-20">
          <div className="backdrop-blur-sm bg-black/40 p-8 border border-[#00f0ff]/20 rounded-2xl text-center">
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">
              Where Intelligence <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-white/50">Meets Engineering.</span>
            </h2>
          </div>
        </div>
      </div>

      {/* HTML Overlays - Scrolling content on Mobile, Pinned on Desktop */}
      <div className="relative z-20 w-full md:h-[100svh] md:pointer-events-none">
        <div className="container mx-auto relative md:h-full flex flex-col md:block">
          
          {/* Mobile Intro Header */}
          <div className="md:absolute top-32 left-6 md:left-12 pt-24 pb-48 md:pt-0 md:pb-0 px-6 md:px-0">
            <div className="flex items-center gap-4 opacity-50 mb-8 md:mb-0">
              <span className="text-white/40 font-mono text-sm tracking-widest">03</span>
              <div className="w-16 h-px bg-white/20" />
              <span className="text-[#00f0ff] font-mono text-sm uppercase tracking-[0.3em]">02 / EXPERTISE</span>
            </div>
            
            <div className="md:hidden mt-8 mb-12">
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-tight">
                Where Intelligence <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-white/50">Meets Engineering.</span>
              </h2>
            </div>

            <p className="text-white/50 text-sm font-light max-w-sm mt-4 md:mt-12 md:absolute md:top-12">
              I work across robotics, artificial intelligence, and automation to create systems that are smarter, faster, and more autonomous.
            </p>
          </div>

          {/* 4 Interactive Cards */}
          <div className="pointer-events-auto flex flex-col md:block gap-[60vh] pb-[30vh] pt-[20vh] md:p-0">
            <Card 
              refObj={card1Ref} num="01" title="AI & Robotics" 
              desc="Building intelligent robots capable of perception, decision-making, and adaptive behavior."
              alignClass="md:absolute md:top-[25%] md:left-[5%]" 
              onHover={() => setHoveredNode(1)} onLeave={() => setHoveredNode(null)}
            />
            <Card 
              refObj={card2Ref} num="02" title="Computer Vision" 
              desc="Giving robots the ability to see, identify, track, and understand their surroundings."
              alignClass="md:absolute md:top-[25%] md:right-[5%]" 
              onHover={() => setHoveredNode(2)} onLeave={() => setHoveredNode(null)}
            />
            <Card 
              refObj={card3Ref} num="03" title="Autonomous Systems" 
              desc="Developing robots that can navigate, plan, and operate with minimal human intervention."
              alignClass="md:absolute md:bottom-[15%] md:left-[5%]" 
              onHover={() => setHoveredNode(3)} onLeave={() => setHoveredNode(null)}
            />
            <Card 
              refObj={card4Ref} num="04" title="Robotics Automation" 
              desc="Designing automated robotic workflows for industrial and real-world applications."
              alignClass="md:absolute md:bottom-[15%] md:right-[5%]" 
              onHover={() => setHoveredNode(4)} onLeave={() => setHoveredNode(null)}
            />
          </div>

        </div>
      </div>
    </section>
  );
}
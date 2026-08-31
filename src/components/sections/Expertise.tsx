"use client";

import { useRef, useState, Suspense, useEffect } from "react";
import { usePreloaderReady } from "@/hooks/usePreloaderReady";
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
  
  const isMounted = usePreloaderReady();
  const [treeLoaded, setTreeLoaded] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  // HTML Element Refs
  const titleRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const card4Ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section || !treeLoaded || !treeRef.current) return;

    const { 
      coreRef, line1Ref, line2Ref, line3Ref, line4Ref,
      node1Ref, node2Ref, node3Ref, node4Ref
    } = treeRef.current;

    let mm = gsap.matchMedia();

    // ------------------------------------
    // DESKTOP ANIMATION
    // ------------------------------------
    mm.add("(min-width: 768px)", () => {
      // Initial 3D states — target .scale (Vector3) directly
      if (coreRef.current) gsap.set(coreRef.current.scale, { x: 0, y: 0, z: 0 });
      if (node1Ref.current) gsap.set(node1Ref.current.scale, { x: 0, y: 0, z: 0 });
      if (node2Ref.current) gsap.set(node2Ref.current.scale, { x: 0, y: 0, z: 0 });
      if (node3Ref.current) gsap.set(node3Ref.current.scale, { x: 0, y: 0, z: 0 });
      if (node4Ref.current) gsap.set(node4Ref.current.scale, { x: 0, y: 0, z: 0 });
      if (line1Ref.current) gsap.set(line1Ref.current.scale, { x: 0, y: 0, z: 0 });
      if (line2Ref.current) gsap.set(line2Ref.current.scale, { x: 0, y: 0, z: 0 });
      if (line3Ref.current) gsap.set(line3Ref.current.scale, { x: 0, y: 0, z: 0 });
      if (line4Ref.current) gsap.set(line4Ref.current.scale, { x: 0, y: 0, z: 0 });

      // Reset positions in case they were changed by mobile
      if (node1Ref.current) gsap.set(node1Ref.current.position, { x: -3, y: 2, z: 0 });
      if (node2Ref.current) gsap.set(node2Ref.current.position, { x: 3, y: 2, z: 0 });
      if (node3Ref.current) gsap.set(node3Ref.current.position, { x: -3, y: -2, z: 0 });
      if (node4Ref.current) gsap.set(node4Ref.current.position, { x: 3, y: -2, z: 0 });

      // Initial HTML states
      gsap.set([card1Ref.current, card2Ref.current, card3Ref.current, card4Ref.current], { opacity: 0, y: 50 });
      gsap.set(titleRef.current, { opacity: 0, scale: 0.8 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=3500", // Increased scroll length for smoother sequence
          pin: true,
          scrub: 1,
          refreshPriority: 8,
        }
      });

      // 1. Central Globe Appears
      tl.to(coreRef.current!.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 2, ease: "back.out(1.5)" })
      // 2. Title Appears
        .to(titleRef.current, { opacity: 1, scale: 1, duration: 1.5, ease: "power2.out" })
      
      // 3. First Node Sequence (Top Left)
        .to(line1Ref.current!.scale, { x: 1, y: 1, z: 1, duration: 1 })
        .to(node1Ref.current!.scale, { x: 1, y: 1, z: 1, duration: 1, ease: "back.out(1.7)" }, "-=0.2")
        .to(card1Ref.current, { opacity: 1, y: 0, duration: 1 }, "-=0.2")
        
      // 4. Second Node Sequence (Top Right)
        .to(line2Ref.current!.scale, { x: 1, y: 1, z: 1, duration: 1 })
        .to(node2Ref.current!.scale, { x: 1, y: 1, z: 1, duration: 1, ease: "back.out(1.7)" }, "-=0.2")
        .to(card2Ref.current, { opacity: 1, y: 0, duration: 1 }, "-=0.2")
        
      // 5. Third Node Sequence (Bottom Left)
        .to(line3Ref.current!.scale, { x: 1, y: 1, z: 1, duration: 1 })
        .to(node3Ref.current!.scale, { x: 1, y: 1, z: 1, duration: 1, ease: "back.out(1.7)" }, "-=0.2")
        .to(card3Ref.current, { opacity: 1, y: 0, duration: 1 }, "-=0.2")
        
      // 6. Fourth Node Sequence (Bottom Right)
        .to(line4Ref.current!.scale, { x: 1, y: 1, z: 1, duration: 1 })
        .to(node4Ref.current!.scale, { x: 1, y: 1, z: 1, duration: 1, ease: "back.out(1.7)" }, "-=0.2")
        .to(card4Ref.current, { opacity: 1, y: 0, duration: 1 }, "-=0.2");
    });

    // ------------------------------------
    // MOBILE ANIMATION
    // ------------------------------------
    mm.add("(max-width: 767px)", () => {
      // Hide all lines on mobile
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

      // Pin the 3D background using GSAP since CSS sticky might fail due to overflow parents
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        pin: section.querySelector(".mobile-3d-bg"),
        pinSpacing: false,
      });

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
  }, { scope: sectionRef, dependencies: [treeLoaded] });

  const Card = ({ refObj, num, title, desc, onHover, onLeave, alignClass, style }: any) => (
    <div 
      ref={refObj} 
      onMouseEnter={onHover} 
      onMouseLeave={onLeave}
      style={{ ...style, padding: '0.8rem' }}
      className={`w-[85vw] max-w-sm md:w-80 backdrop-blur-md bg-black/60 border border-[#00f0ff]/60 shadow-[0_0_20px_rgba(0,240,255,0.1)] hover:border-[#00f0ff] hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] hover:scale-105 transition-all duration-300 mx-auto md:mx-0 rounded-lg ${alignClass}`}
    >
      <div className="text-[#00f0ff] font-mono text-sm tracking-widest mb-3 md:mb-5">{num}</div>
      <h3 className="text-white font-bold text-xl md:text-2xl mb-3 md:mb-5">{title}</h3>
      <p className="text-white/70 text-sm md:text-base leading-relaxed">{desc}</p>
    </div>
  );

  return (
    <section ref={sectionRef} className="relative w-full md:h-screen bg-[#0a0f12] md:overflow-hidden">
      
      {/* 3D Scene - Sticky for mobile, Absolute for desktop */}
      <div className="mobile-3d-bg sticky top-0 w-full h-[100svh] z-10 pointer-events-none md:absolute md:inset-0">
        
        {/* Background Grid */}
        <div className="absolute inset-0 z-0 opacity-10" style={{
          backgroundImage: "linear-gradient(rgba(0,240,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }} />

        <Canvas camera={{ position: [0, 0, 7], fov: 50 }} gl={{ alpha: true, antialias: true }}>
          <Suspense fallback={null}>
            {isMounted && <ExpertiseTree ref={treeRef} hoveredNode={hoveredNode} onReady={() => setTreeLoaded(true)} />}
          </Suspense>
        </Canvas>
        
        {/* Central Title Reveal (Desktop Only) */}
        <div ref={titleRef} className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none z-20">
          <div 
            style={{ padding: '0.8rem' }}
            className="backdrop-blur-sm bg-black/40 border border-[#00f0ff]/20 rounded-2xl text-center"
          >
            <h2 className="section-heading mb-0">
              Where Intelligence <br />
              <span className="heading-cyan">Meets Engineering.</span>
            </h2>
          </div>
        </div>
      </div>

      {/* HTML Overlays - Scrolling content on Mobile, Pinned on Desktop */}
      <div className="relative z-20 w-full md:h-[100svh] md:pointer-events-none">
        <div className="container mx-auto relative md:h-full flex flex-col md:block">
          
          {/* Desktop: Section label + short description — top-left */}
          <div className="hidden md:block md:absolute spx-l pointer-events-none" style={{ top: '128px' }}>
            <div className="section-label mb-1">
              <span className="section-label-text">EXPERTISE</span>
            </div>
            <p className="section-body text-[11px] max-w-[180px] opacity-40 leading-relaxed">
              Robotics · AI · Automation
            </p>
          </div>

          {/* Mobile: Full scrollable header (label + title + description) */}
          <div className="md:hidden pt-24 pb-48 px-6">
            <div className="section-label">
              <span className="section-label-text">EXPERTISE</span>
            </div>
            <div className="mt-6 mb-10">
              <h2 className="section-heading">
                Where Intelligence <br />
                <span className="heading-cyan">Meets Engineering.</span>
              </h2>
            </div>
            <p className="section-body">
              I work across robotics, artificial intelligence, and automation to create systems that are smarter, faster, and more autonomous.
            </p>
          </div>

          {/* 4 Interactive Cards */}
          <div className="pointer-events-auto flex flex-col md:block gap-[60vh] pb-[30vh] pt-[20vh] md:p-0">
            <Card 
              refObj={card1Ref} num="01" title="AI & Robotics" 
              desc="Building intelligent robots capable of perception, decision-making, and adaptive behavior."
              alignClass="md:absolute spx-l" 
              style={{ top: '22%' }}
              onHover={() => setHoveredNode(1)} onLeave={() => setHoveredNode(null)}
            />
            {/* Card 2 — top RIGHT, same row as Card 1 */}
            <Card 
              refObj={card2Ref} num="02" title="Computer Vision" 
              desc="Giving robots the ability to see, identify, track, and understand their surroundings."
              alignClass="md:absolute spx-r" 
              style={{ top: '22%' }}
              onHover={() => setHoveredNode(2)} onLeave={() => setHoveredNode(null)}
            />
            {/* Card 3 — bottom LEFT, same row as Card 4 */}
            <Card 
              refObj={card3Ref} num="03" title="Autonomous Systems" 
              desc="Developing robots that can navigate, plan, and operate with minimal human intervention."
              alignClass="md:absolute spx-l" 
              style={{ bottom: '10%' }}
              onHover={() => setHoveredNode(3)} onLeave={() => setHoveredNode(null)}
            />
            {/* Card 4 — bottom RIGHT, same row as Card 3 */}
            <Card 
              refObj={card4Ref} num="04" title="Robotics Automation" 
              desc="Designing automated robotic workflows for industrial and real-world applications."
              alignClass="md:absolute spx-r" 
              style={{ bottom: '10%' }}
              onHover={() => setHoveredNode(4)} onLeave={() => setHoveredNode(null)}
            />
          </div>

        </div>
      </div>
    </section>
  );
}
"use client";

import { useRef, useState, Suspense, useEffect } from "react";
import { usePreloaderReady } from "@/hooks/usePreloaderReady";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import { View, PerspectiveCamera } from "@react-three/drei";
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

  const mCard1Ref = useRef<HTMLDivElement>(null);
  const mCard2Ref = useRef<HTMLDivElement>(null);
  const mCard3Ref = useRef<HTMLDivElement>(null);
  const mCard4Ref = useRef<HTMLDivElement>(null);

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
    // MOBILE ANIMATION - INTELLIGENCE PIPELINE
    // ------------------------------------
    mm.add("(max-width: 767px)", () => {
      // Hide all desktop connecting lines and 3D nodes
      if (line1Ref.current) gsap.set(line1Ref.current.scale, { x: 0, y: 0, z: 0 });
      if (line2Ref.current) gsap.set(line2Ref.current.scale, { x: 0, y: 0, z: 0 });
      if (line3Ref.current) gsap.set(line3Ref.current.scale, { x: 0, y: 0, z: 0 });
      if (line4Ref.current) gsap.set(line4Ref.current.scale, { x: 0, y: 0, z: 0 });

      const nodes = [node1Ref.current, node2Ref.current, node3Ref.current, node4Ref.current];
      nodes.forEach(node => {
        if (node) {
          gsap.set(node.scale, { x: 0, y: 0, z: 0 });
        }
      });

      // Pin the 3D background
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        pin: section.querySelector(".mobile-3d-bg"),
        pinSpacing: false,
      });

      // Intro Animation - Core enters at center
      if (coreRef.current) {
        gsap.set(coreRef.current.position, { x: 0, y: 0, z: 0 }); // Center of screen
        gsap.set(coreRef.current.scale, { x: 0, y: 0, z: 0 });

        gsap.to(coreRef.current.scale, {
          x: 1, y: 1, z: 1,
          duration: 1.5,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none reverse",
          }
        });
      }

      // 1. Pipeline Line Animation (Fills up as user scrolls)
      const pipelineLine = section.querySelector(".pipeline-line-fill");
      if (pipelineLine) {
        gsap.fromTo(pipelineLine,
          { height: "0%" },
          {
            height: "100%",
            ease: "none",
            scrollTrigger: {
              trigger: section.querySelector(".pipeline-container"),
              start: "top 50%",
              end: "bottom 50%",
              scrub: 0.5,
            }
          }
        );
      }

      // 2. Sequential Card Activation
      const cards = [mCard1Ref.current, mCard2Ref.current, mCard3Ref.current, mCard4Ref.current];
      cards.forEach((card, index) => {
        if (!card) return;

        const dot = card.querySelector(".pipeline-dot");

        // Initial state
        gsap.set(card, { opacity: 0.4, scale: 0.95 });
        if (dot) gsap.set(dot, { scale: 0, backgroundColor: "#003333", borderColor: "#006666" });

        // Animation when active
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 60%", // Activate when reaching middle of screen
            end: "bottom 40%",
            toggleActions: "play reverse play reverse",
          }
        });

        tl.to(card, {
          opacity: 1,
          scale: 1.03, // Slight scale up
          duration: 0.4,
          ease: "power2.out",
          boxShadow: "0 0 30px rgba(0,240,255,0.2)",
          borderColor: "rgba(0,240,255,0.8)"
        }, 0);

        if (dot) {
          tl.to(dot, {
            scale: 1,
            backgroundColor: "#00f0ff",
            borderColor: "#ffffff",
            boxShadow: "0 0 15px rgba(0,240,255,0.8)",
            duration: 0.4,
            ease: "back.out(2)"
          }, 0);
        }
      });
    });

    return () => mm.revert(); // Cleanup matchMedia
  }, { scope: sectionRef, dependencies: [treeLoaded] });

  const Card = ({ refObj, num, title, desc, onHover, onLeave, alignClass, style }: any) => (
    <div
      ref={refObj}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{ ...style, padding: '1rem' }}
      className={`w-full md:w-80 backdrop-blur-md bg-black/60 border border-[#00f0ff]/20 shadow-[0_0_10px_rgba(0,240,255,0.05)] md:hover:border-[#00f0ff] md:hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] transition-colors duration-300 mx-auto md:mx-0 rounded-lg z-50 ${alignClass}`}
    >
      <div className="flex items-baseline gap-3 mb-2 md:mb-4">
        <span className="text-[#00f0ff] font-mono text-xl md:text-2xl tracking-widest leading-none">{num}</span>
        <h3 className="text-white font-bold text-xl md:text-2xl leading-none">{title}</h3>
      </div>
      <p className="text-white/70 text-sm md:text-base leading-relaxed">{desc}</p>

      {/* Mobile Pipeline Dot (Hidden on Desktop) */}
      <div className="pipeline-dot md:hidden absolute left-[-29px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-[#006666] bg-[#003333] z-20" />
    </div>
  );

  return (
    <section ref={sectionRef} className="relative w-full md:h-screen bg-transparent md:overflow-hidden">

      {/* 3D Scene - Sticky for mobile, Absolute for desktop */}
      <div className="mobile-3d-bg sticky top-0 w-full h-[100svh] z-10 pointer-events-none md:absolute md:inset-0">

        {/* Background Grid */}
        <div className="absolute inset-0 z-0 opacity-10" style={{
          backgroundImage: "linear-gradient(rgba(0,240,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }} />

        <View className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <PerspectiveCamera makeDefault position={[0, 0, 7]} fov={50} />
          <Suspense fallback={null}>
            {isMounted && <ExpertiseTree ref={treeRef} hoveredNode={hoveredNode} onReady={() => setTreeLoaded(true)} />}
          </Suspense>
        </View>

        {/* Central Title Reveal (Desktop Only) */}
        <div ref={titleRef} className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none z-20 opacity-0">
          <div
            style={{ padding: '0.8rem' }}
            className="backdrop-blur-sm bg-black/40 border border-[#00f0ff]/20 rounded-2xl text-center"
          >
            <h2 className="section-heading mb-0">
              Where Intelligence <br />
              <span className="text-[#00f0ff]">Meets Engineering.</span>
            </h2>
          </div>
        </div>
      </div>

      {/* HTML Overlays - Scrolling content on Mobile, Pinned on Desktop */}
      <div className="relative z-20 w-full md:h-[100svh] md:pointer-events-none">
        <div className="container mx-auto px-6 md:px-0 relative md:h-full flex flex-col md:block">

          {/* Desktop: Section label + short description — top-left */}
          <div className="hidden md:block md:absolute spx-l pointer-events-none" style={{ top: '128px' }}>
            <div className="section-label">
              <span className="section-label-text">EXPERTISE</span>
            </div>
          </div>

          {/* Mobile: Full scrollable header (label + title + description) */}
          <div className="md:hidden pt-24" style={{ paddingBottom: '10vh' }}>
            <div className="section-label">
              <span className="section-label-text">EXPERTISE</span>
            </div>
            <div className="mt-6 mb-10">
              <h2 className="section-heading">
                Where Intelligence <br />
                <span className="text-[#00f0ff]">Meets Engineering.</span>
              </h2>
            </div>
            <p className="section-body">
              I work across robotics, artificial intelligence, and automation to create systems that are smarter, faster, and more autonomous.
            </p>
          </div>

          {/* Desktop Cards */}
          <div className="hidden md:block pointer-events-auto">
            <Card
              refObj={card1Ref} num="01" title="AI & Robotics"
              desc="Building intelligent robots capable of perception, decision-making, and adaptive behavior."
              alignClass="md:absolute spx-l"
              style={{ top: '22%' }}
              onHover={() => setHoveredNode(1)} onLeave={() => setHoveredNode(null)}
            />
            <Card
              refObj={card2Ref} num="02" title="Computer Vision"
              desc="Giving robots the ability to see, identify, track, and understand their surroundings."
              alignClass="md:absolute spx-r"
              style={{ top: '22%' }}
              onHover={() => setHoveredNode(2)} onLeave={() => setHoveredNode(null)}
            />
            <Card
              refObj={card3Ref} num="03" title="Autonomous Systems"
              desc="Developing robots that can navigate, plan, and operate with minimal human intervention."
              alignClass="md:absolute spx-l"
              style={{ bottom: '10%' }}
              onHover={() => setHoveredNode(3)} onLeave={() => setHoveredNode(null)}
            />
            <Card
              refObj={card4Ref} num="04" title="Robotics Automation"
              desc="Designing automated robotic workflows for industrial and real-world applications."
              alignClass="md:absolute spx-r"
              style={{ bottom: '10%' }}
              onHover={() => setHoveredNode(4)} onLeave={() => setHoveredNode(null)}
            />
          </div>

          {/* Mobile Intelligence Pipeline */}
          <div className="md:hidden pipeline-container relative ml-4 pt-[10vh]" style={{ paddingBottom: '20vh', marginBottom: '20vh' }}>

            {/* Background track line */}
            <div className="absolute left-0 top-0 bottom-24 w-[2px] bg-white/10 z-0 rounded-full" />

            {/* Fill track line */}
            <div className="pipeline-line-fill absolute left-0 top-0 w-[2px] bg-gradient-to-b from-[#00f0ff] to-[#00f0ff] z-10 shadow-[0_0_15px_rgba(0,240,255,0.5)] rounded-full" />

            <div className="flex flex-col gap-[15vh] pointer-events-auto relative z-20 pl-8">
              <Card
                refObj={mCard1Ref} num="01" title="AI & Robotics"
                desc="Building intelligent robots capable of perception, decision-making, and adaptive behavior."
                alignClass="relative w-full max-w-[80vw]"
              />
              <Card
                refObj={mCard2Ref} num="02" title="Computer Vision"
                desc="Giving robots the ability to see, identify, track, and understand their surroundings."
                alignClass="relative w-full max-w-[80vw]"
              />
              <Card
                refObj={mCard3Ref} num="03" title="Autonomous Systems"
                desc="Developing robots that can navigate, plan, and operate with minimal human intervention."
                alignClass="relative w-full max-w-[80vw]"
              />
              <Card
                refObj={mCard4Ref} num="04" title="Robotics Automation"
                desc="Designing automated robotic workflows for industrial and real-world applications."
                alignClass="relative w-full max-w-[80vw]"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
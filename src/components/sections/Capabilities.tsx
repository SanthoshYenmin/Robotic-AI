"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import RevealText from "@/components/animations/RevealText";

gsap.registerPlugin(ScrollTrigger);

const capabilities = [
  {
    num: "01",
    title: "Perception",
    desc: "Understanding the world in real time.",
    image: "/images/perception_ai_1787817012354.jpg"
  },
  {
    num: "02",
    title: "Intelligence",
    desc: "Reasoning through complex physical tasks.",
    image: "/images/reasoning_ai_1787817026765.jpg"
  },
  {
    num: "03",
    title: "Action",
    desc: "Turning decisions into precise movement.",
    image: "/images/planning_ai_1787817057316.jpg"
  },
];

export default function Capabilities() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    const container = containerRef.current;
    if (!container) return;

    const cards = cardsRef.current.filter(Boolean);
    
    // Initial states
    gsap.set(cards, { 
      transformOrigin: "center center",
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    });

    // Card 0 starts in center. Cards 1 & 2 start in the back with a 180 degree flip.
    gsap.set(cards[1], { scale: 0.5, opacity: 0, yPercent: 100, rotationX: -180, rotationZ: 5 });
    gsap.set(cards[2], { scale: 0.5, opacity: 0, yPercent: 100, rotationX: -180, rotationZ: -5 });

    const tl = gsap.timeline();

    // Scroll Step 1: Card 0 goes up (flipping back), Card 1 comes to center (unflipping)
    tl.to(cards[0], { yPercent: -150, opacity: 0, rotationX: 90, rotationZ: -10, scale: 0.8, ease: "power2.inOut" }, 0)
      .to(cards[1], { yPercent: 0, opacity: 1, scale: 1, rotationX: 0, rotationZ: 2, ease: "back.out(1.5)" }, 0);

    // Scroll Step 2: Card 1 goes up, Card 2 comes to center
    tl.to(cards[1], { yPercent: -150, opacity: 0, rotationX: 90, rotationZ: 10, scale: 0.8, ease: "power2.inOut" }, 1)
      .to(cards[2], { yPercent: 0, opacity: 1, scale: 1, rotationX: 0, rotationZ: -2, ease: "back.out(1.5)" }, 1);

    // Pin the entire container
    ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: `+=${cards.length * 150}%`,
      pin: true,
      scrub: 1.5,
      animation: tl
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="h-[100svh] bg-black relative overflow-hidden flex flex-col justify-center perspective-[2000px]">
      <div className="absolute top-12 left-0 right-0 z-10 pointer-events-none">
        <div className="container mx-auto">
          <RevealText>
            <h2 className="text-sm font-semibold tracking-[0.3em] uppercase text-gray-500 mb-24 border-b border-white/10 pb-6">
              What We Build
            </h2>
          </RevealText>
        </div>
      </div>
      
      <div className="relative w-full h-[70svh] container mx-auto">
        {capabilities.map((cap, index) => (
          <div
            key={cap.num}
            ref={(el) => { cardsRef.current[index] = el; }}
            className="w-full h-full rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl will-change-transform"
            style={{ zIndex: capabilities.length - index }}
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${cap.image})` }}
            />
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
            
            {/* Content */}
            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
              <span className="text-6xl md:text-8xl text-white/20 font-light font-mono leading-none mb-2">
                {cap.num}
              </span>
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-white mb-4">
                {cap.title}
              </h3>
              <p className="text-xl md:text-2xl text-gray-300 max-w-xl">
                {cap.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

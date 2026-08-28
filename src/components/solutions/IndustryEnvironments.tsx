"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const industries = [
  {
    id: "MANUFACTURING",
    color: "#ff6600",
    image: "/images/manufacturing_robot_1787816160233.jpg",
    problem: "Labor shortages in high-repetition, ergonomically hazardous assembly tasks.",
    task: "Co-manipulation of heavy payloads, autonomous sorting, and precise tool operation alongside human workers.",
    benefit: "24/7 operational uptime with zero physical fatigue and millimeter-level consistency."
  },
  {
    id: "WAREHOUSING",
    color: "#00f0ff",
    image: "/images/warehouse_robot_1787816175693.jpg",
    problem: "Inflexible infrastructure and slow response to supply chain spikes.",
    task: "Autonomous picking, dynamic palletizing, and navigating unstructured warehouse floors.",
    benefit: "Immediate capacity scaling with zero infrastructure changes required."
  },
  {
    id: "LOGISTICS",
    color: "#a300ff",
    image: "/images/logistics_robot_1787816200389.jpg",
    problem: "Bottlenecks in loading and unloading operations under extreme temperatures.",
    task: "Continuous loading of unstructured cargo from trailers and containers.",
    benefit: "Elimination of ergonomic injuries and continuous throughput optimization."
  },
  {
    id: "HEALTHCARE",
    color: "#00ffa6",
    image: "/images/healthcare_robot_1787816215155.jpg",
    problem: "Clinical staff burnout from repetitive physical logistics and material transport.",
    task: "Sterile material handling, lab sample delivery, and facility-wide physical assistance.",
    benefit: "Allowing human healthcare professionals to focus entirely on patient care."
  },
  {
    id: "HOSPITALITY",
    color: "#ff0066",
    image: "/images/hospitality_robot_1787816234698.jpg",
    problem: "Inconsistent service delivery and high turnover in physical service roles.",
    task: "Room delivery, facility navigation, and seamless human-robot interaction.",
    benefit: "Elevated, futuristic guest experiences with perfect operational reliability."
  }
];

export default function IndustryEnvironments() {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<(HTMLDivElement | null)[]>([]);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // Pin the container
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: `+=${industries.length * 100}%`,
      pin: true,
      onUpdate: (self) => {
        const index = Math.min(
          Math.floor(self.progress * industries.length),
          industries.length - 1
        );
        if (index !== activeIndex) {
          setActiveIndex(index);
          
          // Animate background color transition
          gsap.to(backgroundRef.current, {
            backgroundColor: industries[index].color,
            duration: 0.5,
            ease: "power2.out",
          });
        }
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [activeIndex]);

  return (
    <div className="relative w-full">
      <section ref={containerRef} className="h-screen w-full relative overflow-hidden bg-black flex items-center">
        {/* Dynamic Background */}
        <div 
          ref={backgroundRef}
          className="absolute inset-0 opacity-10 transition-colors duration-500"
          style={{ backgroundColor: industries[0].color }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-0"></div>
        
        <div className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col md:flex-row h-full">
          {/* Left Content Area - Static but updates based on state */}
          <div className="flex-1 flex flex-col justify-center h-full pr-12">
            <div className="max-w-xl">
              <h2 className="text-xs font-mono font-bold tracking-[0.3em] uppercase text-gray-500 mb-8">
                Target Environment {activeIndex + 1} / {industries.length}
              </h2>
              
              <h3 
                className="text-5xl md:text-7xl font-bold uppercase tracking-tight mb-12 transition-colors duration-500"
                style={{ color: industries[activeIndex].color }}
              >
                {industries[activeIndex].id}
              </h3>

              <div className="flex flex-col gap-8">
                <div>
                  <h4 className="text-white text-xs font-mono tracking-widest uppercase mb-2 border-b border-white/10 pb-2">Problem</h4>
                  <p className="text-gray-400 font-light text-lg">{industries[activeIndex].problem}</p>
                </div>
                <div>
                  <h4 className="text-white text-xs font-mono tracking-widest uppercase mb-2 border-b border-white/10 pb-2">Robot Task</h4>
                  <p className="text-gray-400 font-light text-lg">{industries[activeIndex].task}</p>
                </div>
                <div>
                  <h4 className="text-white text-xs font-mono tracking-widest uppercase mb-2 border-b border-white/10 pb-2">Benefit</h4>
                  <p className="text-white font-medium text-lg">{industries[activeIndex].benefit}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual Area - Cinematic Image */}
          <div className="flex-1 hidden md:flex items-center justify-center relative pl-8">
             <div className="w-full aspect-square md:aspect-[4/3] rounded-xl overflow-hidden relative border border-white/10 group">
                {/* Image layer */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-all duration-1000 group-hover:scale-105"
                  style={{ backgroundImage: `url(${industries[activeIndex].image})` }}
                />
                
                {/* Subtle vignette/gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                {/* Overlay UI */}
                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full animate-pulse shadow-[0_0_10px_currentColor]" style={{ backgroundColor: industries[activeIndex].color, color: industries[activeIndex].color }}></div>
                    <span className="font-mono text-[10px] tracking-widest text-white uppercase">Live Simulation</span>
                  </div>
                  <span className="font-mono text-[10px] tracking-widest text-white/50">{industries[activeIndex].id}</span>
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}

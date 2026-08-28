"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import RevealText from "@/components/animations/RevealText";

gsap.registerPlugin(ScrollTrigger);

const industries = [
  {
    id: "manufacturing",
    name: "Manufacturing",
    desc: "Autonomous operation in complex assembly environments.",
    image: "/images/manufacturing_robot_1787816160233.jpg"
  },
  {
    id: "logistics",
    name: "Logistics",
    desc: "Seamless material handling and intelligent routing.",
    image: "/images/logistics_robot_1787816200389.jpg"
  },
  {
    id: "healthcare",
    name: "Healthcare",
    desc: "Precision assistance in sterile environments.",
    image: "/images/healthcare_robot_1787816215155.jpg"
  },
  {
    id: "hospitality",
    name: "Hospitality",
    desc: "Natural human interaction and service delivery.",
    image: "/images/hospitality_robot_1787816234698.jpg"
  }
];

export default function Applications() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const container = containerRef.current;
    const leftCol = leftColRef.current;
    const rightCol = rightColRef.current;
    if (!container || !leftCol || !rightCol) return;

    // We want to pin the container, and scroll the left col UP and right col DOWN
    ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "+=2000",
      pin: true,
      scrub: 1,
      animation: gsap.timeline()
        .to(leftCol, { yPercent: -50, ease: "none" }, 0)
        .fromTo(rightCol, { yPercent: -50 }, { yPercent: 0, ease: "none" }, 0)
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="h-screen bg-black relative overflow-hidden flex items-center border-t border-white/5">
      
      <div className="absolute top-12 left-0 right-0 z-20 pointer-events-none">
        <div className="container mx-auto">
          <RevealText>
            <h2 className="text-sm font-semibold tracking-[0.3em] uppercase text-[#00f0ff] mb-24 border-b border-white/10 pb-6">
              Industry Applications
            </h2>
          </RevealText>
        </div>
      </div>

      <div className="container mx-auto h-full flex flex-col md:flex-row relative z-10 pt-32 pb-12 gap-8">
        
        {/* Left Column - Text (Scrolls UP) */}
        <div className="w-full md:w-1/2 h-full overflow-hidden relative mask-image-vertical">
          <div ref={leftColRef} className="flex flex-col gap-[15vh] pt-[20vh] pb-[20vh]">
            {industries.map((ind) => (
              <div key={ind.id} className="flex flex-col justify-center h-[50vh]">
                <h3 className="text-3xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight mb-4">
                  {ind.name}
                </h3>
                <p className="text-xl md:text-2xl text-gray-400 font-light max-w-md leading-relaxed">
                  {ind.desc}
                </p>
                <div className="w-12 h-[1px] bg-[#00f0ff] mt-6"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Images (Scrolls DOWN) */}
        <div className="w-full md:w-1/2 h-full overflow-hidden relative rounded-2xl border border-white/10">
          <div ref={rightColRef} className="flex flex-col h-[200%] w-full">
            {industries.map((ind) => (
              <div key={`${ind.id}-img`} className="w-full h-1/2 relative p-4">
                <div className="w-full h-full relative rounded-xl overflow-hidden shadow-2xl">
                  <div 
                    className="absolute inset-0 bg-cover bg-center grayscale hover:grayscale-0 transition-all duration-700"
                    style={{ backgroundImage: `url(${ind.image})` }}
                  />
                  <div className="absolute inset-0 bg-black/20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

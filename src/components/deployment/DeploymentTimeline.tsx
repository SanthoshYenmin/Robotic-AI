"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const stages = [
  { id: "01", title: "DISCOVER", desc: "Facility mapping and process analysis.", loc: "LAB" },
  { id: "02", title: "SIMULATE", desc: "Digital twin creation and task training.", loc: "SIMULATION" },
  { id: "03", title: "DEPLOY", desc: "Hardware arrival and initial integration.", loc: "FACTORY" },
  { id: "04", title: "LEARN", desc: "Edge adaptation and minor error correction.", loc: "FACTORY" },
  { id: "05", title: "SCALE", desc: "Replicating tasks across multiple units.", loc: "FLEET" },
  { id: "06", title: "OPTIMIZE", desc: "Continuous uptime and performance monitoring.", loc: "FLEET" }
];

export default function DeploymentTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const robotRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    if (!containerRef.current || !trackRef.current || !robotRef.current) return;

    // Pin the container and animate the robot down the track
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: `+=${stages.length * 80}%`,
      pin: true,
      onUpdate: (self) => {
        const index = Math.min(
          Math.floor(self.progress * stages.length),
          stages.length - 1
        );
        setActiveStage(index);
        
        // Move the visual robot indicator down the track
        gsap.to(robotRef.current, {
          y: self.progress * (trackRef.current!.offsetHeight - 24), // 24 is robot height
          duration: 0.1,
          ease: "none"
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div className="relative w-full">
      <section ref={containerRef} className="h-screen w-full bg-black relative flex items-center overflow-hidden">
        
        <div className="container mx-auto px-6 md:px-12 flex h-3/4">
          
          {/* Left Track Visualizer */}
          <div className="w-32 md:w-64 flex justify-center relative">
            <div ref={trackRef} className="w-[2px] h-full bg-white/10 relative rounded-full">
              {/* The "Robot" indicator */}
              <div 
                ref={robotRef}
                className="absolute left-1/2 -translate-x-1/2 top-0 w-6 h-6 border-2 border-[#00f0ff] bg-black rounded-sm flex items-center justify-center z-10"
              >
                 <div className="w-1.5 h-1.5 bg-[#00f0ff] rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 flex flex-col justify-center relative pl-8 md:pl-16">
            <div className="max-w-xl">
               <div className="mb-4 inline-flex items-center gap-2 border border-white/20 bg-white/5 px-3 py-1 rounded-sm">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-white font-mono text-[10px] uppercase tracking-widest">
                    LOCATION: {stages[activeStage].loc}
                  </span>
               </div>

               <h2 className="text-[#00f0ff] font-mono text-sm tracking-[0.3em] font-bold mb-4">
                 STAGE {stages[activeStage].id}
               </h2>
               
               <h3 className="text-5xl md:text-7xl font-bold uppercase tracking-tight text-white mb-6">
                 {stages[activeStage].title}
               </h3>
               
               <p className="text-gray-400 font-light text-xl leading-relaxed">
                 {stages[activeStage].desc}
               </p>
            </div>
          </div>

        </div>

      </section>
    </div>
  );
}


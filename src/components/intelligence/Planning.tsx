"use client";

import RevealText from "@/components/animations/RevealText";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import TiltWrapper from "@/components/animations/TiltWrapper";
import Badge3D from "@/components/ui/Badge3D";

const steps = ["Locate", "Navigate", "Reach", "Grip", "Lift", "Place"];

export default function Planning() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-32 md:py-48 min-h-screen bg-[#020202] relative border-t border-white/5 overflow-hidden flex items-center">
      <div className="absolute inset-0 bg-grid opacity-10"></div>
      
      <div className="container mx-auto px-6 md:px-12">
        <RevealText>
          <Badge3D text="04 — Planning" />
        </RevealText>
        
        <div className="flex flex-col lg:flex-row gap-12 items-end mb-16">
          <RevealText delay={0.1}>
            <div className="bg-black/60 backdrop-blur-md border border-[#00f0ff]/30 p-6 inline-block shrink-0">
              <span className="text-[#00f0ff] font-mono text-xs uppercase tracking-widest block mb-2">Current Task:</span>
              <span className="text-white font-mono text-xl uppercase tracking-wider">Move package to shelf</span>
            </div>
          </RevealText>
          
          <div className="flex-1 w-full h-48 md:h-64 relative group hidden md:block">
            <TiltWrapper className="h-full">
              <div className="w-full h-full rounded-xl border border-white/10 relative overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.05)]">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] group-hover:scale-105"
                  style={{ backgroundImage: 'url(/images/planning_ai_1787817057316.jpg)' }}
                />
                {/* Holographic flicker effect */}
                <div className="absolute inset-0 bg-[#00f0ff] opacity-0 mix-blend-overlay animate-[flicker_3s_infinite]"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              </div>
            </TiltWrapper>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full">
          {steps.map((step, index) => (
            <div key={step} className="flex-1 relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 left-full w-full h-[1px] bg-white/10 z-0 transform -translate-y-1/2">
                  <motion.div 
                    className="h-full bg-[#00f0ff]" 
                    initial={{ width: "0%" }}
                    animate={{ width: activeStep > index ? "100%" : "0%" }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}
              
              <motion.div 
                className={`relative z-10 p-6 border ${activeStep === index ? 'border-[#00f0ff] bg-[#00f0ff]/5' : activeStep > index ? 'border-white/30 bg-white/5' : 'border-white/10 bg-black'} transition-colors duration-500`}
              >
                <span className={`block font-mono text-xs mb-4 uppercase tracking-widest ${activeStep === index ? 'text-[#00f0ff]' : 'text-gray-500'}`}>
                  Step 0{index + 1}
                </span>
                <span className={`block font-bold uppercase tracking-widest ${activeStep === index ? 'text-white' : 'text-gray-600'}`}>
                  {step}
                </span>
                
                {activeStep === index && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className="absolute -bottom-px left-0 w-full h-1 bg-[#00f0ff]"
                  />
                )}
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import dynamic from 'next/dynamic';
import HeroIntelligence from "../../components/intelligence/HeroIntelligence";
import Perception from "../../components/intelligence/Perception";
import Reasoning from "../../components/intelligence/Reasoning";
import WorldModel from "../../components/intelligence/WorldModel";
import Planning from "../../components/intelligence/Planning";
 import Learning from "../../components/intelligence/Learning";
import PhysicalAI from "../../components/intelligence/PhysicalAI";
import IntelligenceCTA from "../../components/intelligence/IntelligenceCTA";

const IntelligenceCanvas = dynamic(() => import('@/components/three/intelligence/IntelligenceCanvas'), { ssr: false });

export default function IntelligencePage() {
  return (
    <main className="relative w-full bg-[#050505] min-h-screen overflow-x-hidden">

      {/* 3D WebGL Background Canvas */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
        <IntelligenceCanvas />
      </div>

      {/* HTML DOM Story Overlay */}
      <div className="relative z-10 w-full pointer-events-none mix-blend-screen">
        {/* C hild components should have pointer-events-auto if they need clicks */}
        <HeroIntelligence />
        <Perception />
        <Reasoning />
        <WorldModel />
        <Planning />
        <Learning />
        <PhysicalAI />
        <IntelligenceCTA />
      </div>

    </main>
  );
}

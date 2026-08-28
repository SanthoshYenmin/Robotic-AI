import Hero from "@/components/sections/Hero";
import Introduction from "@/components/sections/Introduction";
import Capabilities from "@/components/sections/Capabilities";
import MeetNova from "@/components/sections/MeetNova";
import PhysicalIntelligence from "@/components/sections/PhysicalIntelligence";
import Applications from "@/components/sections/Applications";
import FutureStatement from "@/components/sections/FutureStatement";
import CTASection from "@/components/sections/CTASection";

export default function Home() {
  return (
    <>
      <Hero />
      <Introduction />
      <Capabilities />
      <MeetNova />
      <PhysicalIntelligence />
      <Applications />
      <FutureStatement />
      <CTASection />
    </>
  );
}

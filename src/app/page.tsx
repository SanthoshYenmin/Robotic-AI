import Hero from "@/components/sections/Hero";
import Introduction from "@/components/sections/Introduction";
import Expertise from "@/components/sections/Expertise";
import FeaturedProject from "@/components/sections/FeaturedProject";
import TechnologyStack from "@/components/sections/TechnologyStack";
import TheProcess from "@/components/sections/TheProcess";
import FutureStatement from "@/components/sections/FutureStatement";
import CTASection from "@/components/sections/CTASection";

// Thick section divider — adds significant visual breathing room between full-screen sections
// without breaking GSAP pin triggers (which rely on element positions)
function SectionDivider() {
  return (
    <div className="w-full flex items-center gap-6 px-8 md:px-16 py-32 bg-black">
      <div className="flex-1 h-px bg-white/5" />
      <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
      <div className="flex-1 h-px bg-white/5" />
    </div>
  );
}

export default function Home() {
  return (
    <div className="w-full">
      <Hero />
      <SectionDivider />
      <Introduction />
      <SectionDivider />
      <Expertise />
      <SectionDivider />
      <FeaturedProject />
      <SectionDivider />
      <TechnologyStack />
      <SectionDivider />
      <TheProcess />
      <SectionDivider />
      <FutureStatement />
      <SectionDivider />
      <CTASection />
    </div>
  );
}

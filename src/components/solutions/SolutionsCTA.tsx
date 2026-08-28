"use client";

import RevealText from "@/components/animations/RevealText";
import Link from "next/link";

export default function SolutionsCTA() {
  return (
    <section className="py-32 md:py-48 bg-[#0a0a0a] relative border-t border-white/5">
      <div className="container mx-auto px-6 md:px-12 flex flex-col items-center justify-center text-center">
        <RevealText>
          <h2 className="text-5xl md:text-8xl font-bold uppercase tracking-tight mb-16 text-white">
            Deploy Nova in<br />
            <span className="text-gray-600">your facility.</span>
          </h2>
        </RevealText>

        <RevealText delay={0.2} className="flex flex-col sm:flex-row gap-6">
          <Link
            href="/contact"
            className="px-10 py-5 bg-white text-black font-bold tracking-widest uppercase hover:bg-gray-200 transition-colors text-sm"
          >
            Contact Sales
          </Link>
          <Link
            href="/technology"
            className="px-10 py-5 bg-transparent border border-white/20 text-white font-medium tracking-widest uppercase hover:bg-white/5 transition-colors text-sm"
          >
            Review Technology
          </Link>
        </RevealText>
      </div>
    </section>
  );
}

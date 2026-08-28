"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import RevealText from "@/components/animations/RevealText";

gsap.registerPlugin(ScrollTrigger);

export default function Introduction() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  const paragraph = "For decades, intelligence has been confined to screens. We are bringing it into the physical world. Nova Robotics builds machines that can see, understand, and interact with the environment as naturally as humans do.";
  const words = paragraph.split(" ");

  useGSAP(() => {
    const container = containerRef.current;
    const textEl = textRef.current;
    if (!container || !textEl) return;

    // Get all the word spans
    const wordSpans = textEl.querySelectorAll(".word");

    gsap.fromTo(
      wordSpans,
      { opacity: 0.15 },
      {
        opacity: 1,
        stagger: 0.1,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top 60%",
          end: "bottom 80%",
          scrub: 1, // Smoothly scrub through the animation based on scroll
        }
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-48 md:py-64 bg-[#0a0a0a] relative z-20 -mt-24 rounded-t-3xl md:rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.8)]">
      <div className="container mx-auto px-6 md:px-12 pointer-events-auto">
        <div className="max-w-5xl mx-auto text-center">
          
          <RevealText>
            <h2 className="text-xl md:text-2xl font-mono text-[#00f0ff] uppercase tracking-[0.3em] mb-16">
              The Paradigm Shift
            </h2>
          </RevealText>

          <p 
            ref={textRef} 
            className="text-2xl md:text-3xl lg:text-4xl font-[family-name:var(--font-display)] font-semibold leading-[1.3] text-white"
          >
            {words.map((word, i) => (
              <span key={i} className="word opacity-15 inline-block mr-[0.25em] mb-[0.1em]">
                {word}
              </span>
            ))}
          </p>

        </div>
      </div>
    </section>
  );
}

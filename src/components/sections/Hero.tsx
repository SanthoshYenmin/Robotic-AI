"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import RevealText from "@/components/animations/RevealText";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<SVGSVGElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useGSAP(() => {
    const container = containerRef.current;
    const mask = maskRef.current;
    if (!container || !mask) return;

    // Pin the container and scale the mask massively to "fly through"
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "+=2000",
        pin: true,
        scrub: 1,
      }
    });

    // Scale the SVG so much that the letter 'O' covers the screen
    tl.to(mask, {
      scale: 80,
      transformOrigin: "center center",
      ease: "power2.inOut",
    });

    // Fade out video slightly as we fly through
    if (videoRef.current) {
      tl.to(videoRef.current, {
        opacity: 0.2,
        ease: "power1.inOut"
      }, "<0.5");
    }

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full h-[100svh] bg-black overflow-hidden rounded-b-3xl md:rounded-b-[3rem] z-10">
      
      {/* Background Video that we will see through the text */}
      <div className="absolute inset-0 z-0 flex items-center justify-center bg-black">
        <video 
          ref={videoRef}
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover"
          src="/videos/hero-banner.webm"
          poster="/images/nova_future_city_1787818765341.jpg"
        />
      </div>

      {/* SVG Mask Layer */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <svg 
          ref={maskRef}
          width="100%" 
          height="100%" 
          viewBox="0 0 1000 1000" 
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full"
        >
          <defs>
            <mask id="hero-mask">
              <rect width="1000" height="1000" fill="white" />
              {/* The "window" text */}
              <text 
                x="500" 
                y="500" 
                dominantBaseline="middle" 
                textAnchor="middle" 
                fill="black" 
                fontSize="180" 
                fontWeight="900" 
                fontFamily="var(--font-display)"
                letterSpacing="-5"
              >
                NOVA
              </text>
            </mask>
          </defs>
          <rect width="1000" height="1000" fill="#0a0a0a" mask="url(#hero-mask)" />
        </svg>
      </div>

      {/* Additional Foreground Content */}
      <div className="absolute bottom-12 left-6 md:left-12 z-20 pointer-events-auto">
        <div className="max-w-xl">
          <RevealText noScrollTrigger>
            <p className="text-lg md:text-xl text-white font-mono uppercase tracking-[0.2em] mix-blend-difference">
              Meet Nova
            </p>
          </RevealText>
        </div>
      </div>
    </section>
  );
}

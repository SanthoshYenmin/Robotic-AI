"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const pinRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<SVGSVGElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const btnsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const pin = pinRef.current;
    const mask = maskRef.current;
    if (!pin || !mask) return;

    gsap.timeline({
      scrollTrigger: {
        trigger: pin,
        start: "top top",
        end: "+=2200",
        pin: true,
        scrub: 2,
        preventOverlaps: true,
        fastScrollEnd: true,
        refreshPriority: 11,
      }
    }).to(mask, { scale: 100, transformOrigin: "center center", ease: "power2.inOut" });

    const t1 = setTimeout(() => ScrollTrigger.refresh(), 400);
    const t2 = setTimeout(() => ScrollTrigger.refresh(), 1000);
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    return () => { clearTimeout(t1); clearTimeout(t2); window.removeEventListener("load", onLoad); };
  }, { scope: pinRef });

  useGSAP(() => {
    const content = contentRef.current;
    if (!content) return;

    gsap.set([eyebrowRef.current, headingRef.current, descRef.current, btnsRef.current, statsRef.current, gridRef.current], { opacity: 0 });
    gsap.set(headingRef.current, { y: 50, skewY: 2 });
    gsap.set([eyebrowRef.current, descRef.current, btnsRef.current, statsRef.current], { y: 25 });

    const tl = gsap.timeline({
      scrollTrigger: { 
        trigger: content, 
        start: "top top",
        end: "+=1500",
        pin: true,
        scrub: 1,
        refreshPriority: 10,
        preventOverlaps: true,
        fastScrollEnd: true,
      }
    });

    tl.to(gridRef.current, { opacity: 1, duration: 1 })
      .to(eyebrowRef.current, { opacity: 1, y: 0, duration: 1 })
      .to(headingRef.current, { opacity: 1, y: 0, skewY: 0, duration: 1.5 })
      .to(descRef.current, { opacity: 1, y: 0, duration: 1 })
      .to(btnsRef.current, { opacity: 1, y: 0, duration: 1 })
      .to(statsRef.current, { opacity: 1, y: 0, duration: 1 });
  }, { scope: contentRef });

  return (
    <>
      {/* PHASE 1: NOVA ZOOM */}
      <div ref={pinRef} className="relative w-full h-[100svh] bg-black overflow-hidden rounded-b-3xl md:rounded-b-[3rem] z-10">
        <video autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          src="/videos/hero-banner.webm"
          poster="/images/nova_future_city_1787818765341.jpg"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        <div className="absolute inset-0 z-10 pointer-events-none">
          <svg ref={maskRef} width="100%" height="100%" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
            <defs>
              <mask id="nova-mask">
                <rect width="1000" height="1000" fill="white" />
                <text x="500" y="500" dominantBaseline="middle" textAnchor="middle" fill="black" fontSize="180" fontWeight="900" fontFamily="var(--font-display)" letterSpacing="-5">NOVA</text>
              </mask>
            </defs>
            <rect width="1000" height="1000" fill="#050505" mask="url(#nova-mask)" />
          </svg>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-white/40 text-xs font-mono uppercase tracking-widest">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </div>

      {/* PHASE 2: HERO CONTENT */}
      <div ref={contentRef} className="relative w-full h-[100svh] bg-black overflow-hidden">
        <video autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-25"
          src="/videos/hero-banner.webm"
          poster="/images/nova_future_city_1787818765341.jpg"
        />
        <div ref={gridRef} className="absolute inset-0" style={{
          backgroundImage: "linear-gradient(rgba(0,240,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }} />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full bg-[#00f0ff]/6 blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 pointer-events-none" />

        {/* Absolutely positioned wrapper to guarantee screen bounds */}
        <div className="absolute inset-0 z-10 w-full h-full">
          
          {/* Eyebrow - Top Left */}
          <div ref={eyebrowRef} className="absolute top-[20%] left-8 md:left-16 lg:left-24">
            <p className="text-[10px] md:text-xs font-mono text-[#00f0ff] uppercase tracking-[0.4em] flex items-center gap-3">
              <span className="w-8 h-px bg-[#00f0ff] flex-shrink-0" />
              ROBOTICS • AI • AUTOMATION
            </p>
          </div>

          {/* Main Heading - Middle Left */}
          <div ref={headingRef} className="absolute top-[35%] left-8 md:left-16 lg:left-24">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[6.5rem] font-black text-white leading-[0.95] tracking-tighter uppercase">
              Engineering<br />
              Intelligence<br />
              Into Motion.
            </h1>
          </div>

          {/* Description - Middle Right */}
          <div ref={descRef} className="absolute top-[40%] right-8 md:right-16 lg:right-24 w-full max-w-sm hidden md:block">
            <p className="text-white/60 text-sm md:text-base font-light leading-[1.8]">
              I design and build intelligent robotic systems that combine <span className="text-white font-medium">AI, automation,</span> and <span className="text-white font-medium">advanced engineering</span> to solve real-world problems.
            </p>
          </div>

          {/* Buttons - Bottom Left */}
          <div ref={btnsRef} className="absolute bottom-[15%] left-8 md:left-16 lg:left-24 flex flex-wrap items-center gap-5">
            <a href="#projects" className="px-8 py-4 bg-[#00f0ff] text-black font-bold text-sm uppercase tracking-widest rounded hover:shadow-[0_0_25px_rgba(0,240,255,0.6)] hover:bg-white hover:text-black transition-all duration-300">
              Explore Projects
            </a>
            <a href="#contact" className="px-8 py-4 border border-white/20 text-white font-semibold text-sm uppercase tracking-widest rounded hover:border-[#00f0ff] hover:text-[#00f0ff] hover:shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all duration-300">
              {"Let's Connect"}
            </a>
          </div>

          {/* Stats - Bottom Right */}
          <div ref={statsRef} className="absolute bottom-[15%] right-8 md:right-16 lg:right-24 flex gap-6 lg:gap-12">
            {[["15+", "Projects"], ["10+", "Tech"], ["5+", "Years"]].map(([num, label]) => (
              <div key={label} className="flex flex-col gap-1 items-start relative group">
                <span className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tighter relative z-10">{num}</span>
                <span className="text-[#00f0ff]/70 text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] relative z-10">{label}</span>
              </div>
            ))}
          </div>

        </div>

      </div>
    </>
  );
}
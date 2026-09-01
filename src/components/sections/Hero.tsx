"use client";

import { useRef, Suspense, useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";

// WebGL Video removed in favor of high-performance native HTML Video with CSS filters

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  // Wait until Preloader completes and unlocks body scroll
  const [isReady, setIsReady] = useState(() => !!(window as any).preloaderFinished);

  useEffect(() => {
    if ((window as any).preloaderFinished) {
      setIsReady(true);
      return;
    }
    const handleReady = () => setIsReady(true);
    window.addEventListener("preloaderComplete", handleReady);
    return () => window.removeEventListener("preloaderComplete", handleReady);
  }, []);

  // Audio states
  const [isGlobalMuted, setIsGlobalMuted] = useState(true);
  // Track if Hero is in view for audio using GSAP
  const [isInView, setIsInView] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!isReady) return;
    const pin = pinRef.current;
    const mask = maskRef.current;
    if (!pin || !mask) return;

    gsap.timeline({
      scrollTrigger: {
        trigger: pin,
        start: "top top",
        end: "+=2200",
        pin: true,
        scrub: 1.5,
        refreshPriority: 11,
        onEnter: () => setIsInView(true),
        onLeave: () => setIsInView(false),
        onEnterBack: () => setIsInView(true),
        onLeaveBack: () => setIsInView(false),
      }
    })
      .to(mask, { scale: 100, transformOrigin: "center center", ease: "power2.inOut", duration: 1 })
      .set(mask, { display: "none" })
      .to(mask, { opacity: 0, duration: 1 }); // Safe padding tween
  }, { scope: containerRef, dependencies: [isReady] });

  useGSAP(() => {
    if (!isReady) return;
    const content = contentRef.current;
    if (!content) return;

    gsap.set([eyebrowRef.current, headingRef.current, descRef.current, statsRef.current, gridRef.current], { opacity: 0 });
    gsap.set(headingRef.current, { y: 50, skewY: 2 });
    gsap.set([eyebrowRef.current, descRef.current, statsRef.current], { y: 25 });

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
      .to(statsRef.current, { opacity: 1, y: 0, duration: 1 });
  }, { scope: containerRef, dependencies: [isReady] });

  return (
    <div ref={containerRef} className="relative w-full">
      
      {/* PHASE 1: NOVA ZOOM */}
      <div className="w-full z-10 relative">
        <div ref={pinRef} className="relative w-full h-[100svh] overflow-hidden rounded-b-3xl md:rounded-b-[3rem] bg-black">
          
          {/* Video is now inside pinRef so it shares the stacking context for mix-blend-mode */}
          <div className="absolute inset-0 w-full h-full z-0 overflow-hidden" style={{ transform: 'translateZ(0)' }}>
            <video
              src="/videos/hero-banner.mp4"
              autoPlay
              loop
              playsInline
              preload="auto"
              muted={isGlobalMuted || !isInView}
              className="absolute top-1/2 left-1/2 w-full h-full object-cover -translate-x-1/2 -translate-y-1/2"
              style={{ willChange: 'transform' }}
            />
          </div>

          <button
            onClick={() => setIsGlobalMuted(!isGlobalMuted)}
            className="absolute top-32 right-8 md:right-16 z-[100] w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 hover:border-[#00f0ff]/50 hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all duration-300 pointer-events-auto cursor-pointer"
            aria-label="Toggle Audio"
          >
            {isGlobalMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>

          {/* High-Performance CSS Mask (Replaces SVG Mask) */}
          <div 
            ref={maskRef} 
            className="absolute inset-0 z-10 pointer-events-none origin-center flex items-center justify-center bg-[#050505]"
            style={{ mixBlendMode: 'multiply' }}
          >
            <div 
              className="font-display font-black tracking-tighter text-white" 
              style={{ fontSize: 'clamp(150px, 25vw, 400px)', letterSpacing: '-0.05em' }}
            >
              NOVA
            </div>
          </div>
          
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 animate-bounce pointer-events-none">
            <span className="text-white/40 text-xs font-mono uppercase tracking-widest">Scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
          </div>
        </div>
      </div>

      {/* PHASE 2: HERO CONTENT */}
      <div className="w-full">
        <div ref={contentRef} className="relative w-full h-[100svh] bg-black overflow-hidden z-10">

          <div ref={gridRef} className="absolute inset-0 z-0 pointer-events-none" style={{
            backgroundImage: "linear-gradient(rgba(0,240,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px"
          }} />
          <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full bg-[#00f0ff]/6 blur-[100px] pointer-events-none z-0" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/40 pointer-events-none z-0" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 pointer-events-none z-0" />

          <div className="absolute inset-0 z-10 w-full h-full">

            {/* Eyebrow */}
            <div ref={eyebrowRef} className="absolute top-[20%] left-8 md:left-16 lg:left-24">
              <div className="section-label">
                <span className="w-8 h-px bg-[#00f0ff] flex-shrink-0" />
                <span className="section-label-text">ROBOTICS • AI • AUTOMATION</span>
              </div>
            </div>

            {/* Main Heading */}
            <div ref={headingRef} className="absolute top-[35%] left-8 md:left-16 lg:left-24">
              <h1 className="section-heading text-[clamp(2.5rem,6vw,6.5rem)] leading-[0.95]">
                Engineering<br />
                Intelligence<br />
                Into Motion.
              </h1>
            </div>

            {/* HUD Label */}
            <div ref={descRef} className="absolute top-[40%] right-8 md:right-16 lg:right-24 w-full max-w-[240px] hidden md:block z-20">
              <div
                style={{ padding: '1.5rem' }}
                className="relative border border-[#00f0ff]/30 bg-[#00f0ff]/10 backdrop-blur-md overflow-hidden group shadow-[0_0_20px_rgba(0,240,255,0.15)] rounded-sm"
              >
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00f0ff]" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00f0ff]" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00f0ff]" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00f0ff]" />
                <div className="absolute top-0 left-0 w-full h-[2px] bg-[#00f0ff] opacity-80 shadow-[0_0_10px_#00f0ff] animate-[scan_2.5s_ease-in-out_infinite]" />
                <p className="text-[#00f0ff] font-mono text-xs uppercase tracking-[0.2em] mb-2 opacity-80">// SUBJECT</p>
                <h3 className="text-white font-bold text-xl leading-snug uppercase tracking-wider">3D Humanoid<br />Robot</h3>
              </div>
            </div>

            {/* Stats */}
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
      </div>
    </div>
  );
}
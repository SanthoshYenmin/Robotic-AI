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
  const [isGlobalMuted, setIsGlobalMuted] = useState(false);
  // Track if Hero is in view for audio using GSAP
  const [isInView, setIsInView] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Magic Trick: Prevent freezing without changing the mute button!
  useEffect(() => {
    if (isReady && videoRef.current) {
      // Start with what the user requested
      videoRef.current.muted = isGlobalMuted;

      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If browser blocks sound, secretly mute it just so the video plays!
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => { });
          }
        });
      }
    }
  }, [isReady, isGlobalMuted]);

  // Magic Trick Part 2: As soon as they touch the screen, give them their sound back!
  useEffect(() => {
    const handleTouch = () => {
      if (videoRef.current && !isGlobalMuted) {
        videoRef.current.muted = false;
      }
    };
    window.addEventListener("click", handleTouch, { once: true });
    window.addEventListener("scroll", handleTouch, { once: true });
    window.addEventListener("touchstart", handleTouch, { once: true });
    return () => {
      window.removeEventListener("click", handleTouch);
      window.removeEventListener("scroll", handleTouch);
      window.removeEventListener("touchstart", handleTouch);
    };
  }, [isGlobalMuted]);

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
        end: "+=500",
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

    // Only set initial states for elements that animate AFTER it pins
    gsap.set([headingRef.current, descRef.current, statsRef.current], { opacity: 0 });
    gsap.set(headingRef.current, { y: 50, skewY: 2 });
    gsap.set([descRef.current, statsRef.current], { y: 25 });

    // Independent animation that runs WHILE the container is sliding up
    // This prevents the screen from being completely empty before it pins
    gsap.fromTo([gridRef.current, eyebrowRef.current],
      { opacity: 0, y: 25 },
      {
        opacity: 1,
        y: 0,
        scrollTrigger: {
          trigger: content,
          start: "top 70%", // When video has scrolled up and this container is 30% visible
          end: "top 20%",
          scrub: 1,
        }
      }
    );

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

    tl.to(headingRef.current, { opacity: 1, y: 0, skewY: 0, duration: 1.5 })
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
              ref={videoRef}
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
              className="font-display font-black tracking-tighter text-white px-6 md:px-0 w-full text-center overflow-hidden"
              style={{ fontSize: 'clamp(80px, 22vw, 400px)', letterSpacing: '-0.05em' }}
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

          <div className="absolute inset-0 z-10 w-full h-full flex flex-col justify-center gap-10 container mx-auto px-6 md:px-0 md:block md:gap-0">

            {/* Eyebrow */}
            <div ref={eyebrowRef} className="relative md:absolute md:top-[20%] md:left-16 lg:left-24">
              <div className="section-label">
                <span className="w-8 h-px bg-[#00f0ff] flex-shrink-0" />
                <span className="section-label-text">ROBOTICS • AI • AUTOMATION</span>
              </div>
            </div>

            {/* Main Heading & Description */}
            <div ref={headingRef} className="relative md:absolute md:top-[35%] md:left-16 lg:left-24 flex flex-col z-10">
              <h1 className="section-heading">
                Engineering<br />
                <span className="text-[#00f0ff]">Intelligence</span><br />
                Into Motion.
              </h1>
              <p className="section-body max-w-xl">
                Pioneering the next generation of autonomous robotic systems. We seamlessly integrate advanced artificial intelligence with state-of-the-art hardware to redefine what's possible in industrial and commercial mobility.
              </p>
            </div>

            {/* HUD Label */}
            <div ref={descRef} className="relative md:absolute md:top-[40%] md:right-16 lg:right-24 w-full max-w-[200px] md:max-w-[240px] z-20 self-start md:self-auto">
              <div
                style={{ padding: '1.25rem' }}
                className="relative border border-[#00f0ff]/30 bg-[#00f0ff]/10 backdrop-blur-md overflow-hidden group shadow-[0_0_20px_rgba(0,240,255,0.15)] rounded-sm"
              >
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00f0ff]" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00f0ff]" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00f0ff]" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00f0ff]" />
                <div className="absolute top-0 left-0 w-full h-[2px] bg-[#00f0ff] opacity-80 shadow-[0_0_10px_#00f0ff] animate-[scan_2.5s_ease-in-out_infinite]" />
                <p className="text-[#00f0ff] font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] mb-1 md:mb-2 opacity-80">// SUBJECT</p>
                <h3 className="text-white font-bold text-sm md:text-xl leading-snug uppercase tracking-wider">3D Humanoid<br />Robot</h3>
              </div>
            </div>

            {/* Stats */}
            <div ref={statsRef} className="relative md:absolute md:bottom-[15%] md:right-16 lg:right-24 flex gap-6 lg:gap-12 self-start md:self-auto">
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
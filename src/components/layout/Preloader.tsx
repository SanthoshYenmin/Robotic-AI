import { useProgress } from "@react-three/drei";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";

export default function Preloader() {
  const { progress, active, loaded, total } = useProgress();
  const [isHidden, setIsHidden] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [displayProgress, setDisplayProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // Prevent progress from jumping backwards when new lazy assets load
  useEffect(() => {
    setDisplayProgress((prev) => Math.max(prev, progress));
  }, [progress]);

  // Preload the Hero Video natively
  useEffect(() => {
    const video = document.createElement("video");
    video.src = "/videos/hero-banner.mp4";
    video.preload = "auto";
    video.oncanplaythrough = () => setVideoLoaded(true);
    // Fallback just in case canplaythrough doesn't fire
    video.onerror = () => setVideoLoaded(true);
    video.load();
  }, []);

  const [readyToEnter, setReadyToEnter] = useState(false);

  useEffect(() => {
    // Lock scroll while loading
    document.body.style.overflow = "hidden";

    // When both 3D assets AND the heavy video are fully loaded
    if ((progress === 100 || (total === 0 && !active)) && videoLoaded) {
      setReadyToEnter(true);
    }
  }, [progress, active, total, videoLoaded]);

  const handleEnter = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        setIsHidden(true);
        document.body.style.overflow = "";
        
        // Set global flag for components that mount late
        (window as any).preloaderFinished = true;
        // Dispatch global event so GSAP components know it's safe to create ScrollTriggers
        window.dispatchEvent(new Event("preloaderComplete"));
        
        setTimeout(() => {
          import("gsap/ScrollTrigger").then(({ default: ScrollTrigger }) => {
            ScrollTrigger.refresh();
          });
        }, 100);
      }
    });

    tl.to(textRef.current, { opacity: 0, y: -20, duration: 0.5 })
      .to(containerRef.current, {
        yPercent: -100,
        duration: 1,
        ease: "expo.inOut"
      }, "-=0.2");
  };

  if (isHidden) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] text-white overflow-hidden"
    >
      {/* Abstract Background Grid */}
      <div className="absolute inset-0 bg-grid opacity-20" />

      <div ref={textRef} className="relative z-10 flex flex-col items-center">
        {/* NOVA LOGO */}
        <div className="flex flex-col items-center select-none">
          <h1 className="text-6xl md:text-[8rem] leading-[0.8] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10">
            NOVA
          </h1>
          <div className="mt-4 flex items-center gap-4 w-full">
            <div className="h-[1px] flex-1 bg-white/20" />
            <p className="font-mono text-[10px] md:text-xs tracking-[0.5em] text-white/40 uppercase shrink-0">
              Robotics Intelligence
            </p>
            <div className="h-[1px] flex-1 bg-white/20" />
          </div>
        </div>

        {/* Progress Bar or Enter Button */}
        <div className="flex flex-col items-center min-h-[60px]" style={{ marginTop: '100px' }}>
          {!readyToEnter ? (
            <>
              <div className="w-64 md:w-80 h-[2px] bg-white/10 overflow-hidden relative mb-4">
                <div 
                  className="absolute top-0 left-0 h-full bg-[#00f0ff] shadow-[0_0_10px_#00f0ff]" 
                  style={{ width: `${displayProgress}%`, transition: 'width 0.3s ease-out' }} 
                />
              </div>
              <div className="font-mono text-[10px] text-white/40 tracking-[0.3em] uppercase mb-1">
                Establishing Connection...
              </div>
              <div className="font-mono text-xs text-[#00f0ff] font-bold tracking-widest">
                {Math.round(displayProgress)}%
              </div>
            </>
          ) : (
            <button
              onClick={handleEnter}
              className="group relative bg-[#00f0ff] text-black font-black text-base md:text-lg tracking-[0.2em] uppercase hover:bg-white hover:shadow-[0_0_40px_rgba(0,240,255,0.8)] hover:scale-105 transition-all duration-500 pointer-events-auto rounded-sm cursor-pointer overflow-hidden"
              style={{ padding: '0.5rem 2rem' }}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              <span className="relative z-10">START</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

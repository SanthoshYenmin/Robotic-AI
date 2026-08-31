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

  useEffect(() => {
    // Lock scroll while loading
    document.body.style.overflow = "hidden";

    // When both 3D assets AND the heavy video are fully loaded
    if ((progress === 100 || (total === 0 && !active)) && videoLoaded) {
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

      tl.to(textRef.current, { opacity: 0, y: -20, duration: 0.5, delay: 0.5 })
        .to(containerRef.current, {
          yPercent: -100,
          duration: 1,
          ease: "expo.inOut"
        }, "-=0.2");
    }
  }, [progress, active, total, videoLoaded]);

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
        <div className="font-display text-5xl md:text-7xl font-black tracking-[-0.05em] text-white mb-8">
          NOVA<span className="text-[#00f0ff]">.</span>
        </div>
        
        {/* Progress Bar Container */}
        <div className="w-64 md:w-80 h-[2px] bg-white/10 overflow-hidden relative">
          <div 
            className="absolute top-0 left-0 h-full bg-[#00f0ff] shadow-[0_0_10px_#00f0ff]" 
            style={{ width: `${displayProgress}%`, transition: 'width 0.3s ease-out' }} 
          />
        </div>
        
        {/* Status Text */}
        <div className="mt-6 flex flex-col items-center gap-1">
          <div className="font-mono text-[10px] text-white/40 tracking-[0.3em] uppercase">
            {displayProgress < 100 ? "Establishing Connection..." : "Systems Online"}
          </div>
          <div className="font-mono text-xs text-[#00f0ff] font-bold tracking-widest">
            {Math.round(displayProgress)}%
          </div>
        </div>
      </div>
    </div>
  );
}

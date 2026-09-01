import { useRef, Suspense } from "react";
import { usePreloaderReady } from "@/hooks/usePreloaderReady";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import { View, PerspectiveCamera } from "@react-three/drei";
import TechEcosystem from "@/components/three/TechEcosystem";

gsap.registerPlugin(ScrollTrigger);

const techCategories = [
  { num: "01", icon: "👁️", title: "AI & Vision", stack: "OpenCV · ML · Deep Learning", status: "SCANNING ENVIRONMENT...", align: "left" },
  { num: "02", icon: "{ }", title: "Programming", stack: "Python · C++ · JavaScript", status: "DATA PROCESSING...", align: "right" },
  { num: "03", icon: "▣", title: "Hardware", stack: "Arduino · Pi · NVIDIA Jetson", status: "COMPONENTS CONNECTED", align: "left" },
  { num: "04", icon: "🦾", title: "Robotics", stack: "ROS · ROS 2 · Gazebo · MoveIt", status: "SYSTEM ACTIVE", align: "right" }
];

export default function TechnologyStack() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const isMounted = usePreloaderReady();
  
  const textElementsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    if (!sectionRef.current || !isMounted || !canvasContainerRef.current) return;

    // Pin the 3D Canvas so it stays in the background while scrolling through the section
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom bottom",
      pin: canvasContainerRef.current,
      pinSpacing: false,
    });

    // Simple fade-up animation for all text blocks as you scroll
    textElementsRef.current.forEach((el) => {
      if (!el) return;
      gsap.fromTo(el, 
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

  }, { scope: sectionRef, dependencies: [isMounted] });

  return (
    <section ref={sectionRef} className="relative w-full bg-transparent text-white overflow-hidden">
      
      {/* 3D Canvas Background (Pinned by GSAP) */}
      <div ref={canvasContainerRef} className="absolute top-0 left-0 w-full h-[100svh] z-0 pointer-events-none">
        {isMounted && (
          <View className="absolute inset-0 w-full h-full pointer-events-none">
            <PerspectiveCamera makeDefault position={[0, 0, 9]} fov={45} />
            <Suspense fallback={null}>
              <TechEcosystem />
            </Suspense>
          </View>
        )}
        
        {/* Subtle gradient overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#08080a] via-transparent to-[#08080a] opacity-80" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 container mx-auto px-6 md:px-12">
        
        {/* Header Spacer & Title */}
        <div className="min-h-[100svh] flex flex-col justify-center items-center text-center" ref={el => { textElementsRef.current[0] = el; }}>
          <div className="section-label justify-center mb-6">
            <span className="section-label-text">TECHNOLOGY</span>
          </div>
          <h2 className="section-heading mb-6 max-w-3xl mx-auto">
            The Technology <br className="hidden md:block" />
            <span className="heading-gradient">Behind the Intelligence.</span>
          </h2>
          <p className="section-body max-w-2xl mx-auto text-lg">
            From low-level hardware control to high-level AI, I work with a modern robotics stack to turn complex ideas into functional systems.
          </p>
        </div>

        {/* Tech Categories Spaced Out Vertically */}
        <div className="py-20 flex flex-col gap-[30vh]">
          {techCategories.map((item, i) => (
            <div 
              key={i} 
              ref={el => { textElementsRef.current[i + 1] = el; }}
              className={`flex ${item.align === 'right' ? 'justify-end' : 'justify-start'} w-full pointer-events-auto`}
            >
              <div 
                style={{ padding: '0.8rem' }}
                className="bg-black/60 backdrop-blur-md border border-[#00f0ff]/60 shadow-[0_0_20px_rgba(0,240,255,0.1)] rounded-lg max-w-md w-full hover:border-[#00f0ff] hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] hover:scale-105 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[#00f0ff] font-mono text-sm tracking-widest">{item.num}</span>
                  <span className="text-3xl grayscale opacity-70">{item.icon}</span>
                </div>
                <h3 className="text-2xl font-bold uppercase tracking-wider mb-3 text-white">{item.title}</h3>
                <p className="text-white/80 font-mono text-base leading-relaxed mb-6">{item.stack}</p>
                <div 
                  style={{ padding: '0.5rem 1rem' }}
                  className="text-[#00f0ff]/60 font-mono text-xs uppercase tracking-widest border border-[#00f0ff]/20 inline-block bg-[#00f0ff]/5 rounded-sm w-full text-center"
                >
                  {item.status}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Final System Active */}
        <div className="min-h-[50svh] flex items-center justify-center pb-20" ref={el => { textElementsRef.current[5] = el; }}>
           <div 
             style={{ padding: '1rem 2rem' }}
             className="bg-[#00f0ff]/10 border border-[#00f0ff]/40 rounded backdrop-blur-md text-center shadow-[0_0_30px_rgba(0,240,255,0.3)]"
           >
              <span className="text-[#00f0ff] font-bold text-base tracking-[0.3em] uppercase block mb-2">Ecosystem Operational</span>
              <span className="text-white/60 font-mono text-xs tracking-widest">ALL NODES SYNCHRONIZED</span>
            </div>
        </div>

      </div>
    </section>
  );
}
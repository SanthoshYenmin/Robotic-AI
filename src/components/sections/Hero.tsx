"use client";

import { useRef, Suspense, useMemo, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useVideoTexture } from "@react-three/drei";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

// Custom 3D WebGL Video Background with HUD Shader Effects
function VideoBackground() {
  // Load the video as a texture
  const texture = useVideoTexture("/videos/hero-banner.mp4", {
    muted: true,
    loop: true,
    start: true,
    crossOrigin: "Anonymous"
  });
  
  const { viewport } = useThree();
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => ({
    tDiffuse: { value: texture },
    time: { value: 0 }
  }), [texture]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
    }
  });

  // Calculate object-cover sizing
  const videoAspect = 1920 / 1080;
  const screenAspect = viewport.width / viewport.height;
  
  let scaleX = viewport.width;
  let scaleY = viewport.height;
  
  if (screenAspect > videoAspect) {
    scaleY = viewport.width / videoAspect;
  } else {
    scaleX = viewport.height * videoAspect;
  }

  return (
    <mesh scale={[scaleX, scaleY, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        transparent
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform sampler2D tDiffuse;
          uniform float time;
          varying vec2 vUv;

          void main() {
            vec2 p = vUv;

            // Chromatic aberration (RGB shift)
            float shift = sin(time * 5.0) * 0.003;
            
            // Slow wave distortion
            float wave = sin(p.y * 50.0 + time * 5.0) * 0.002;
            
            vec4 cr = texture2D(tDiffuse, p + vec2(shift + wave, 0.0));
            vec4 cga = texture2D(tDiffuse, p + vec2(wave, 0.0));
            vec4 cb = texture2D(tDiffuse, p - vec2(shift - wave, 0.0));

            vec4 color = vec4(cr.r, cga.g, cb.b, cga.a);

            // Subtle scanlines
            float scanline = sin(p.y * 1000.0) * 0.03;
            color.rgb -= scanline;
            
            // Neon cyan tint for HUD feel
            color.b += 0.05;
            color.g += 0.02;

            gl_FragColor = color;
          }
        `}
      />
    </mesh>
  );
}

export default function Hero() {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<SVGSVGElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!isMounted) return;
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
    }).to(mask, { scale: 100, transformOrigin: "center center", ease: "power2.inOut" })
      .set(mask, { display: "none" });

    const t1 = setTimeout(() => ScrollTrigger.refresh(), 400);
    const t2 = setTimeout(() => ScrollTrigger.refresh(), 1000);
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => { clearTimeout(t1); clearTimeout(t2); window.removeEventListener("load", onLoad); };
  }, { scope: containerRef, dependencies: [isMounted] });

  useGSAP(() => {
    if (!isMounted) return;
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
  }, { scope: containerRef, dependencies: [isMounted] });

  return (
    <div ref={containerRef} className="relative w-full">
      {/* PHASE 1: NOVA ZOOM */}
      <div className="w-full">
        <div ref={pinRef} className="relative w-full h-[100svh] bg-black overflow-hidden rounded-b-3xl md:rounded-b-[3rem] z-10">
          
          {/* R3F WebGL Video Background */}
          <div className="absolute inset-0 w-full h-full opacity-60 z-0">
            {isMounted && (
              <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                <Suspense fallback={null}>
                  <VideoBackground />
                </Suspense>
              </Canvas>
            )}
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 z-0 pointer-events-none" />

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
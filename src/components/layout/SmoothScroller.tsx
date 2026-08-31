"use client";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroller({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.07,
      smoothWheel: true,
      syncTouch: true,
      autoRaf: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const ticker = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    // Refresh on window load for first-visit reliability
    const onLoad = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener("load", onLoad);

    // Watch for dynamic height changes (images loading, 3D canvases mounting) to fix empty scroll issues
    let resizeTimer: NodeJS.Timeout;
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);
    });
    resizeObserver.observe(document.body);

    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(ticker);
      window.removeEventListener("load", onLoad);
      resizeObserver.disconnect();
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const t1 = setTimeout(() => ScrollTrigger.refresh(), 150);
    const t2 = setTimeout(() => ScrollTrigger.refresh(), 500);
    const t3 = setTimeout(() => ScrollTrigger.refresh(), 1000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [pathname]);

  return <>{children}</>;
}
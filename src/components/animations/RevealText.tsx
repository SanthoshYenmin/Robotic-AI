"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

export default function RevealText({
  children,
  className = "",
  delay = 0,
  noScrollTrigger = false,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  noScrollTrigger?: boolean;
}) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trigger = triggerRef.current;
    const text = textRef.current;
    if (!trigger || !text) return;

    gsap.fromTo(
      text,
      { 
        y: 40,
        scale: 1.05,
        opacity: 0,
        filter: "blur(15px)"
      },
      {
        y: 0,
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1.4,
        delay: delay,
        ease: "expo.out",
        scrollTrigger: noScrollTrigger ? undefined : {
          trigger: trigger,
          start: "top 95%",
        },
      }
    );
  }, [delay, noScrollTrigger]);

  return (
    <div ref={triggerRef} className={className}>
      <div ref={textRef}>
        {children}
      </div>
    </div>
  );
}

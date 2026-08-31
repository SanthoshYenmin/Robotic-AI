"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocation } from "react-router-dom";
import NovaRobot from "./NovaRobot";
import RobotLighting from "./RobotLighting";

export default function RobotScene() {
  const sceneGroupRef = useRef<THREE.Group>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    if (!sceneGroupRef.current || pathname !== "/") return;

    gsap.set(sceneGroupRef.current.position, { x: 0, y: -0.5, z: 0 });
    gsap.set(sceneGroupRef.current.rotation, { x: 0, y: 0, z: 0 });
    gsap.set(sceneGroupRef.current.scale, { x: 1, y: 1, z: 1 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    });

    tl.to(sceneGroupRef.current.position, {
      x: 1.5,
      y: -1,
      ease: "power2.inOut",
    }, 0);
    
    tl.to(sceneGroupRef.current.rotation, {
      y: -Math.PI / 4,
      ease: "power2.inOut",
    }, 0);

    tl.to(sceneGroupRef.current.scale, {
      x: 0.8,
      y: 0.8,
      z: 0.8,
      ease: "power2.inOut",
    }, 0);

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [pathname]);

  const routesToHide = ["/intelligence", "/technology", "/solutions", "/fleet", "/deployment"];
  if (routesToHide.includes(pathname)) return null;

  return (
    <group ref={sceneGroupRef}>
      <RobotLighting />
      <NovaRobot />
    </group>
  );
}

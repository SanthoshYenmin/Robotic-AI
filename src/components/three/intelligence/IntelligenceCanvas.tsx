"use client";

import { useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, PerspectiveCamera } from "@react-three/drei";
import RobotModel from "./RobotModel";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

export default function IntelligenceCanvas() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none w-full h-full bg-[#050505]">
      <Canvas shadows dpr={[1, 2]}>
        {/* Cinematic Camera */}
        <PerspectiveCamera makeDefault position={[0, 1.5, 5]} fov={45} />

        {/* Atmospheric Lighting */}
        <ambientLight intensity={0.1} />
        <spotLight
          position={[0, 5, 0]}
          angle={0.5}
          penumbra={1}
          intensity={2}
          castShadow
          color="#00f0ff"
        />
        <directionalLight
          position={[-5, 5, 5]}
          intensity={0.5}
          color="#ffffff"
        />

        <Environment preset="city" />

        {/* The Star of the Show */}
        <RobotSceneManager />
      </Canvas>
    </div>
  );
}

function RobotSceneManager() {
  const groupRef = useRef<THREE.Group>(null);
  const spotLightRef = useRef<THREE.SpotLight>(null);

  useEffect(() => {
    if (!groupRef.current || !spotLightRef.current) return;

    const group = groupRef.current;
    const light = spotLightRef.current;

    // Reset initial states
    group.position.y = -5; // Start hidden below
    light.intensity = 0;

    // Create a global ScrollTrigger timeline for the 3D scene
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1, // Smooth scrub through the entire page
      }
    });

    // SECTION 1 (0% to 10% scroll): Hero - Wake Up & Rise
    tl.to(group.position, {
      y: -0.5,
      ease: "power2.out",
      duration: 1
    }, 0);

    tl.to(light, {
      intensity: 5,
      ease: "power1.inOut",
      duration: 0.5
    }, 0.2);

    // SECTION 2 (10% to 20% scroll): Perception - Move back and rotate
    tl.to(group.position, {
      z: -2,
      y: 0,
      ease: "power1.inOut",
      duration: 1
    }, 1);

    tl.to(group.rotation, {
      y: Math.PI / 4, // Rotate slightly to the side
      ease: "power1.inOut",
      duration: 1
    }, 1);

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <>
      <spotLight
        ref={spotLightRef}
        position={[0, 5, 2]}
        angle={0.8}
        penumbra={0.5}
        intensity={0}
        castShadow
        color="#ffffff"
      />
      <group ref={groupRef}>
        <RobotModel />
        {/* Subtle floor grid for that "Simulation" feel */}
        <gridHelper args={[20, 20, "#00f0ff", "#222222"]} position={[0, -0.5, 0]} />
      </group>
    </>
  );
}

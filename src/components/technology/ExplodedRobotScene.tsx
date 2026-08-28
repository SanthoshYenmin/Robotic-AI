"use client";

import { useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { Html, Environment } from "@react-three/drei";

function Annotation({ children, position, visible, delay = 0 }: { children: React.ReactNode, position: [number, number, number], visible: boolean, delay?: number }) {
  return (
    <Html position={position} center zIndexRange={[100, 0]}>
      <div 
        className={`transition-all duration-700 pointer-events-none flex items-center ${
          visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
        }`}
        style={{ transitionDelay: `${delay}ms` }}
      >
        <div className="w-16 h-[1px] bg-[#00f0ff] mr-4 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#00f0ff] rounded-full shadow-[0_0_10px_#00f0ff]"></div>
        </div>
        <div className="bg-black/90 border border-[#00f0ff]/30 p-3 min-w-[200px] backdrop-blur-sm">
          {children}
        </div>
      </div>
    </Html>
  );
}

function ExplodedRobot() {
  const headRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Group>(null);
  const armsRef = useRef<THREE.Group>(null);
  const legsRef = useRef<THREE.Group>(null);

  // Materials
  const armorMaterial = new THREE.MeshStandardMaterial({ color: "#1a1a1a", roughness: 0.15, metalness: 0.9 });
  const internalMaterial = new THREE.MeshStandardMaterial({ color: "#ffaa00", roughness: 0.4, metalness: 0.9 });
  const jointMaterial = new THREE.MeshStandardMaterial({ color: "#050505", roughness: 0.6, metalness: 0.9 });
  const emissiveMaterial = new THREE.MeshStandardMaterial({ color: "#00f0ff", emissive: "#00f0ff", emissiveIntensity: 2, toneMapped: false });

  useEffect(() => {
    // ScrollTrigger to explode the robot
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#tech-sections",
        start: "top bottom",
        end: "bottom bottom",
        scrub: 1,
      },
    });

    // Explode animations
    if (headRef.current && torsoRef.current && armsRef.current && legsRef.current) {
      tl.to(headRef.current.position, { y: 3.5, ease: "power1.inOut" }, 0);
      tl.to(torsoRef.current.position, { z: 1, ease: "power1.inOut" }, 0);
      tl.to(armsRef.current.position, { x: 0, z: -1, ease: "power1.inOut" }, 0);
      tl.to(legsRef.current.position, { y: -2, ease: "power1.inOut" }, 0);
    }

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <group position={[1, 0, 0]}>
      {/* HEAD */}
      <group ref={headRef} position={[0, 1.9, 0]}>
        <mesh material={armorMaterial}>
          <boxGeometry args={[0.4, 0.5, 0.45]} />
        </mesh>
        <mesh position={[0, 0.05, 0.23]} material={new THREE.MeshStandardMaterial({ color: "#000000", roughness: 0.1, metalness: 1 })}>
          <boxGeometry args={[0.3, 0.15, 0.05]} />
        </mesh>
        <Annotation position={[0.3, 0, 0]} visible={true} delay={100}>
          <h4 className="text-[#00f0ff] font-mono text-xs font-bold uppercase tracking-widest mb-1">Vision System</h4>
          <p className="text-gray-400 font-mono text-[10px]">Stereo depth cameras with sub-millimeter accuracy.</p>
        </Annotation>
      </group>

      {/* TORSO */}
      <group ref={torsoRef} position={[0, 1.2, 0]}>
        <mesh material={armorMaterial}>
          <boxGeometry args={[0.7, 0.8, 0.4]} />
        </mesh>
        {/* Battery inside Torso */}
        <mesh position={[0, 0, -0.1]} material={internalMaterial}>
          <boxGeometry args={[0.4, 0.5, 0.2]} />
        </mesh>
        <mesh position={[0, 0.05, 0.21]} material={emissiveMaterial}>
          <cylinderGeometry args={[0.05, 0.05, 0.02, 16]} />
        </mesh>
        <Annotation position={[0.4, 0, 0]} visible={true} delay={200}>
          <h4 className="text-[#00f0ff] font-mono text-xs font-bold uppercase tracking-widest mb-1">Energy Core</h4>
          <p className="text-gray-400 font-mono text-[10px]">High-density solid-state battery architecture.</p>
        </Annotation>
      </group>

      {/* ARMS & HANDS */}
      <group ref={armsRef} position={[0, 0, 0]}>
        <mesh position={[-0.45, 1.4, 0]} material={jointMaterial}>
          <sphereGeometry args={[0.15, 32, 32]} />
        </mesh>
        <mesh position={[0.45, 1.4, 0]} material={jointMaterial}>
          <sphereGeometry args={[0.15, 32, 32]} />
        </mesh>
        <mesh position={[-0.55, 1.0, 0]} material={armorMaterial}>
          <cylinderGeometry args={[0.1, 0.08, 0.6]} />
        </mesh>
        <mesh position={[0.55, 1.0, 0]} material={armorMaterial}>
          <cylinderGeometry args={[0.1, 0.08, 0.6]} />
        </mesh>
        <Annotation position={[0.7, 1.0, 0]} visible={true} delay={300}>
          <h4 className="text-[#00f0ff] font-mono text-xs font-bold uppercase tracking-widest mb-1">Actuation</h4>
          <p className="text-gray-400 font-mono text-[10px]">High-torque custom motors for dexterous manipulation.</p>
        </Annotation>
      </group>

      {/* LEGS */}
      <group ref={legsRef} position={[0, 0, 0]}>
        <mesh position={[0, 0.7, 0]} material={armorMaterial}>
          <boxGeometry args={[0.5, 0.3, 0.35]} />
        </mesh>
        <mesh position={[-0.2, 0.5, 0]} material={jointMaterial}>
          <sphereGeometry args={[0.12, 32, 32]} />
        </mesh>
        <mesh position={[0.2, 0.5, 0]} material={jointMaterial}>
          <sphereGeometry args={[0.12, 32, 32]} />
        </mesh>
        <mesh position={[-0.2, 0.1, 0]} material={armorMaterial}>
          <cylinderGeometry args={[0.1, 0.09, 0.6]} />
        </mesh>
        <mesh position={[0.2, 0.1, 0]} material={armorMaterial}>
          <cylinderGeometry args={[0.1, 0.09, 0.6]} />
        </mesh>
        <Annotation position={[0.3, 0.1, 0]} visible={true} delay={400}>
          <h4 className="text-[#00f0ff] font-mono text-xs font-bold uppercase tracking-widest mb-1">Locomotion</h4>
          <p className="text-gray-400 font-mono text-[10px]">Dynamic balancing algorithms running at 1000Hz.</p>
        </Annotation>
      </group>
    </group>
  );
}

export default function ExplodedRobotScene() {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
      <Canvas camera={{ position: [0, 1, 6], fov: 45 }}>
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 5, 5]} intensity={2} color="#ffffff" />
        <pointLight position={[-5, 5, -5]} intensity={1} color="#00f0ff" />
        <Environment preset="studio" />
        
        <ExplodedRobot />
      </Canvas>
    </div>
  );
}

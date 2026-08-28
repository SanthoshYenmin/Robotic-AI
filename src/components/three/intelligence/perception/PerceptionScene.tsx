import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import WarehouseEnvironment from "./WarehouseEnvironment";
import PerceptionRobot from "./PerceptionRobot";
import SensorScan from "./SensorScan";
import ObjectDetection from "./ObjectDetection";
import DepthVisualization from "./DepthVisualization";
import PerceptionPointCloud from "./PerceptionPointCloud";

gsap.registerPlugin(ScrollTrigger);

export default function PerceptionScene() {
  const groupRef = useRef<THREE.Group>(null);
  const scanRef = useRef<THREE.Group>(null);
  const detectRef = useRef<THREE.Group>(null);
  const depthRef = useRef<THREE.Group>(null);
  const cloudRef = useRef<THREE.Group>(null);
  const warehouseRef = useRef<THREE.Group>(null);
  
  const { camera } = useThree();
  
  useGSAP(() => {
    if (!groupRef.current || !scanRef.current || !detectRef.current || !depthRef.current || !cloudRef.current || !warehouseRef.current) return;
    
    // Initial states
    scanRef.current.visible = false;
    detectRef.current.visible = false;
    depthRef.current.visible = false;
    cloudRef.current.visible = false;
    warehouseRef.current.visible = true;
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#perception-section",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        id: "perception-3d-master"
      }
    });

    // 0% - 15%: Normal warehouse. Robot is idle.
    tl.to({}, {duration: 0.15});
    
    // 15% - 25%: Robot activates, camera starts moving closer
    tl.to(camera.position, {
      z: 3,
      y: 1.5,
      duration: 0.1,
      ease: "power1.inOut"
    }, 0.15);

    // 25% - 40%: Sensor scan activates
    tl.call(() => { if (scanRef.current) scanRef.current.visible = true; }, [], 0.25);
    tl.call(() => { if (scanRef.current) scanRef.current.visible = false; }, [], 0.40);
    // Animate scan moving across
    tl.fromTo(scanRef.current.position, 
      { z: 5 }, { z: -10, duration: 0.15 }, 0.25
    );

    // 40% - 55%: Object detection
    tl.call(() => { if (detectRef.current) detectRef.current.visible = true; }, [], 0.40);

    // 55% - 65%: Human tracking (Placeholder for now, just keep detect visible)
    
    // 65% - 75%: Depth perception
    tl.call(() => { if (depthRef.current) depthRef.current.visible = true; }, [], 0.65);

    // 75% - 88%: Real world -> Point cloud
    tl.call(() => { if (cloudRef.current) cloudRef.current.visible = true; }, [], 0.75);
    tl.to(warehouseRef.current.position, { y: -10, duration: 0.13 }, 0.75); // Hide warehouse

    // 88% - 96%: Robot POV (Camera moves into robot head)
    tl.to(camera.position, {
      x: 0,
      y: 1.5,
      z: 0.5,
      duration: 0.08,
      ease: "power2.inOut"
    }, 0.88);

  }, { dependencies: [camera] });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} color="#00f0ff" />
      
      <group ref={warehouseRef}>
        <WarehouseEnvironment />
      </group>
      
      <PerceptionRobot />
      
      <group ref={scanRef}>
        <SensorScan />
      </group>
      
      <group ref={detectRef}>
        <ObjectDetection position={[-4.5, 1, -4.5]} label="PACKAGE" confidence={96} />
        <ObjectDetection position={[4, 1, -2]} label="PERSON" confidence={98} />
      </group>
      
      <group ref={depthRef}>
        <DepthVisualization />
      </group>
      
      <group ref={cloudRef}>
        <PerceptionPointCloud />
      </group>
    </group>
  );
}

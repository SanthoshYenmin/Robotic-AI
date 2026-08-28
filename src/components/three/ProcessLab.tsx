"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Grid, Line, Sphere, Box, Cylinder, Torus, Cone } from "@react-three/drei";
import * as THREE from "three";

interface ProcessLabProps {
  progressRef: React.MutableRefObject<{ value: number }>;
}

// Smooth ease in/out
function smoothstep(x: number) {
  return x * x * (3 - 2 * x);
}

// Clamp progress within a range and normalize to 0–1
function inRange(p: number, min: number, max: number) {
  return THREE.MathUtils.clamp((p - min) / (max - min), 0, 1);
}

// Target particle positions for Imagine stage
const PARTICLE_TARGETS = Array.from({ length: 40 }, (_, i) => ({
  x: (Math.random() - 0.5) * 14,
  y: (Math.random() - 0.5) * 6 + 2,
  z: (Math.random() - 0.5) * 14 - 3,
}));

export default function ProcessLab({ progressRef }: ProcessLabProps) {
  // ----- Refs -----
  const robotGroupRef = useRef<THREE.Group>(null);
  const robotHeadRef = useRef<THREE.Group>(null);
  const eyeGlowRef = useRef<THREE.Mesh>(null);

  const objectiveGroupRef = useRef<THREE.Group>(null);
  const blueprintRingsRef = useRef<THREE.Group>(null);
  const obstacleRef = useRef<THREE.Group>(null);
  const pathGroupRef = useRef<THREE.Group>(null);
  const visionConeRef = useRef<THREE.Group>(null);
  const scanBoxGroupRef = useRef<THREE.Group>(null);
  const particlesGroupRef = useRef<THREE.Points>(null);

  // ----- Materials -----
  const wireMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#00f0ff",
        wireframe: true,
        transparent: true,
        opacity: 0.7,
      }),
    []
  );
  const solidMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#1a2e35",
        metalness: 0.9,
        roughness: 0.2,
        transparent: true,
        opacity: 0,
      }),
    []
  );
  const glowMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#00f0ff",
        emissive: "#00f0ff",
        emissiveIntensity: 2,
      }),
    []
  );
  const obstacleMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ff2244",
        emissive: "#ff2244",
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0,
      }),
    []
  );

  // ----- Particles geometry -----
  const particlesGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_TARGETS.length * 3);
    for (let i = 0; i < PARTICLE_TARGETS.length; i++) {
      positions[i * 3] = PARTICLE_TARGETS[i].x;
      positions[i * 3 + 1] = PARTICLE_TARGETS[i].y;
      positions[i * 3 + 2] = PARTICLE_TARGETS[i].z;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  const particlesMat = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: "#00f0ff",
        size: 0.08,
        transparent: true,
        opacity: 0,
      }),
    []
  );

  // Path line points
  const straightPath: THREE.Vector3[] = [
    new THREE.Vector3(0, 0.05, 0),
    new THREE.Vector3(0, 0.05, -2.5),
  ];
  const detourPath: THREE.Vector3[] = [
    new THREE.Vector3(0, 0.05, -1.8),
    new THREE.Vector3(1.8, 0.05, -2.8),
    new THREE.Vector3(1.8, 0.05, -5),
  ];

  // ----- Camera waypoints [x, y, z] per stage -----
  const camWaypoints: [number, number, number][] = [
    [0, 3, 9],    // 0 Imagine  – wide, dramatic
    [4, 4, 7],    // 1 Design   – side angle blueprint
    [0, 9, 0.5],  // 2 Simulate – top-down path view
    [-3, 3, 8],   // 3 Build    – dramatic front-side
    [0, 1.8, 4],  // 4 Train    – close head
    [-1.5, 2, 7], // 5 Deploy   – behind robot
    [-1.5, 2, 7], // buffer
  ];

  useFrame((state, delta) => {
    const p = THREE.MathUtils.clamp(progressRef.current.value, 0, 6);
    const t = state.clock.elapsedTime;

    // Per-stage progress values (0→1)
    const s0 = inRange(p, 0, 1);   // Imagine
    const s1 = inRange(p, 1, 2);   // Design
    const s2 = inRange(p, 2, 3);   // Simulate
    const s3 = inRange(p, 3, 4);   // Build
    const s4 = inRange(p, 4, 5);   // Train
    const s5 = inRange(p, 5, 6);   // Deploy

    // ═══ PARTICLES (Imagine) ═══
    if (particlesGroupRef.current) {
      const pm = particlesGroupRef.current.material as THREE.PointsMaterial;
      pm.opacity = s0 > 0.05 ? s0 * (1 - inRange(p, 1.5, 2)) : 0;
      const positions = particlesGroupRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const targetX = 0, targetY = 0.5, targetZ = -5;
      const converge = smoothstep(s0);
      for (let i = 0; i < PARTICLE_TARGETS.length; i++) {
        positions.setXYZ(
          i,
          THREE.MathUtils.lerp(PARTICLE_TARGETS[i].x, targetX, converge * 0.6),
          THREE.MathUtils.lerp(PARTICLE_TARGETS[i].y, targetY, converge * 0.6),
          THREE.MathUtils.lerp(PARTICLE_TARGETS[i].z, targetZ, converge * 0.6)
        );
      }
      positions.needsUpdate = true;
    }

    // ═══ OBJECTIVE ORB (Imagine + Simulate) ═══
    if (objectiveGroupRef.current) {
      const orbAppear = smoothstep(inRange(p, 0, 0.5));
      const orbDisappear = 1 - smoothstep(inRange(p, 3.2, 3.8));
      objectiveGroupRef.current.scale.setScalar(orbAppear * orbDisappear);
      objectiveGroupRef.current.rotation.y = t * 0.5;
    }

    // ═══ BLUEPRINT RINGS (Design) ═══
    if (blueprintRingsRef.current) {
      const appear = smoothstep(inRange(p, 0.9, 1.6));
      const disappear = 1 - smoothstep(inRange(p, 2.5, 3));
      blueprintRingsRef.current.scale.setScalar(appear * disappear);
      blueprintRingsRef.current.rotation.y += delta * 0.3;
      blueprintRingsRef.current.rotation.x = Math.sin(t * 0.2) * 0.3;
    }

    // ═══ ROBOT MATERIALS (Build: wireframe → solid) ═══
    const buildS = smoothstep(s3);
    wireMat.opacity = 0.7 * (1 - buildS * 0.9);
    solidMat.opacity = buildS;
    solidMat.transparent = solidMat.opacity < 0.99;

    // ═══ OBSTACLE (Simulate) ═══
    const obsAppear = smoothstep(inRange(p, 2.3, 2.6));
    const obsDisappear = 1 - smoothstep(inRange(p, 3.5, 4));
    obstacleMat.opacity = obsAppear * obsDisappear;
    obstacleMat.transparent = true;

    // ═══ PATH LINES ═══
    if (pathGroupRef.current) {
      const pathVisible = p > 1.9 && p < 4;
      pathGroupRef.current.visible = pathVisible;
    }

    // ═══ ROBOT MOVEMENT ═══
    if (robotGroupRef.current) {
      if (p >= 2 && p < 3) {
        // Simulate: robot moves forward then dodges
        if (s2 < 0.45) {
          robotGroupRef.current.position.x = THREE.MathUtils.lerp(0, 0, s2 / 0.45);
          robotGroupRef.current.position.z = THREE.MathUtils.lerp(0, -1.6, s2 / 0.45);
          robotGroupRef.current.rotation.y = 0;
        } else {
          const dodge = (s2 - 0.45) / 0.55;
          robotGroupRef.current.position.x = THREE.MathUtils.lerp(0, 1.8, smoothstep(dodge));
          robotGroupRef.current.position.z = THREE.MathUtils.lerp(-1.6, -4, smoothstep(dodge));
          robotGroupRef.current.rotation.y = THREE.MathUtils.lerp(0, -0.4, smoothstep(dodge));
        }
      } else if (p >= 5) {
        // Deploy: walk forward
        robotGroupRef.current.position.x = 0;
        robotGroupRef.current.position.z = THREE.MathUtils.lerp(0, -10, smoothstep(s5));
        robotGroupRef.current.rotation.y = 0;
        // Walking bob
        robotGroupRef.current.position.y = Math.abs(Math.sin(t * 6)) * 0.05 * s5;
      } else if (p < 2) {
        robotGroupRef.current.position.set(0, 0, 0);
        robotGroupRef.current.rotation.y = 0;
      } else if (p >= 3 && p < 5) {
        // Gradually reset
        robotGroupRef.current.position.x = THREE.MathUtils.lerp(robotGroupRef.current.position.x, 0, 0.03);
        robotGroupRef.current.position.z = THREE.MathUtils.lerp(robotGroupRef.current.position.z, 0, 0.03);
        robotGroupRef.current.rotation.y = THREE.MathUtils.lerp(robotGroupRef.current.rotation.y, 0, 0.03);
      }
    }

    // ═══ HEAD TRACK (slight look-around) ═══
    if (robotHeadRef.current) {
      if (p >= 4 && p < 5) {
        // Train: head scans side to side
        robotHeadRef.current.rotation.y = Math.sin(t * 1.2) * 0.4;
      } else {
        robotHeadRef.current.rotation.y = THREE.MathUtils.lerp(robotHeadRef.current.rotation.y, 0, 0.05);
      }
    }

    // ═══ EYE GLOW ═══
    if (eyeGlowRef.current) {
      const eyeMat = eyeGlowRef.current.material as THREE.MeshStandardMaterial;
      eyeMat.emissiveIntensity = p >= 4 ? 3 + Math.sin(t * 10) * 1.5 : 1 + Math.sin(t * 2) * 0.3;
    }

    // ═══ VISION CONE (Train) ═══
    if (visionConeRef.current) {
      const coneAppear = smoothstep(inRange(p, 3.8, 4.5));
      const coneDisappear = 1 - smoothstep(inRange(p, 5, 5.3));
      visionConeRef.current.scale.setScalar(coneAppear * coneDisappear);
    }

    // ═══ SCAN BOXES (Train) ═══
    if (scanBoxGroupRef.current) {
      const show = p > 4 && p < 5.3;
      scanBoxGroupRef.current.visible = show;
      if (show) {
        // Pulse the scan boxes
        scanBoxGroupRef.current.children.forEach((child, i) => {
          (child as THREE.Mesh).scale.setScalar(1 + Math.sin(t * 4 + i * 1.5) * 0.06);
        });
      }
    }

    // ═══ CAMERA ═══
    const stageIdx = Math.min(5, Math.floor(p));
    const stageFrac = smoothstep(p - stageIdx);
    const nextIdx = Math.min(6, stageIdx + 1);

    const from = camWaypoints[stageIdx];
    const to = camWaypoints[nextIdx];

    const targetX = THREE.MathUtils.lerp(from[0], to[0], stageFrac);
    const targetY = THREE.MathUtils.lerp(from[1], to[1], stageFrac);
    const targetZ = THREE.MathUtils.lerp(from[2], to[2], stageFrac);

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.04);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.04);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.04);

    // Look at robot (follows during deploy)
    const lookZ = p >= 5 ? THREE.MathUtils.lerp(0, -8, smoothstep(s5)) : 0;
    const lookTarget = new THREE.Vector3(0, 0.8, lookZ);
    state.camera.lookAt(lookTarget);
  });

  return (
    <group>
      {/* ── Lighting ── */}
      <ambientLight intensity={0.25} />
      <pointLight position={[0, 8, 4]} intensity={2} color="#00f0ff" />
      <pointLight position={[6, 4, -4]} intensity={0.8} color="#ffffff" />
      <pointLight position={[-6, 4, -4]} intensity={0.8} color="#0040ff" />

      {/* ── Grid Floor ── */}
      <Grid
        args={[40, 40]}
        position={[0, -0.02, 0]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#00f0ff"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#00f0ff"
        fadeDistance={22}
        fadeStrength={1.5}
      />

      {/* ── Objective Orb ── */}
      <group ref={objectiveGroupRef} position={[0, 0.5, -5]}>
        <Sphere args={[0.25, 20, 20]}>
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={4} />
        </Sphere>
        {/* Pulse rings */}
        <Torus args={[0.7, 0.015, 12, 48]}>
          <meshBasicMaterial color="#00f0ff" transparent opacity={0.6} />
        </Torus>
        <Torus args={[1.1, 0.01, 12, 48]} rotation={[Math.PI / 2, 0, 0]}>
          <meshBasicMaterial color="#00f0ff" transparent opacity={0.35} />
        </Torus>
        <Torus args={[1.4, 0.01, 12, 48]} rotation={[Math.PI / 3, Math.PI / 6, 0]}>
          <meshBasicMaterial color="#00f0ff" transparent opacity={0.2} />
        </Torus>
      </group>

      {/* ── Particles ── */}
      <points ref={particlesGroupRef} geometry={particlesGeo} material={particlesMat} />

      {/* ── Robot ── */}
      <group ref={robotGroupRef} position={[0, 0, 0]}>

        {/* Legs */}
        {[-0.28, 0.28].map((x, i) => (
          <group key={i} position={[x, -0.85, 0]}>
            <Cylinder args={[0.11, 0.11, 0.85, 8]} position={[0, 0, 0]}>
              <primitive object={solidMat} attach="material" />
            </Cylinder>
            <Cylinder args={[0.12, 0.12, 0.87, 8]} position={[0, 0, 0]}>
              <primitive object={wireMat} attach="material" />
            </Cylinder>
          </group>
        ))}

        {/* Body */}
        <Box args={[1, 1.15, 0.65]} position={[0, 0, 0]}>
          <primitive object={solidMat} attach="material" />
        </Box>
        <Box args={[1.05, 1.2, 0.7]} position={[0, 0, 0]}>
          <primitive object={wireMat} attach="material" />
        </Box>
        {/* Chest core */}
        <Box args={[0.28, 0.08, 0.06]} position={[0, 0, 0.34]}>
          <primitive object={glowMat} attach="material" />
        </Box>
        <Sphere args={[0.07, 10, 10]} position={[0, 0.2, 0.34]}>
          <primitive object={glowMat} attach="material" />
        </Sphere>

        {/* Left Arm */}
        <group position={[-0.68, 0.08, 0]}>
          <Cylinder args={[0.1, 0.1, 0.85, 8]} rotation={[0, 0, Math.PI / 7]}>
            <primitive object={solidMat} attach="material" />
          </Cylinder>
          <Cylinder args={[0.11, 0.11, 0.88, 8]} rotation={[0, 0, Math.PI / 7]}>
            <primitive object={wireMat} attach="material" />
          </Cylinder>
        </group>

        {/* Right Arm */}
        <group position={[0.68, 0.08, 0]}>
          <Cylinder args={[0.1, 0.1, 0.85, 8]} rotation={[0, 0, -Math.PI / 7]}>
            <primitive object={solidMat} attach="material" />
          </Cylinder>
          <Cylinder args={[0.11, 0.11, 0.88, 8]} rotation={[0, 0, -Math.PI / 7]}>
            <primitive object={wireMat} attach="material" />
          </Cylinder>
        </group>

        {/* Head */}
        <group ref={robotHeadRef} position={[0, 1, 0]}>
          <Box args={[0.58, 0.58, 0.58]}>
            <primitive object={solidMat} attach="material" />
          </Box>
          <Box args={[0.63, 0.63, 0.63]}>
            <primitive object={wireMat} attach="material" />
          </Box>
          {/* Eye visor */}
          <Box ref={eyeGlowRef} args={[0.45, 0.08, 0.04]} position={[0, 0.06, 0.3]}>
            <primitive object={glowMat} attach="material" />
          </Box>
          {/* Antenna */}
          <Cylinder args={[0.018, 0.018, 0.3, 6]} position={[0, 0.44, 0]}>
            <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={1} />
          </Cylinder>
          <Sphere args={[0.04, 8, 8]} position={[0, 0.6, 0]}>
            <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={3} />
          </Sphere>
        </group>

        {/* ── Blueprint Rings ── */}
        <group ref={blueprintRingsRef} scale={0}>
          {[
            [1.6, 0.018, [0, 0, 0]],
            [2.1, 0.013, [Math.PI / 3, 0, Math.PI / 5]],
            [1.85, 0.011, [0, 0, Math.PI / 2.5]],
          ].map(([r, t, rot], i) => (
            <Torus
              key={i}
              args={[r as number, t as number, 12, 64]}
              rotation={rot as [number, number, number]}
            >
              <meshBasicMaterial color={i === 0 ? "#00f0ff" : i === 1 ? "#ffffff" : "#0088ff"} transparent opacity={0.5 - i * 0.1} />
            </Torus>
          ))}
          {/* Dimension markers */}
          {[
            [[0, 0, 0], [0, 2.3, 0]],
            [[0, 0, 0], [2.3, 0, 0]],
            [[0, 0, 0], [-2.3, 0.8, 0]],
            [[0, 0, 0], [0, -0.5, 2.3]],
          ].map((pts, i) => (
            <Line
              key={i}
              points={pts as [number, number, number][]}
              color="#00f0ff"
              lineWidth={0.5}
              transparent
              opacity={0.35}
              dashed
              dashScale={4}
            />
          ))}
        </group>

        {/* ── Vision Cone ── */}
        <group ref={visionConeRef} position={[0, 1, -0.32]} rotation={[-Math.PI / 2, 0, 0]} scale={0}>
          <Cone args={[2.2, 5, 18, 1, true]}>
            <meshBasicMaterial color="#00f0ff" transparent opacity={0.07} side={THREE.DoubleSide} depthWrite={false} />
          </Cone>
          <Cone args={[2.25, 5, 18, 1, true]}>
            <meshBasicMaterial color="#00f0ff" transparent opacity={0.03} wireframe />
          </Cone>
        </group>

        {/* ── Scan Detection Boxes ── */}
        <group ref={scanBoxGroupRef} visible={false}>
          {[
            [[-1.8, 0.6, -2], [0.7, 0.7, 0.7]],
            [[1.5, 0.4, -3], [0.5, 0.5, 0.5]],
            [[-2.5, 0.3, -1.5], [0.4, 0.4, 0.4]],
          ].map(([pos, size], i) => (
            <Box key={i} args={size as [number, number, number]} position={pos as [number, number, number]}>
              <meshBasicMaterial color={i === 0 ? "#00f0ff" : "#ffaa00"} wireframe transparent opacity={0.6} />
            </Box>
          ))}
        </group>
      </group>

      {/* ── Obstacle ── */}
      <group ref={obstacleRef} position={[0, 0.5, -2.5]}>
        <Box args={[0.7, 1, 0.7]}>
          <primitive object={obstacleMat} attach="material" />
        </Box>
        <Box args={[0.8, 1.1, 0.8]}>
          <meshStandardMaterial color="#ff2244" wireframe transparent opacity={0.4} />
        </Box>
      </group>

      {/* ── Path Lines ── */}
      <group ref={pathGroupRef}>
        <Line points={straightPath} color="#00f0ff" lineWidth={2.5} dashed dashScale={6} dashSize={0.4} gapSize={0.2} />
        <Line points={detourPath} color="#ffaa00" lineWidth={2.5} dashed dashScale={6} dashSize={0.4} gapSize={0.2} />
      </group>
    </group>
  );
}

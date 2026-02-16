// TreehouseInterior3D - Phase 1: Tom-style fixed-camera 3D room + Buddy inside + clickable stations
// Uses simple geometry + lighting + sparkles for an immersive illusion without needing a full interior asset.

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Center, Html, Sparkles, useAnimations, useGLTF } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';
import { computeFitScale, computeGroundOffsetY } from '../utils/fitModel';

function MagicLightPulse() {
  const lightRef = useRef<THREE.PointLight>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!lightRef.current) return;
    // gentle, non-distracting pulse
    lightRef.current.intensity = 0.55 + Math.sin(t * 0.8) * 0.10;
  });
  return <pointLight ref={lightRef} position={[-2.8, 2.6, 1.8]} intensity={0.6} color={'#ffccaa'} />;
}

function InteriorCameraRig() {
  const { camera, size } = useThree();

  useEffect(() => {
    const aspect = size.width / Math.max(1, size.height);
    const isLandscapeTight = aspect > 1.15 && size.height < 480;

    const cam: THREE.PerspectiveCamera | null = (camera as any)?.isPerspectiveCamera ? (camera as any) : null;

    if (isLandscapeTight) {
      // pull back + shift left a bit so right-side stations don't clip
      camera.position.set(0.8, 2.05, 9.6);
      if (cam) cam.fov = 42;
    } else {
      camera.position.set(0.75, 1.9, 8.2);
      if (cam) cam.fov = 47;
    }

    camera.lookAt(0.4, 0.9, 0);
    cam?.updateProjectionMatrix();
  }, [camera, size.width, size.height]);

  return null;
}

import BasketballGame from './funActivities/BasketballGame';
import FeedingGame from './funActivities/FeedingGame';
import BedtimeGame from './funActivities/BedtimeGame';
import { useBuddyStore } from '../store/buddyStore';
import { HUDBar, Pill, RoundIconButton } from './HUDBar';

interface TreehouseInterior3DProps {
  onBack: () => void;
  onBuddyClick?: () => void;
  onToggleMusic?: () => void;
  musicEnabled?: boolean;
  totalStars?: number;
  /** Show debug overlay for iOS pointer/animation diagnostics. */
  debug?: boolean;
}

type StationId = 'basketball' | 'feeding' | 'bedtime';

function BuddyModel3D({
  onClick,
  onDebug,
  moveTargetX,
}: {
  onClick?: () => void;
  onDebug?: (info: { actionNames: string[] }) => void;
  /** When set, Buddy will ease toward this X position (tap-to-walk feel). */
  moveTargetX?: number | null;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const dragStartRef = useRef<{ x: number; buddyX: number } | null>(null);
  const [buddyX, setBuddyX] = useState(-2.15);
  const buddyXRef = useRef(-2.15);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    buddyXRef.current = buddyX;
  }, [buddyX]);

  const { scene, animations } = useGLTF('/models/buddy-animated-opt.glb') as any;
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { actions } = useAnimations(animations ?? [], groupRef);

  // Standardize Buddy size across scenes (single knob)
  const BUDDY_TARGET_HEIGHT = 2.55;
  const { buddyScale, buddyGroundOffset } = useMemo(() => {
    const s = computeFitScale(clonedScene, BUDDY_TARGET_HEIGHT);
    const off = computeGroundOffsetY(clonedScene);
    return { buddyScale: s, buddyGroundOffset: off };
  }, [clonedScene]);

  useEffect(() => {
    const names = actions ? Object.keys(actions).filter(Boolean) : [];
    onDebug?.({ actionNames: names });

    const idle = actions?.Idle;
    if (!idle) return;
    idle.reset().fadeIn(0.2).play();
    return () => {
      try {
        idle.fadeOut(0.15);
      } catch {}
    };
  }, [actions, onDebug]);

  // (tap timing ref removed; using press-and-hold)

  const triggerTapReact = () => {
    const tap = actions?.TapReact;
    const idle = actions?.Idle;
    if (!tap) return;
    try {
      tap.reset();
      tap.setLoop(THREE.LoopOnce, 1);
      tap.clampWhenFinished = true;
      tap.fadeIn(0.05).play();
      window.setTimeout(() => {
        try {
          tap.fadeOut(0.1);
          idle?.reset().fadeIn(0.15).play();
        } catch {}
      }, 450);
    } catch {}
  };

  const holdTimerRef = useRef<number | null>(null);
  const holdFiredRef = useRef<boolean>(false);
  const isHoldingRef = useRef<boolean>(false);

  // Press-and-hold to talk (iOS-safe): only fires if we still believe the pointer is down.
  const startHold = () => {
    isHoldingRef.current = true;
    holdFiredRef.current = false;
    if (holdTimerRef.current) window.clearTimeout(holdTimerRef.current);
    holdTimerRef.current = window.setTimeout(() => {
      if (!isHoldingRef.current) return;
      holdFiredRef.current = true;
      onClick?.();
    }, 450);
  };

  const cancelHold = () => {
    isHoldingRef.current = false;
    if (holdTimerRef.current) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };

  // iOS Safari sometimes drops pointerup/pointercancel; add global cancel hooks.
  useEffect(() => {
    const cancel = () => {
      isDraggingRef.current = false;
      dragStartRef.current = null;
      cancelHold();
    };
    window.addEventListener('pointerup', cancel, { passive: true });
    window.addEventListener('pointercancel', cancel, { passive: true });
    window.addEventListener('touchend', cancel, { passive: true });
    window.addEventListener('touchcancel', cancel, { passive: true });
    window.addEventListener('blur', cancel);
    document.addEventListener('visibilitychange', cancel);
    return () => {
      window.removeEventListener('pointerup', cancel);
      window.removeEventListener('pointercancel', cancel);
      window.removeEventListener('touchend', cancel);
      window.removeEventListener('touchcancel', cancel);
      window.removeEventListener('blur', cancel);
      document.removeEventListener('visibilitychange', cancel);
    };
  }, []);

  // Tap-to-walk + subtle idle life.
  useFrame((state, delta) => {
    if (moveTargetX != null && !isDraggingRef.current) {
      const current = buddyXRef.current;
      const target = Math.max(-3.2, Math.min(-0.8, moveTargetX));
      const t = 1 - Math.pow(0.0005, delta); // smooth-ish framerate-independent
      const next = THREE.MathUtils.lerp(current, target, t);
      if (Math.abs(next - current) > 0.0001) {
        buddyXRef.current = next;
        setBuddyX(next);
      }
    }

    // Tiny idle bob/tilt for "alive" feeling.
    if (groupRef.current) {
      const t = state.clock.getElapsedTime();
      const baseY = -2.2 + buddyGroundOffset * buddyScale;
      groupRef.current.position.y = baseY + Math.sin(t * 1.4) * 0.02;
      groupRef.current.rotation.z = Math.sin(t * 0.9) * 0.015;
    }
  });

  return (
    <group
      ref={groupRef}
      // Buddy anchored left; can slide a bit (Tom-like "pet" feel).
      position={[buddyX, -2.2 + buddyGroundOffset * buddyScale, -0.35]}
      // Face toward camera by default (3/4), not away.
      rotation={[0, -0.55, 0]}
      scale={buddyScale}
      onClick={(e) => {
        e.stopPropagation();
        // Tap = react only. Talk is press-and-hold.
        triggerTapReact();
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        // Allow slight horizontal drag to reposition Buddy.
        if (e.pointerType !== 'mouse') {
          isDraggingRef.current = true;
          dragStartRef.current = { x: e.clientX, buddyX: buddyXRef.current };
        }
        startHold();
      }}
      onPointerMove={(e) => {
        if (!dragStartRef.current) return;
        const dx = e.clientX - dragStartRef.current.x;
        // Convert px drag to world-ish units (tuned). Clamp to keep Buddy in frame.
        const next = dragStartRef.current.buddyX + dx * 0.01;
        const clamped = Math.max(-3.2, Math.min(-0.8, next));
        buddyXRef.current = clamped;
        setBuddyX(clamped);
      }}
      onPointerUp={(e) => {
        e.stopPropagation();
        isDraggingRef.current = false;
        dragStartRef.current = null;
        cancelHold();
        if (!holdFiredRef.current) {
          triggerTapReact();
        }
      }}
      onPointerCancel={(e) => {
        e.stopPropagation();
        dragStartRef.current = null;
        cancelHold();
      }}
      onPointerLeave={(e) => {
        e.stopPropagation();
        dragStartRef.current = null;
        cancelHold();
      }}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
      }}
    >
      <Center>
        <primitive object={clonedScene} />
      </Center>
    </group>
  );
}

function Station({
  id,
  label,
  emoji,
  position,
  color,
  onClick,
}: {
  id: StationId;
  label: string;
  emoji: string;
  position: [number, number, number];
  color: string;
  onClick: (id: StationId) => void;
}) {
  const baseColor = new THREE.Color(color);
  const glowColor = new THREE.Color(color).lerp(new THREE.Color('#ffffff'), 0.28);
  const wobbleRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!wobbleRef.current) return;
    const t = clock.getElapsedTime();
    // tiny "alive" motion (toy-like, not floaty UI)
    wobbleRef.current.rotation.y = Math.sin(t * 0.55) * 0.08;
  });

  const handle = (e: any) => {
    e.stopPropagation();
    onClick(id);
  };

  return (
    <group position={position}>
      {/* Invisible hit plate (big, reliable touch target) */}
      <mesh onClick={handle} onPointerDown={handle}>
        <boxGeometry args={[3.2, 2.2, 2.2]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Ground shadow anchor (less podium-like) */}
      <mesh position={[0, -0.95, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.95, 26]} />
        <meshBasicMaterial color={'#000000'} transparent opacity={0.18} />
      </mesh>

      {/* Station object (muted, toy-like, less blocky) */}
      <group ref={wobbleRef}>
        {id === 'feeding' && (
          <>
            <mesh position={[0, -0.12, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.72, 0.82, 0.26, 24]} />
              <meshStandardMaterial color={'#6f4b2e'} roughness={0.85} />
            </mesh>
            <mesh position={[0, 0.16, 0]} castShadow receiveShadow>
              <sphereGeometry args={[0.38, 20, 20]} />
              <meshStandardMaterial color={baseColor} roughness={0.35} metalness={0.04} />
            </mesh>
          </>
        )}

        {id === 'bedtime' && (
          <>
            <mesh position={[0, -0.12, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.12, 0.2, 0.78]} />
              <meshStandardMaterial color={'#6b4d3a'} roughness={0.9} />
            </mesh>
            <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.98, 0.22, 0.64]} />
              <meshStandardMaterial color={baseColor} roughness={0.75} />
            </mesh>
          </>
        )}

        {id === 'basketball' && (
          <>
            <mesh position={[0, 0.22, -0.18]} castShadow receiveShadow>
              <torusGeometry args={[0.44, 0.06, 10, 28]} />
              <meshStandardMaterial color={'#b14a2f'} roughness={0.45} />
            </mesh>
            <mesh position={[0.18, 0.06, 0.22]} castShadow receiveShadow>
              <sphereGeometry args={[0.24, 16, 16]} />
              <meshStandardMaterial color={glowColor} emissive={glowColor} emissiveIntensity={0.12} roughness={0.5} />
            </mesh>
          </>
        )}
      </group>

      {/* Subtle accent only */}
      <Sparkles
        count={4}
        speed={0.16}
        opacity={0.26}
        scale={[1.8, 1.0, 1.8]}
        size={2}
        color={'#ffeaa6'}
        position={[0, 0.1, 0]}
      />

      {/* Minimal label */}
      <Html center distanceFactor={10}>
        <button
          onPointerDown={(e) => {
            e.stopPropagation();
            onClick(id);
          }}
          onClick={(e) => {
            e.stopPropagation();
            onClick(id);
          }}
          style={{
            transform: 'translateY(-44px)',
            textAlign: 'center',
            userSelect: 'none',
            pointerEvents: 'auto',
            color: 'white',
            fontWeight: 800,
            border: 'none',
            background: 'transparent',
            padding: 0,
            textShadow: '0 2px 10px rgba(0,0,0,0.75)',
          }}
        >
          <div style={{ fontSize: 26, lineHeight: '26px' }}>{emoji}</div>
          <div style={{ fontSize: 12, opacity: 0.92 }}>{label}</div>
        </button>
      </Html>
    </group>
  );
}

function FurnitureModel({
  url,
  targetHeight,
  position,
  rotation = [0, 0, 0],
}: {
  url: string;
  targetHeight: number;
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  const { scene } = useGLTF(url) as any;
  const cloned = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { s, yOff } = useMemo(() => {
    const scale = computeFitScale(cloned, targetHeight);
    const off = computeGroundOffsetY(cloned);
    return { s: scale, yOff: off };
  }, [cloned, targetHeight]);

  return (
    <group position={[position[0], position[1] + yOff * s, position[2]]} rotation={rotation} scale={s}>
      <primitive object={cloned} />
    </group>
  );
}

function Room({
  onBuddyClick,
  onStationClick,
  onBuddyDebug,
  buddyMoveTargetX,
}: {
  onBuddyClick?: () => void;
  onStationClick: (id: StationId) => void;
  onBuddyDebug?: (info: { actionNames: string[] }) => void;
  buddyMoveTargetX?: number | null;
}) {
  // Cozy magical treehouse palette (warm wood + lantern glow + soft night accents)
  const wallColor = '#6a3f25';
  const floorColor = '#2a1a12';

  return (
    <>
      {/* Lighting (Tom-like polish: warm key + cool rim + gentle ambient) */}
      <ambientLight intensity={0.45} color={'#ffe9d1'} />
      {/* warm key */}
      <directionalLight
        position={[4.2, 6.2, 3.8]}
        intensity={1.05}
        color={'#fff1db'}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      {/* cool rim */}
      <directionalLight position={[-6.5, 4.6, 6.5]} intensity={0.35} color={'#9ad7ff'} />
      <MagicLightPulse />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.2, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color={floorColor} roughness={0.9} />
      </mesh>

      {/* Cozy rug to anchor scene */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.5, -2.18, 0.2]} receiveShadow>
        <circleGeometry args={[3.2, 40]} />
        <meshStandardMaterial color={'#5a2f1d'} roughness={0.85} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.5, -2.175, 0.2]}>
        <ringGeometry args={[2.2, 2.75, 40]} />
        <meshBasicMaterial color={'#d8a35a'} transparent opacity={0.2} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 1.8, -6]} receiveShadow>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial color={wallColor} roughness={0.95} />
      </mesh>

      {/* Side walls */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-8, 1.8, 0]} receiveShadow>
        <planeGeometry args={[12, 10]} />
        <meshStandardMaterial color={wallColor} roughness={0.95} />
      </mesh>
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[8, 1.8, 0]} receiveShadow>
        <planeGeometry args={[12, 10]} />
        <meshStandardMaterial color={wallColor} roughness={0.95} />
      </mesh>

      {/* "Window" lantern glow */}
      <mesh position={[0.2, 2.45, -5.9]}>
        <planeGeometry args={[4.7, 2.9]} />
        <meshStandardMaterial color={'#ffd8a8'} emissive={'#ff9b3d'} emissiveIntensity={0.35} />
      </mesh>

      {/* Hanging lantern accents */}
      <mesh position={[-5.7, 2.8, -2.8]}>
        <sphereGeometry args={[0.18, 14, 14]} />
        <meshStandardMaterial color={'#ffd68f'} emissive={'#ff9b3d'} emissiveIntensity={0.65} />
      </mesh>
      <mesh position={[5.9, 2.7, -2.6]}>
        <sphereGeometry args={[0.16, 14, 14]} />
        <meshStandardMaterial color={'#ffd68f'} emissive={'#ff9b3d'} emissiveIntensity={0.55} />
      </mesh>

      {/* Imported cozy furniture (non-blocky, Tom-like room feel) */}
      <FurnitureModel
        url={'/models/room/painted_wooden_sofa/painted_wooden_sofa_1k.gltf'}
        targetHeight={1.35}
        position={[-1.9, -2.2, -2.9]}
        rotation={[0, 0.42, 0]}
      />
      <FurnitureModel
        url={'/models/room/coffee_table_round_01/coffee_table_round_01_1k.gltf'}
        targetHeight={0.78}
        position={[0.55, -2.2, -1.25]}
        rotation={[0, -0.1, 0]}
      />
      <FurnitureModel
        url={'/models/room/painted_wooden_nightstand/painted_wooden_nightstand_1k.gltf'}
        targetHeight={0.95}
        position={[4.9, -2.2, -2.3]}
        rotation={[0, -0.32, 0]}
      />

      {/* Sparkles / magic (kept light for iPhone/iPad) */}
      <Sparkles
        count={20}
        speed={0.16}
        opacity={0.32}
        scale={[10, 6, 10]}
        size={3}
        color={'#ffeaa6'}
        position={[0, 1.55, -1]}
      />

      {/* Light rays (simple translucent planes) */}
      <mesh position={[0.25, 2.2, -5.6]} rotation={[0, 0, 0]}>
        <planeGeometry args={[5.2, 3.4]} />
        <meshBasicMaterial color={'#ffd8a8'} transparent opacity={0.06} />
      </mesh>
      <mesh position={[-0.65, 2.0, -5.5]} rotation={[0, 0.12, 0]}>
        <planeGeometry args={[6.0, 3.6]} />
        <meshBasicMaterial color={'#9ad7ff'} transparent opacity={0.05} />
      </mesh>

      {/* Buddy */}
      <BuddyModel3D onClick={onBuddyClick} onDebug={onBuddyDebug} moveTargetX={buddyMoveTargetX} />

      {/* Stations (grouped to the right so Buddy is the star) */}
      <group position={[1.1, 0, 0]}>
        <Station
          id="feeding"
          label="Eat"
          emoji="🍯"
          position={[2.3, -1.15, 1.2]}
          color={'#f59e0b'}
          onClick={onStationClick}
        />
        <Station
          id="bedtime"
          label="Sleep"
          emoji="😴"
          position={[4.9, -1.15, 0.9]}
          color={'#6366f1'}
          onClick={onStationClick}
        />
        <Station
          id="basketball"
          label="Ball"
          emoji="🏀"
          position={[3.6, -1.1, -0.2]}
          color={'#ef4444'}
          onClick={onStationClick}
        />
      </group>

      {/* Soft vignette overlay */}
      <Html fullscreen>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at center, rgba(0,0,0,0) 40%, rgba(0,0,0,0.35) 100%)',
            pointerEvents: 'none',
          }}
        />
      </Html>
    </>
  );
}

export default function TreehouseInterior3D({
  onBack,
  onBuddyClick,
  onToggleMusic,
  musicEnabled = true,
  totalStars: totalStarsProp,
  debug = false,
}: TreehouseInterior3DProps) {
  const [activeGame, setActiveGame] = useState<StationId | null>(null);
  const [buddyMoveTargetX, setBuddyMoveTargetX] = useState<number | null>(null);
  const [debugTapCount, setDebugTapCount] = useState(0);
  const [debugActionNames, setDebugActionNames] = useState<string[]>([]);
  const [debugLastPtr, setDebugLastPtr] = useState<string>('');
  const { totalStars: totalStarsStore, buddyHappiness, buddyEnergy, playFunActivity, setBuddyHappiness, setBuddyEnergy } =
    useBuddyStore();
  const totalStars = totalStarsProp ?? totalStarsStore;

  const handleGameComplete = (gameId: StationId, value: number) => {
    playFunActivity(gameId);
    if (gameId === 'basketball') {
      setBuddyHappiness(Math.min(100, buddyHappiness + 15));
    } else if (gameId === 'feeding') {
      setBuddyHappiness(Math.min(100, buddyHappiness + value * 0.3));
    } else if (gameId === 'bedtime') {
      setBuddyEnergy(value);
    }
  };

  // Render active mini-game overlays (keep existing logic)
  if (activeGame === 'basketball') {
    return <BasketballGame onClose={() => setActiveGame(null)} onComplete={() => handleGameComplete('basketball', 0)} />;
  }
  if (activeGame === 'feeding') {
    return <FeedingGame onClose={() => setActiveGame(null)} onComplete={(happiness) => handleGameComplete('feeding', happiness)} />;
  }
  if (activeGame === 'bedtime') {
    return <BedtimeGame onClose={() => setActiveGame(null)} onComplete={(energy) => handleGameComplete('bedtime', energy)} />;
  }

  return (
    <div className="fixed inset-0 z-0 select-none">
      {/* 3D canvas */}
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [0, 1.8, 7.5], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ touchAction: 'none' }}
        onPointerDown={(e) => {
          if (!debug) return;
          setDebugTapCount((c) => c + 1);
          setDebugLastPtr(`${e.pointerType}:${Math.round(e.clientX)},${Math.round(e.clientY)}`);
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color('#2a0f2b'), 1);
          gl.outputColorSpace = THREE.SRGBColorSpace;
          try {
            gl.domElement.style.touchAction = 'none';
          } catch {}
        }}
      >
        {/* Fixed camera: no orbit controls (Tom-style) */}
        <InteriorCameraRig />
        <Room
          onBuddyClick={onBuddyClick}
          onStationClick={(id) => {
            // Tap-to-walk: nudge Buddy toward the selected station, then open it.
            const targets: Record<StationId, number> = {
              feeding: 0.1,
              bedtime: 0.65,
              basketball: 0.35,
            };
            const tx = targets[id];
            setBuddyMoveTargetX(tx);
            // Delay open slightly to sell movement.
            window.setTimeout(() => {
              setActiveGame(id);
            }, 650);
          }}
          onBuddyDebug={(info) => setDebugActionNames(info.actionNames)}
          buddyMoveTargetX={buddyMoveTargetX}
        />
      </Canvas>

      {/* UI overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <HUDBar
          left={<RoundIconButton label="Home" onPress={onBack}>⌂</RoundIconButton>}
          title={<div className="text-xl font-black text-white drop-shadow-lg">Treehouse</div>}
          right={
            <>
              <RoundIconButton
                label={musicEnabled ? 'Music On' : 'Music Off'}
                onPress={() => onToggleMusic?.()}
              >
                {musicEnabled ? '♫' : '🔇'}
              </RoundIconButton>
              <Pill>
                <span className="text-yellow-300 font-extrabold">⭐ {totalStars}</span>
              </Pill>
            </>
          }
        />

        {/* Status bars */}
        <div className="px-4 md:px-6 flex gap-3 md:gap-4 mt-1 bg-black/20 backdrop-blur-sm rounded-xl mx-3 md:mx-6 py-2 border border-white/10">
          <div className="flex-1">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-xs">💖</span>
              <span className="text-[10px] font-bold text-white/80">Happy</span>
            </div>
            <div className="h-2 bg-black/25 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-pink-400 to-red-400"
                animate={{ width: `${buddyHappiness}%` }}
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-xs">⚡</span>
              <span className="text-[10px] font-bold text-white/80">Energy</span>
            </div>
            <div className="h-2 bg-black/25 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-yellow-300 to-green-400"
                animate={{ width: `${buddyEnergy}%` }}
              />
            </div>
          </div>
        </div>

        {/* Debug overlay (temporary, controlled by prop) */}
        {debug && (
          <div className="pointer-events-auto absolute bottom-16 left-1/2 -translate-x-1/2 max-w-[92vw]">
            <div className="bg-black/60 backdrop-blur rounded-xl px-3 py-2 text-[11px] text-white/90 border border-white/10">
              <div className="font-extrabold">DEBUG</div>
              <div>canvas taps: <span className="font-bold">{debugTapCount}</span> ({debugLastPtr || '—'})</div>
              <div>buddy actions: <span className="font-bold">{debugActionNames.length}</span> [{debugActionNames.join(', ') || '—'}]</div>
            </div>
          </div>
        )}

        {/* Bottom hint (reduced clutter on small screens) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-white/60 text-[11px] font-bold drop-shadow-lg hidden md:block">
          🍯 Eat • 😴 Sleep • 🏀 Ball
        </div>
      </div>
    </div>
  );
}

useGLTF.preload('/models/buddy-animated-opt.glb');
useGLTF.preload('/models/room/painted_wooden_sofa/painted_wooden_sofa_1k.gltf');
useGLTF.preload('/models/room/coffee_table_round_01/coffee_table_round_01_1k.gltf');
useGLTF.preload('/models/room/painted_wooden_nightstand/painted_wooden_nightstand_1k.gltf');

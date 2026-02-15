// TreehouseInterior3D - Phase 1: Tom-style fixed-camera 3D room + Buddy inside + clickable stations
// Uses simple geometry + lighting + sparkles for an immersive illusion without needing a full interior asset.

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Center, Html, Sparkles, useAnimations, useGLTF } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';

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
      camera.position.set(1.2, 2.05, 9.1);
      if (cam) cam.fov = 40;
    } else {
      camera.position.set(1.0, 1.9, 8.0);
      if (cam) cam.fov = 45;
    }

    camera.lookAt(0.6, 0.9, 0);
    cam?.updateProjectionMatrix();
  }, [camera, size.width, size.height]);

  return null;
}

import BasketballGame from './funActivities/BasketballGame';
import FeedingGame from './funActivities/FeedingGame';
import BedtimeGame from './funActivities/BedtimeGame';
import { useBuddyStore } from '../store/buddyStore';

interface TreehouseInterior3DProps {
  onBack: () => void;
  onBuddyClick?: () => void;
  /** Show debug overlay for iOS pointer/animation diagnostics. */
  debug?: boolean;
}

type StationId = 'basketball' | 'feeding' | 'bedtime';

function BuddyModel3D({
  onClick,
  onDebug,
}: {
  onClick?: () => void;
  onDebug?: (info: { actionNames: string[] }) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('/models/buddy-animated-opt.glb') as any;
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { actions } = useAnimations(animations ?? [], groupRef);

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
    const cancel = () => cancelHold();
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

  return (
    <group
      ref={groupRef}
      // Buddy anchored slightly left + forward, Tom-style composition.
      position={[-2.15, -1.55, -0.35]}
      rotation={[0, 0.55, 0]}
      scale={6.4}
      onClick={(e) => {
        e.stopPropagation();
        // Tap = react only. Talk is press-and-hold.
        triggerTapReact();
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        startHold();
      }}
      onPointerUp={(e) => {
        e.stopPropagation();
        cancelHold();
        if (!holdFiredRef.current) {
          triggerTapReact();
        }
      }}
      onPointerCancel={(e) => {
        e.stopPropagation();
        cancelHold();
      }}
      onPointerLeave={(e) => {
        e.stopPropagation();
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
        <boxGeometry args={[3.4, 2.4, 2.4]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* "Wood stump" base (cozy treehouse vibe) */}
      <mesh position={[0, -0.55, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.25, 1.4, 0.55, 20]} />
        <meshStandardMaterial color={'#7a4a2a'} roughness={0.95} metalness={0.0} />
      </mesh>
      <mesh position={[0, -0.26, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.05, 1.18, 0.18, 18]} />
        <meshStandardMaterial color={'#8b5a3c'} roughness={0.9} metalness={0.0} />
      </mesh>

      {/* Station object (distinct silhouette per station) */}
      <group ref={wobbleRef}>
        {id === 'feeding' && (
          <>
            {/* bowl */}
            <mesh position={[0, 0.32, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.62, 0.8, 0.35, 22]} />
              <meshStandardMaterial color={baseColor} roughness={0.35} metalness={0.05} />
            </mesh>
            {/* honey/food blob */}
            <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
              <sphereGeometry args={[0.34, 18, 18]} />
              <meshStandardMaterial color={glowColor} emissive={glowColor} emissiveIntensity={0.45} roughness={0.25} />
            </mesh>
          </>
        )}

        {id === 'bedtime' && (
          <>
            {/* pillow */}
            <mesh position={[0, 0.32, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.15, 0.38, 0.85]} />
              <meshStandardMaterial color={baseColor} roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
              <sphereGeometry args={[0.22, 14, 14]} />
              <meshStandardMaterial color={glowColor} emissive={glowColor} emissiveIntensity={0.35} roughness={0.55} />
            </mesh>
          </>
        )}

        {id === 'basketball' && (
          <>
            {/* hoop frame */}
            <mesh position={[0, 0.55, -0.25]} rotation={[0, 0, 0]} castShadow receiveShadow>
              <torusGeometry args={[0.55, 0.08, 10, 32]} />
              <meshStandardMaterial color={baseColor} emissive={baseColor} emissiveIntensity={0.25} roughness={0.35} />
            </mesh>
            {/* ball */}
            <mesh position={[0, 0.42, 0.35]} castShadow receiveShadow>
              <sphereGeometry args={[0.28, 18, 18]} />
              <meshStandardMaterial color={glowColor} emissive={glowColor} emissiveIntensity={0.25} roughness={0.45} />
            </mesh>
          </>
        )}
      </group>

      {/* Cozy sparkle accent */}
      <Sparkles
        count={10}
        speed={0.22}
        opacity={0.55}
        scale={[2.4, 1.3, 2.4]}
        size={2.5}
        color={'#ffeaa6'}
        position={[0, 0.35, 0]}
      />

      {/* Label */}
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
            transform: 'translateY(-56px)',
            textAlign: 'center',
            userSelect: 'none',
            pointerEvents: 'auto',
            color: 'white',
            fontWeight: 900,
            border: 'none',
            background: 'transparent',
            padding: 0,
            textShadow: '0 2px 12px rgba(0,0,0,0.75)',
          }}
        >
          <div style={{ fontSize: 28, lineHeight: '28px' }}>{emoji}</div>
          <div style={{ fontSize: 14, opacity: 0.95 }}>{label}</div>
        </button>
      </Html>
    </group>
  );
}

function Room({
  onBuddyClick,
  onStationClick,
  onBuddyDebug,
}: {
  onBuddyClick?: () => void;
  onStationClick: (id: StationId) => void;
  onBuddyDebug?: (info: { actionNames: string[] }) => void;
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

      {/* Sparkles / magic (kept light for iPhone/iPad) */}
      <Sparkles
        count={28}
        speed={0.18}
        opacity={0.45}
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
      <BuddyModel3D onClick={onBuddyClick} onDebug={onBuddyDebug} />

      {/* Stations (grouped to the right so Buddy is the star) */}
      <group position={[2.2, 0, 0]}>
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

export default function TreehouseInterior3D({ onBack, onBuddyClick, debug = false }: TreehouseInterior3DProps) {
  const [activeGame, setActiveGame] = useState<StationId | null>(null);
  const [debugTapCount, setDebugTapCount] = useState(0);
  const [debugActionNames, setDebugActionNames] = useState<string[]>([]);
  const [debugLastPtr, setDebugLastPtr] = useState<string>('');
  const { totalStars, buddyHappiness, buddyEnergy, playFunActivity, setBuddyHappiness, setBuddyEnergy } =
    useBuddyStore();

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
          onStationClick={(id) => setActiveGame(id)}
          onBuddyDebug={(info) => setDebugActionNames(info.actionNames)}
        />
      </Canvas>

      {/* UI overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Header */}
        <div className="pointer-events-auto relative z-50 flex justify-between items-center p-4 pt-6">
          <button
            type="button"
            onPointerDown={(e) => {
              // iOS/PWA: prefer pointerdown for reliability
              e.preventDefault();
              e.stopPropagation();
              onBack();
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onBack();
            }}
            className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white text-2xl font-bold active:scale-90 transition-transform"
            aria-label="Back"
          >
            ←
          </button>

          <div className="text-center">
            <div className="text-xl font-black text-white drop-shadow-lg">Buddy’s Room</div>
            <div className="text-[11px] font-bold text-white/70">Tap Buddy • Tap stations</div>
          </div>

          <div className="bg-black/30 backdrop-blur-sm rounded-xl px-4 py-2">
            <span className="text-yellow-300 font-extrabold">⭐ {totalStars}</span>
          </div>
        </div>

        {/* Status bars */}
        <div className="px-6 flex gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-xs">💖</span>
              <span className="text-[10px] font-bold text-white/80">Happy</span>
            </div>
            <div className="h-2.5 bg-black/20 rounded-full overflow-hidden">
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
            <div className="h-2.5 bg-black/20 rounded-full overflow-hidden">
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

        {/* Bottom hint */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-white/70 text-xs font-bold drop-shadow-lg">
          Eat • Sleep • Basketball
        </div>
      </div>
    </div>
  );
}

useGLTF.preload('/models/buddy-animated-opt.glb');

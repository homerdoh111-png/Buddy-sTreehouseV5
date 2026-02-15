// TreehouseInterior3D - Phase 1: Tom-style fixed-camera 3D room + Buddy inside + clickable stations
// Uses simple geometry + lighting + sparkles for an immersive illusion without needing a full interior asset.

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Center, Float, Html, Sparkles, useAnimations, useGLTF } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';

function MagicLightPulse() {
  const lightRef = useRef<THREE.PointLight>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!lightRef.current) return;
    // gentle, non-distracting pulse
    lightRef.current.intensity = 0.65 + Math.sin(t * 0.8) * 0.12;
  });
  return <pointLight ref={lightRef} position={[-3, 2.5, 2]} intensity={0.7} color={'#ffb6c9'} />;
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
      position={[0, -1.55, -0.8]}
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
  return (
    <Float
      speed={1.2}
      rotationIntensity={0.12}
      floatIntensity={0.35}
      floatingRange={[-0.08, 0.12]}
    >
      <group position={position}>
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onClick(id);
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
          onClick(id);
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default';
        }}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1.6, 1.6, 1.6]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.05} />
      </mesh>
      <Html center distanceFactor={10}>
        <div
          onPointerDown={(e) => {
            e.stopPropagation();
            onClick(id);
          }}
          onClick={(e) => {
            e.stopPropagation();
            onClick(id);
          }}
          style={{
            transform: 'translateY(-58px)',
            textAlign: 'center',
            userSelect: 'none',
            pointerEvents: 'auto',
            color: 'white',
            fontWeight: 900,
            textShadow: '0 2px 12px rgba(0,0,0,0.75)',
          }}
        >
          <div style={{ fontSize: 28, lineHeight: '28px' }}>{emoji}</div>
          <div style={{ fontSize: 14, opacity: 0.95 }}>{label}</div>
        </div>
      </Html>
    </group>
    </Float>
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
  // Phase-1 magical treehouse palette (warm wood + purple night + cyan glow)
  const wallColor = '#5b341f';
  const floorColor = '#2d1a12';

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} color={'#ffe7c9'} />
      <directionalLight
        position={[3, 6, 4]}
        intensity={1.05}
        color={'#fff2dc'}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
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

      {/* "Window" magic glow */}
      <mesh position={[0, 2.4, -5.9]}>
        <planeGeometry args={[4.5, 2.8]} />
        <meshStandardMaterial color={'#7dd3ff'} emissive={'#2aa6ff'} emissiveIntensity={0.55} />
      </mesh>

      {/* Sparkles / magic (kept light for iPhone/iPad) */}
      <Sparkles
        count={45}
        speed={0.22}
        opacity={0.55}
        scale={[10, 6, 10]}
        size={3}
        color={'#fff1a8'}
        position={[0, 1.6, -1]}
      />

      {/* Light rays (simple translucent planes) */}
      <mesh position={[0.2, 2.2, -5.6]} rotation={[0, 0, 0]}>
        <planeGeometry args={[5.2, 3.4]} />
        <meshBasicMaterial color={'#8be9ff'} transparent opacity={0.08} />
      </mesh>
      <mesh position={[-0.6, 2.0, -5.5]} rotation={[0, 0.12, 0]}>
        <planeGeometry args={[6.0, 3.6]} />
        <meshBasicMaterial color={'#c084fc'} transparent opacity={0.06} />
      </mesh>

      {/* Buddy */}
      <BuddyModel3D onClick={onBuddyClick} onDebug={onBuddyDebug} />

      {/* Stations (simple 3D props for now) */}
      <Station
        id="feeding"
        label="Eat"
        emoji="🍕"
        position={[-4.2, -1.0, 1.4]}
        color={'#f59e0b'}
        onClick={onStationClick}
      />
      <Station
        id="bedtime"
        label="Sleep"
        emoji="🛏️"
        position={[4.2, -1.0, 1.4]}
        color={'#6366f1'}
        onClick={onStationClick}
      />
      <Station
        id="basketball"
        label="Basketball"
        emoji="🏀"
        position={[0, -1.0, 0.9]}
        color={'#ef4444'}
        onClick={onStationClick}
      />

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
        <Room
          onBuddyClick={onBuddyClick}
          onStationClick={(id) => setActiveGame(id)}
          onBuddyDebug={(info) => setDebugActionNames(info.actionNames)}
        />
      </Canvas>

      {/* UI overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Header */}
        <div className="pointer-events-auto flex justify-between items-center p-4 pt-6">
          <button
            onClick={onBack}
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

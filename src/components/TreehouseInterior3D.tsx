// TreehouseInterior3D - Phase 1: Tom-style fixed-camera 3D room + Buddy inside + clickable stations
// Uses simple geometry + lighting + sparkles for an immersive illusion without needing a full interior asset.

import { useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, Sparkles, useGLTF } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

import BasketballGame from './funActivities/BasketballGame';
import FeedingGame from './funActivities/FeedingGame';
import BedtimeGame from './funActivities/BedtimeGame';
import { useBuddyStore } from '../store/buddyStore';

interface TreehouseInterior3DProps {
  onBack: () => void;
  onBuddyClick?: () => void;
}

type StationId = 'basketball' | 'feeding' | 'bedtime';

function BuddyModel3D({ onClick }: { onClick?: () => void }) {
  const { scene } = useGLTF('/models/buddy.glb');
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  return (
    <group
      position={[0, -1.2, 0]}
      scale={5.8}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
      }}
    >
      <primitive object={clonedScene} />
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
    <group position={position}>
      <mesh
        onClick={(e) => {
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
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.05} />
      </mesh>
      <Html center distanceFactor={10}>
        <div
          style={{
            transform: 'translateY(-58px)',
            textAlign: 'center',
            userSelect: 'none',
            pointerEvents: 'none',
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
  );
}

function Room({
  onBuddyClick,
  onStationClick,
}: {
  onBuddyClick?: () => void;
  onStationClick: (id: StationId) => void;
}) {
  // Simple room colors (warm, cozy, cartoon-ish)
  const wallColor = '#7a4b2a';
  const floorColor = '#4a2d1a';

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} color={'#ffe7c9'} />
      <directionalLight
        position={[3, 6, 4]}
        intensity={1.1}
        color={'#fff2dc'}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-3, 2.5, 2]} intensity={0.7} color={'#ffb6c9'} />

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

      {/* Sparkles / magic */}
      <Sparkles
        count={60}
        speed={0.25}
        opacity={0.6}
        scale={[10, 6, 10]}
        size={4}
        color={'#fff1a8'}
        position={[0, 1.5, -1]}
      />

      {/* Buddy */}
      <BuddyModel3D onClick={onBuddyClick} />

      {/* Stations (simple 3D props for now) */}
      <Station
        id="feeding"
        label="Eat"
        emoji="🍕"
        position={[-4.5, -1.2, -1.5]}
        color={'#f59e0b'}
        onClick={onStationClick}
      />
      <Station
        id="bedtime"
        label="Sleep"
        emoji="🛏️"
        position={[4.5, -1.2, -1.5]}
        color={'#6366f1'}
        onClick={onStationClick}
      />
      <Station
        id="basketball"
        label="Basketball"
        emoji="🏀"
        position={[0, -1.2, -4.2]}
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

export default function TreehouseInterior3D({ onBack, onBuddyClick }: TreehouseInterior3DProps) {
  const [activeGame, setActiveGame] = useState<StationId | null>(null);
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
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color('#2a0f2b'), 1);
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
      >
        {/* Fixed camera: no orbit controls (Tom-style) */}
        <Room onBuddyClick={onBuddyClick} onStationClick={(id) => setActiveGame(id)} />
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

        {/* Bottom hint */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-white/70 text-xs font-bold drop-shadow-lg">
          Eat • Sleep • Basketball
        </div>
      </div>
    </div>
  );
}

useGLTF.preload('/models/buddy.glb');

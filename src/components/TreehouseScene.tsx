// TreehouseScene.tsx - Main 3D scene with treehouse, Buddy, and forest background
import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  OrbitControls,
  useGLTF,
  useAnimations,
  Html,
  useTexture,
} from '@react-three/drei';
import * as THREE from 'three';

// ============================================================
// BUDDY 3D MODEL - Loads .glb with animation support
// ============================================================
interface BuddyModelProps {
  isTalking?: boolean;
  mood?: 'idle' | 'talking' | 'laughing' | 'waving';
  onClick?: () => void;
}

function BuddyModel({ isTalking = false, mood = 'idle', onClick }: BuddyModelProps) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('/models/buddy.glb');
  const { actions } = useAnimations(animations, group);
  const [hovered, setHovered] = useState(false);

  // Play the appropriate animation based on mood
  useEffect(() => {
    // Stop all current actions
    Object.values(actions).forEach(action => action?.fadeOut(0.3));

    // Find and play the right animation
    const animationName = getAnimationName(mood, actions);
    if (animationName && actions[animationName]) {
      actions[animationName]?.reset().fadeIn(0.3).play();
    }
  }, [mood, actions]);

  // When talking, play talk animation
  useEffect(() => {
    if (isTalking) {
      const talkAnim = getAnimationName('talking', actions);
      if (talkAnim && actions[talkAnim]) {
        actions[talkAnim]?.reset().fadeIn(0.2).play();
      }
    } else {
      const idleAnim = getAnimationName('idle', actions);
      if (idleAnim && actions[idleAnim]) {
        actions[idleAnim]?.reset().fadeIn(0.3).play();
      }
    }
  }, [isTalking, actions]);

  // Gentle idle bob when not doing other animations
  useFrame((state) => {
    if (group.current && mood === 'idle' && !isTalking) {
      group.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
    }
  });

  return (
    <group
      ref={group}
      position={[0, 0.5, 0.8]}
      scale={hovered ? 1.05 : 1}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <primitive object={scene} />
    </group>
  );
}

// Helper to find animation name from available actions
function getAnimationName(mood: string, actions: Record<string, THREE.AnimationAction | null>): string | null {
  const names = Object.keys(actions);

  const searchTerms: Record<string, string[]> = {
    idle: ['idle', 'Idle', 'IDLE', 'breathing', 'stand'],
    talking: ['talk', 'Talk', 'TALK', 'speak', 'mouth', 'chat'],
    laughing: ['laugh', 'Laugh', 'LAUGH', 'happy', 'joy', 'celebrate'],
    waving: ['wave', 'Wave', 'WAVE', 'greet', 'hello', 'hi'],
  };

  const terms = searchTerms[mood] || searchTerms.idle;
  for (const term of terms) {
    const found = names.find(n => n.toLowerCase().includes(term.toLowerCase()));
    if (found) return found;
  }

  // Fallback to first animation
  return names.length > 0 ? names[0] : null;
}

// ============================================================
// TREEHOUSE 3D MODEL
// ============================================================
function TreehouseModel() {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/treehouse.glb');

  // Gentle sway animation
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.02;
    }
  });

  return (
    <group ref={group} position={[0, -1, 0]}>
      <primitive object={scene} />
    </group>
  );
}

// ============================================================
// FOREST BACKGROUND (8K image on a sphere)
// ============================================================
function ForestBackground() {
  const texture = useTexture('/images/forest-bg.jpg');

  // Configure texture for spherical mapping
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace;

  return (
    <mesh scale={[-50, 50, 50]}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

// ============================================================
// SCENE LIGHTING
// ============================================================
function SceneLighting() {
  return (
    <>
      {/* Warm ambient light */}
      <ambientLight intensity={0.4} color="#ffeedd" />

      {/* Main sunlight from above-right */}
      <directionalLight
        position={[5, 8, 3]}
        intensity={1.2}
        color="#fff5e0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Fill light from left */}
      <directionalLight
        position={[-3, 4, -2]}
        intensity={0.4}
        color="#aaccff"
      />

      {/* Rim light from behind */}
      <pointLight position={[0, 5, -5]} intensity={0.6} color="#ffddaa" />

      {/* Ground bounce light */}
      <pointLight position={[0, -2, 2]} intensity={0.2} color="#88cc88" />
    </>
  );
}

// ============================================================
// LOADING FALLBACK
// ============================================================
function LoadingFallback() {
  return (
    <Html center>
      <div className="text-white text-2xl font-bold animate-pulse bg-black/40 backdrop-blur rounded-2xl px-8 py-4">
        Loading Buddy's Treehouse...
      </div>
    </Html>
  );
}

// ============================================================
// CAMERA CONTROLLER - auto positions camera nicely
// ============================================================
function CameraController() {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 2, 6);
    camera.lookAt(0, 0.5, 0);
  }, [camera]);

  return null;
}

// ============================================================
// MAIN TREEHOUSE SCENE EXPORT
// ============================================================
interface TreehouseSceneProps {
  buddyMood?: 'idle' | 'talking' | 'laughing' | 'waving';
  isBuddyTalking?: boolean;
  onBuddyClick?: () => void;
}

export default function TreehouseScene({
  buddyMood = 'idle',
  isBuddyTalking = false,
  onBuddyClick,
}: TreehouseSceneProps) {
  // Track whether models exist (graceful fallback)
  const [modelsAvailable, setModelsAvailable] = useState({ buddy: true, treehouse: true, background: true });

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        shadows
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
        camera={{ fov: 50, near: 0.1, far: 100 }}
      >
        <CameraController />
        <SceneLighting />

        <Suspense fallback={<LoadingFallback />}>
          {/* Forest Background */}
          {modelsAvailable.background && (
            <ForestBackgroundSafe onError={() => setModelsAvailable(s => ({ ...s, background: false }))} />
          )}

          {/* Treehouse */}
          {modelsAvailable.treehouse && (
            <TreehouseModelSafe onError={() => setModelsAvailable(s => ({ ...s, treehouse: false }))} />
          )}

          {/* Buddy */}
          {modelsAvailable.buddy && (
            <BuddyModelSafe
              mood={buddyMood}
              isTalking={isBuddyTalking}
              onClick={onBuddyClick}
              onError={() => setModelsAvailable(s => ({ ...s, buddy: false }))}
            />
          )}
        </Suspense>

        {/* Orbit controls - limited to prevent disorientation */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={3}
          maxDistance={12}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.2}
          autoRotate={false}
          target={[0, 0.5, 0]}
        />
      </Canvas>
    </div>
  );
}

// ============================================================
// ERROR BOUNDARY WRAPPERS - graceful fallback if models missing
// ============================================================
function BuddyModelSafe({ onError, ...props }: BuddyModelProps & { onError: () => void }) {
  try {
    return <BuddyModel {...props} />;
  } catch {
    onError();
    return null;
  }
}

function TreehouseModelSafe({ onError }: { onError: () => void }) {
  try {
    return <TreehouseModel />;
  } catch {
    onError();
    return null;
  }
}

function ForestBackgroundSafe({ onError }: { onError: () => void }) {
  try {
    return <ForestBackground />;
  } catch {
    onError();
    return null;
  }
}

// Preload models
useGLTF.preload('/models/buddy.glb');
useGLTF.preload('/models/treehouse.glb');

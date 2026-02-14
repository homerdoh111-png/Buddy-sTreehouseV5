// TreehouseScene.tsx - Main 3D scene with treehouse, Buddy, and forest background
import { Component, Suspense, useRef, useEffect, useState, type ReactNode } from 'react';
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
// REACT ERROR BOUNDARY - proper class component
// ============================================================
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ModelErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.warn('[TreehouseScene] Model failed to load:', error.message);
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
}

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

  // Clone the scene so it's safe to reuse
  const clonedScene = scene.clone(true);

  // Play the appropriate animation based on mood
  useEffect(() => {
    if (!actions || Object.keys(actions).length === 0) return;

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
    if (!actions || Object.keys(actions).length === 0) return;

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

  // Gentle idle bob
  useFrame((state) => {
    if (group.current && mood === 'idle' && !isTalking) {
      group.current.position.y = 1.5 + Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
    }
  });

  return (
    <group
      ref={group}
      position={[-3.5, 1.5, 3]}
      scale={hovered ? 6.3 : 6.0}
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default'; }}
    >
      <primitive object={clonedScene} />
    </group>
  );
}

// Helper to find animation name from available actions
function getAnimationName(mood: string, actions: Record<string, THREE.AnimationAction | null>): string | null {
  const names = Object.keys(actions);
  if (names.length === 0) return null;

  const searchTerms: Record<string, string[]> = {
    idle: ['idle', 'breathing', 'stand', 'default', 'rest'],
    talking: ['talk', 'speak', 'mouth', 'chat', 'say'],
    laughing: ['laugh', 'happy', 'joy', 'celebrate', 'cheer', 'dance'],
    waving: ['wave', 'greet', 'hello', 'hi', 'gesture'],
  };

  const terms = searchTerms[mood] || searchTerms.idle;
  for (const term of terms) {
    const found = names.find(n => n.toLowerCase().includes(term.toLowerCase()));
    if (found) return found;
  }

  // Fallback to first animation
  return names[0];
}

// ============================================================
// TREEHOUSE 3D MODEL (clickable)
// ============================================================
interface TreehouseModelProps {
  onClick?: () => void;
  isUnlocked?: boolean;
}

function TreehouseModel({ onClick, isUnlocked = false }: TreehouseModelProps) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/treehouse.glb');
  const clonedScene = scene.clone(true);
  const [hovered, setHovered] = useState(false);

  // Gentle sway animation
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.02;
    }
  });

  return (
    <group
      ref={group}
      position={[0, -5, 0]}
      scale={hovered && isUnlocked ? 13.3 : 13}
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); if (isUnlocked) document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default'; }}
    >
      <primitive object={clonedScene} />
    </group>
  );
}

// ============================================================
// FOREST BACKGROUND (image on a large sphere)
// ============================================================
function ForestBackground() {
  const texture = useTexture('/images/forest-bg.jpg');

  useEffect(() => {
    if (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.anisotropy = 16;
      texture.generateMipmaps = true;
      texture.needsUpdate = true;
    }
  }, [texture]);

  return (
    <mesh scale={[-200, 200, 200]}>
      <sphereGeometry args={[1, 256, 256]} />
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
      <ambientLight intensity={0.4} color="#ffeedd" />
      <directionalLight
        position={[5, 8, 3]}
        intensity={1.2}
        color="#fff5e0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={[-3, 4, -2]} intensity={0.4} color="#aaccff" />
      <pointLight position={[0, 5, -5]} intensity={0.6} color="#ffddaa" />
      <pointLight position={[0, -2, 2]} intensity={0.2} color="#88cc88" />
    </>
  );
}

// ============================================================
// LOADING FALLBACK (shown inside Canvas)
// ============================================================
function LoadingFallback() {
  return (
    <Html center>
      <div style={{
        color: 'white',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        background: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(10px)',
        borderRadius: '1rem',
        padding: '1rem 2rem',
        whiteSpace: 'nowrap',
      }}>
        Loading Buddy's Treehouse...
      </div>
    </Html>
  );
}

// ============================================================
// CAMERA CONTROLLER
// ============================================================
function CameraController() {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 5, 22);
    camera.lookAt(0, 1, 0);
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
  onTreehouseClick?: () => void;
  treehouseUnlocked?: boolean;
}

export default function TreehouseScene({
  buddyMood = 'idle',
  isBuddyTalking = false,
  onBuddyClick,
  onTreehouseClick,
  treehouseUnlocked = false,
}: TreehouseSceneProps) {
  const [loadErrors, setLoadErrors] = useState<string[]>([]);

  const handleModelError = (name: string) => (error: Error) => {
    console.warn(`[TreehouseScene] ${name} failed:`, error.message);
    setLoadErrors(prev => [...prev, name]);
  };

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        shadows
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          failIfMajorPerformanceCaveat: false,
        }}
        dpr={[1, 2]}
        camera={{ fov: 60, near: 0.1, far: 500 }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.0;
        }}
      >
        <CameraController />
        <SceneLighting />

        <Suspense fallback={<LoadingFallback />}>
          {/* Forest Background */}
          <ModelErrorBoundary onError={handleModelError('background')}>
            <ForestBackground />
          </ModelErrorBoundary>

          {/* Treehouse */}
          <ModelErrorBoundary onError={handleModelError('treehouse')}>
            <TreehouseModel onClick={onTreehouseClick} isUnlocked={treehouseUnlocked} />
          </ModelErrorBoundary>

          {/* Buddy */}
          <ModelErrorBoundary onError={handleModelError('buddy')}>
            <BuddyModel
              mood={buddyMood}
              isTalking={isBuddyTalking}
              onClick={onBuddyClick}
            />
          </ModelErrorBoundary>
        </Suspense>

        {/* Orbit controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={10}
          maxDistance={40}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.2}
          autoRotate={false}
          target={[0, 1, 0] as unknown as THREE.Vector3}
        />
      </Canvas>

      {/* Show load errors as overlay */}
      {loadErrors.length > 0 && (
        <div style={{
          position: 'absolute',
          bottom: '1rem',
          left: '1rem',
          background: 'rgba(220,50,50,0.8)',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          zIndex: 20,
        }}>
          Failed to load: {loadErrors.join(', ')}. Check that model files exist in /public/models/
        </div>
      )}
    </div>
  );
}

// Preload hints (non-blocking)
try { useGLTF.preload('/models/buddy.glb'); } catch { /* ignore if preload fails */ }
try { useGLTF.preload('/models/treehouse.glb'); } catch { /* ignore if preload fails */ }

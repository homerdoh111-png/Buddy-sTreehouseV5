import * as THREE from 'three';

/**
 * Compute a uniform scale so `object` fits a target height in world units.
 * Uses a Box3 over the rendered object (post-skinning). Best used on a cloned scene.
 */
export function computeFitScale(object: THREE.Object3D, targetHeight: number) {
  const box = new THREE.Box3().setFromObject(object);
  const size = new THREE.Vector3();
  box.getSize(size);
  const h = size.y || 1;
  return targetHeight / h;
}

/**
 * Compute Y offset needed to lift the model so its lowest point sits at y=0.
 * Note: offset is in object units BEFORE scaling.
 */
export function computeGroundOffsetY(object: THREE.Object3D) {
  const box = new THREE.Box3().setFromObject(object);
  return -box.min.y;
}

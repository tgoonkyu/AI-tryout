# 3D Models for Coin Flip Application

This directory contains 3D models and textures for the coin flip animation.

## Required 3D Assets

### 1. Coin 3D Model
- **Format:** GLTF (.gltf or .glb) - preferred for Three.js
- **Alternative Formats:** OBJ, FBX
- **Specifications:**
  - Two-sided model (Heads and Tails faces)
  - Reasonable polygon count (< 10,000 triangles)
  - UV-mapped for textures
  - Centered at origin

### 2. Coin Textures
- **Format:** PNG or JPEG
- **Required Maps:**
  - Diffuse/Albedo map (color)
  - Normal map (optional, for depth)
  - Metalness map (optional, for shine)
  - Roughness map (optional)
- **Resolution:** 512x512 or 1024x1024 pixels

## Recommended Sources

### Free 3D Model Repositories
- [Sketchfab](https://sketchfab.com/) - Filter by "Downloadable" and "CC" licenses
- [Poly Haven](https://polyhaven.com/) - CC0 licensed
- [TurboSquid Free](https://www.turbosquid.com/Search/3D-Models/free/coin)
- [CGTrader Free](https://www.cgtrader.com/free-3d-models/coin)
- [Free3D](https://free3d.com/)

### Create Your Own
- **Blender** (free): Model a simple cylinder, add details
- **Tinkercad** (web-based): Simple 3D modeling tool
- **Three.js Primitives**: Use CylinderGeometry and add textures

## Simple Coin Model Option

If no suitable model is found, use Three.js built-in geometry:

```javascript
// Create coin using CylinderGeometry
const coinGeometry = new THREE.CylinderGeometry(
  1,      // radiusTop
  1,      // radiusBottom
  0.1,    // height (thin)
  32      // radialSegments (smooth edges)
);
```

Then apply textures for heads and tails sides.

## Coin Design Ideas

### Classic Coin
- **Heads:** Portrait or emblem
- **Tails:** National symbol or denomination

### Simple Design
- **Heads:** Text "HEADS" with simple border
- **Tails:** Text "TAILS" with simple border

### Modern/Abstract
- **Heads:** Geometric pattern, color scheme 1
- **Tails:** Different geometric pattern, color scheme 2

## Texture Creation Tools

- **Photoshop/GIMP:** Edit existing coin images
- **Figma/Canva:** Design custom coin faces
- **Substance Painter:** Advanced PBR texture creation
- **Quixel Mixer:** Free material creation tool

## Licensing

All 3D assets must be:
- Royalty-free
- Free for commercial use
- CC0, CC-BY, or similar permissive license

## Attribution

Once 3D models are added, document their sources here:

### coin-model.glb
- **Source:** [To be added]
- **Author:** [To be added]
- **License:** [To be added]
- **Link:** [To be added]
- **Modifications:** [If any]

## File Structure

```
3d-models/
├── coin-model.glb           # Main 3D model
├── textures/
│   ├── heads-diffuse.png    # Heads side texture
│   ├── tails-diffuse.png    # Tails side texture
│   ├── coin-normal.png      # Normal map (optional)
│   └── coin-metalness.png   # Metallic map (optional)
└── README.md                # This file
```

## Usage in Application

Models will be loaded using Three.js GLTFLoader:

```typescript
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const loader = new GLTFLoader();
loader.load('/models/coin-model.glb', (gltf) => {
  const coin = gltf.scene;
  scene.add(coin);
});
```

---

**Status:** ✅ Not Required - CSS3 Animation with Custom SVG Coins  
**Priority:** N/A for MVP (using 2D SVG approach instead)  
**Last Updated:** November 5, 2025 (Synced v1.0.1)

## Integration Plan (Post-MVP)
1. Select lightweight CC0 coin model (≤10k triangles) or author in Blender.
2. Bake metallic/roughness into single PBR texture set to minimize texture fetches.
3. Compress GLB with `gltf-pipeline` (draco compression) for network efficiency.
4. Implement lazy loading (IntersectionObserver or user action) to avoid blocking initial render.
5. Add environment map (HDRI) for realistic metal shading (Poly Haven CC0). Optional for first pass.

## Optimization Guidelines
| Aspect | Recommendation | Target |
|--------|---------------|--------|
| Polygon Count | Keep under threshold for smooth mobile performance | < 10k tris |
| Texture Resolution | Balance fidelity vs memory | 512–1024 px |
| File Size (GLB) | After compression | < 300 KB |
| Draw Calls | Single mesh preferred | 1–2 |
| Material | Use StandardMeshMaterial | Single PBR |

## Fallback Strategy
If model loading fails or is deferred, continue using `THREE.CylinderGeometry` with two materials (heads/tails). Swap to model only when successfully loaded; maintain result-dependent final orientation logic.

## Loading Sketch (Deferred Implementation)
```typescript
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export function loadCoinModel(path: string, onReady: (coin: THREE.Object3D) => void, onError?: () => void) {
  const loader = new GLTFLoader();
  loader.load(path, (gltf) => {
    const coin = gltf.scene;
    coin.traverse(obj => { if ((obj as any).isMesh) obj.frustumCulled = true; });
    onReady(coin);
  }, undefined, () => { onError?.(); });
}
```

## Attribution Placeholder (To Fill When Added)
```
Model: "<Model Name>" by <Author> from <Source URL> — License: <License>
Modifications: scale, texture compression, material adjustments.
```

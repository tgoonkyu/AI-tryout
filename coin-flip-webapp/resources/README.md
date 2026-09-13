# Resources Directory# Resources Directory



This directory serves as the **single source of truth** for all project assets (images, sounds, 3D models).This directory contains all external assets used in the Coin Flip Application.



## 📁 Directory Structure## Directory Structure



``````

resources/resources/

├── images/              # SVG and image assets├── sounds/          # Audio files for sound effects

│   ├── coin-heads.svg  # Gold coin face (profile design)├── images/          # Images, icons, and static graphics

│   └── coin-tails.svg  # Silver coin face (graffiti design)├── 3d-models/       # 3D models and textures for coin animation

├── sounds/              # Audio effect files└── README.md        # This file

│   ├── flip-start.mp3  # Played when flip button is clicked```

│   ├── coin-rattle.mp3 # Played during coin animation

│   └── flip-result.mp3 # Played when result is revealed## Asset Categories

└── 3d-models/           # Future 3D assets (ThreeJS models)

```### 🔊 Sounds

Location: `resources/sounds/`

## 🔄 Resource Sync System

Required audio files:

### Automatic Sync- `flip-start.mp3` - Button click sound

Resources are automatically copied to `frontend/public/` before development and builds:- `coin-rattle.mp3` - Animation sound (3-5 seconds)

- `flip-result.mp3` - Result announcement sound

```bash

cd frontend**Status:** ✅ Sounds curated and ready for integration (implementation pending)

npm run dev     # Auto-syncs resources before starting dev server

npm run build   # Auto-syncs resources before building production bundleSee [sounds/README.md](./sounds/README.md) for detailed requirements and sources.

```

---

### Manual Sync

If you need to manually sync resources:### 🖼️ Images

Location: `resources/images/`

```bash

cd frontendPotential image assets:

npm run sync-resources- App logo

```- Favicon variations

- Coin face designs (if not using 3D textures)

### How It Works- UI icons (if not using Material-UI icons)

1. **Source**: All assets stored in `resources/` subdirectories- Background patterns (optional)

2. **Sync Script**: `frontend/scripts/sync-resources.js` (Node.js, cross-platform)- Loading screen graphics

3. **Trigger**: `predev` and `prebuild` hooks in `frontend/package.json`

4. **Destination**: `frontend/public/` (auto-generated, gitignored)**Status:** 🟡 Optional - will be added as needed



## ➕ Adding New Resources---



### Step-by-Step Process### 🎨 3D Models

Location: `resources/3d-models/`

1. **Add the file** to the appropriate subdirectory:

   - Images → `resources/images/`Required 3D assets:

   - Sounds → `resources/sounds/`- Coin 3D model (GLTF format)

   - 3D Models → `resources/3d-models/`- Coin textures (heads and tails)

- Optional: Normal maps, metalness maps

2. **Update sync script** (if needed):

   - Open `frontend/scripts/sync-resources.js`**Status:** 🟡 Deferred – using procedural cylinder geometry for MVP (model optional)

   - Add new file patterns to copy logic

   - Test with `npm run sync-resources`See [3d-models/README.md](./3d-models/README.md) for detailed requirements and sources.



3. **Run sync** (automatic on next dev/build, or manual):---

   ```bash

   cd frontend## Asset Pipeline

   npm run sync-resources

   ```### Development

1. Place source files in appropriate subdirectories

4. **Commit to git**:2. During frontend build, assets are copied to `frontend/src/assets/`

   - ✅ **DO** commit files in `resources/`3. Import assets using relative paths in React components

   - ❌ **DON'T** commit auto-synced files in `frontend/public/`

### Production

### Example: Adding a New Sound- Assets are bundled and optimized by Vite

- Images are compressed and converted to WebP (if configured)

```bash- Audio files are compressed if needed

# 1. Add file to resources- 3D models are loaded dynamically to reduce initial bundle size

cp my-new-sound.mp3 resources/sounds/

## Licensing Requirements

# 2. Update sync script (if needed)

# Edit frontend/scripts/sync-resources.js:All assets must be:

# Add 'my-new-sound.mp3' to soundFiles array- ✅ Royalty-free

- ✅ Free for commercial use (even for learning projects)

# 3. Run sync- ✅ Properly attributed (if required by license)

cd frontend

npm run sync-resources**Acceptable Licenses:**

- CC0 (Public Domain)

# 4. Verify- CC-BY (Attribution required)

ls frontend/public/sounds/my-new-sound.mp3- MIT License

- Apache 2.0

# 5. Commit only the source- Custom royalty-free licenses

git add resources/sounds/my-new-sound.mp3

git add frontend/scripts/sync-resources.js**Document all attributions in respective README files.**

git commit -m "feat: add new sound effect"

```---



## 🎨 Asset Specifications## Recommended Asset Sources



### Images (SVG)### Sound Effects

- **Format**: SVG (vector graphics)- [Freesound.org](https://freesound.org/) - Community sound library

- **Size**: Scalable (currently rendered at 120-150px)- [Zapsplat.com](https://www.zapsplat.com/) - Free with attribution

- **Colors**: - [Mixkit.co](https://mixkit.co/free-sound-effects/) - Royalty-free

  - Heads: Gold (#FFD700)- [Pixabay Audio](https://pixabay.com/sound-effects/) - CC0 sounds

  - Tails: Silver (#C0C0C0)- [BBC Sound Effects](https://sound-effects.bbcrewind.co.uk/) - Personal use

- **Design**: High contrast, clear silhouettes

### 3D Models

### Sounds (MP3)- [Sketchfab](https://sketchfab.com/) - Downloadable 3D models

- **Format**: MP3 (recommended) or OGG- [Poly Haven](https://polyhaven.com/) - CC0 assets

- **Duration**: - [TurboSquid Free](https://www.turbosquid.com/Search/3D-Models/free/)

  - flip-start: 0.5-1s- [CGTrader Free](https://www.cgtrader.com/free-3d-models/)

  - coin-rattle: 3-5s (loops during animation)

  - flip-result: 1-2s### Images & Icons

- **Quality**: 128-192 kbps- [Unsplash](https://unsplash.com/) - Free photos

- **Volume**: Normalized, consistent levels- [Pexels](https://www.pexels.com/) - Free stock photos

- [Flaticon](https://www.flaticon.com/) - Free icons (attribution)

### 3D Models (Future)- [Material Icons](https://fonts.google.com/icons) - Google's icon set (built into MUI)

- **Format**: GLTF/GLB (ThreeJS compatible)

- **Poly Count**: < 10k triangles (performance)### Textures

- **Textures**: Embedded or referenced- [Poly Haven](https://polyhaven.com/textures) - PBR textures

- **Animations**: Baked into model- [CC0 Textures](https://cc0textures.com/) - Free PBR textures

- [TextureHaven](https://texturehaven.com/) - High-quality textures

## 🚫 .gitignore Configuration

---

The following files are **gitignored** (auto-synced, not source):

## Asset Optimization

```gitignore

# In frontend/.gitignore### Audio

frontend/public/coin-*.svg- **Format:** MP3 (browser compatible)

frontend/public/sounds/- **Bitrate:** 128 kbps (balance quality/size)

```- **Max size:** 500 KB per file

- **Tool:** Audacity (free audio editor)

The following files are **tracked** (source of truth):

### Images

```- **Format:** PNG (transparency), JPG (photos), WebP (modern)

resources/images/- **Max dimensions:** 2048x2048 (most assets much smaller)

resources/sounds/- **Compression:** Use TinyPNG, Squoosh, or ImageOptim

resources/3d-models/- **Tool:** GIMP, Photoshop, or online compressors

frontend/scripts/sync-resources.js

```### 3D Models

- **Format:** GLTF/GLB (compressed)

## ✅ Benefits of This Approach- **Polygon count:** < 10,000 triangles

- **Texture resolution:** 512x512 or 1024x1024

1. **Single Source of Truth**: No duplicate files, no version conflicts- **Tool:** Blender with GLTF exporter

2. **Easy Updates**: Change once in `resources/`, auto-syncs everywhere

3. **Clean Git History**: Only source assets tracked, not generated files---

4. **Cross-Platform**: Node.js script works on Windows, macOS, Linux

5. **Simple Onboarding**: New developers run `npm run dev`, resources sync automatically## Quick Start: Finding Assets

6. **Environment Separation**: Clear distinction between source and runtime assets

### Priority 1: Sound Effects (Required for MVP)

## 📝 Related Documentation1. Visit Freesound.org

2. Search for:

- **Main README**: [../README.md](../README.md) - Project overview   - "coin toss" or "coin flip"

- **Copilot Instructions**: [../.github/copilot-instructions.md](../.github/copilot-instructions.md) - Development guidelines   - "button click" or "ui click"

- **Sounds Guide**: [sounds/README.md](sounds/README.md) - Sound file requirements   - "coin drop" or "success chime"

- **3D Models Guide**: [3d-models/README.md](3d-models/README.md) - 3D asset specifications3. Download CC0 or CC-BY licensed files

4. Place in `resources/sounds/`

## 🔧 Troubleshooting5. Document attribution in sounds/README.md



### Resources not syncing?### Priority 2: 3D Coin Model (Optional - can use primitives)

```bash1. Option A: Use Three.js CylinderGeometry (no file needed)

# Check if sync script exists2. Option B: Download from Sketchfab

ls frontend/scripts/sync-resources.js   - Search "coin" with "Downloadable" filter

   - Select CC0 or CC-BY license

# Run manual sync with verbose output   - Download GLTF format

cd frontend3. Place in `resources/3d-models/`

node scripts/sync-resources.js4. Document attribution



# Verify paths### Priority 3: Images (As needed)

echo $PWD  # Should be in frontend/ directory- Create app logo using Figma/Canva

```- Use Material-UI icons (no additional files needed)

- Add custom graphics only if required

### Files missing in public/?

```bash---

# Check source files exist

ls resources/images/## Integration with Frontend

ls resources/sounds/

Assets from this directory should be copied to `frontend/src/assets/` during setup:

# Check .gitignore isn't blocking

cat frontend/.gitignore | grep public```bash

# Windows PowerShell

# Force syncCopy-Item -Path "resources\sounds\*" -Destination "frontend\src\assets\sounds\" -Recurse

cd frontendCopy-Item -Path "resources\3d-models\*" -Destination "frontend\public\models\" -Recurse

npm run sync-resources```

```

Then import in React:

### New files not copying?

1. Verify file is in correct `resources/` subdirectory```typescript

2. Check sync script includes the new file pattern// Audio

3. Restart dev server to trigger `predev` hookimport flipSound from '@/assets/sounds/flip-start.mp3';



---// 3D Models (loaded dynamically)

const loader = new GLTFLoader();

**Last Updated**: November 5, 2025  loader.load('/models/coin-model.glb', callback);

**Version**: 1.0.1 (MVP Complete - All Assets Integrated)```


---

## Asset Checklist (v1.0.1)

### MVP Requirements
- [x] flip-start.mp3 ✅ Integrated with HTML5 Audio API
- [x] coin-rattle.mp3 ✅ Looping playback during animation
- [x] flip-result.mp3 ✅ Result announcement sound
- [x] coin-heads.svg ✅ Custom gold coin face (FFD700)
- [x] coin-tails.svg ✅ Custom silver coin face (C0C0C0)

### Post-MVP
- [ ] Custom app logo
- [ ] High-quality coin textures
- [ ] Additional sound effects
- [ ] Background images/patterns
- [ ] Marketing materials

---

**Status:** ✅ MVP Complete - All Resources Integrated  
**Last Updated:** November 5, 2025 (Synced v1.0.1)  
**Achievement:** CSS3 animation system with custom SVG coins and full audio integration

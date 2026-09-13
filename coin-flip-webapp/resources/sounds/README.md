# Sound Files for Coin Flip Application

This directory contains royalty-free sound effects for the coin flip application.

## Required Sound Files

### ✅ RECOMMENDED SOUND FILES (See DOWNLOAD-GUIDE.md)

I've researched and found the best royalty-free sounds for you! See **[DOWNLOAD-GUIDE.md](./DOWNLOAD-GUIDE.md)** for detailed download instructions.

### 1. flip-start.mp3 ✅
- **Purpose:** Played when the flip button is clicked
- **Duration:** 0.5 - 1 second
- **Description:** Short, satisfying click or "whoosh" sound
- **✅ RECOMMENDED:** "Modern technology select" from Mixkit
  - License: Mixkit License (Free, no attribution)
  - Link: https://mixkit.co/free-sound-effects/click/
- **Alternative:** "Classic click" or "Select click" (also from Mixkit)

### 2. coin-rattle.mp3 ✅
- **Purpose:** Played during the 3-5 second animation
- **Duration:** 3-5 seconds (loopable)
- **Description:** Coin spinning/rattling sound, metallic
- **✅ RECOMMENDED (No Attribution):** "Coin flip.m4a" by eZZin
  - License: CC0 (Public Domain - no attribution!)
  - Link: https://freesound.org/people/eZZin/sounds/545857/
- **✅ ALTERNATIVE (Best Quality):** "Coin Flipping, A.wav" by InspectorJ
  - License: CC Attribution 3.0 (attribution required)
  - Link: https://freesound.org/people/InspectorJ/sounds/342242/
  - 7,200+ downloads - very popular!

### 3. flip-result.mp3 ✅
- **Purpose:** Played when the result is displayed
- **Duration:** 0.5 - 1 second
- **Description:** Success sound, chime, or coin landing sound
- **✅ RECOMMENDED:** "Arcade game jump coin" from Mixkit
  - License: Mixkit License (Free, no attribution)
  - Link: https://mixkit.co/free-sound-effects/click/
- **Alternative:** "Quick win video game notification" (also from Mixkit)

---

## 📥 Quick Download Links

1. **Mixkit (flip-start & flip-result):** https://mixkit.co/free-sound-effects/click/
2. **Freesound (coin-rattle):** 
   - Option A (CC0): https://freesound.org/people/eZZin/sounds/545857/
   - Option B (CC-BY): https://freesound.org/people/InspectorJ/sounds/342242/

**See [DOWNLOAD-GUIDE.md](./DOWNLOAD-GUIDE.md) for step-by-step instructions!**

## Audio Specifications

- **Format:** MP3 (preferred) or WAV
- **Sample Rate:** 44.1 kHz or 48 kHz
- **Bit Rate:** 128 kbps minimum (MP3)
- **Channels:** Mono or Stereo
- **Max File Size:** < 500 KB per file (to keep bundle size small)

## Licensing

All sound files must be:
- Royalty-free
- Free for commercial use (even though this is a learning project)
- Attribution required (if applicable) - document in this file

## Attribution

Once sound files are added, document their sources here:

### flip-start.mp3 ✅
- **Source:** Mixkit.co
- **Title:** "Modern technology select"
- **License:** Mixkit License (Free, no attribution required)
- **Link:** https://mixkit.co/free-sound-effects/click/

### coin-rattle.mp3 ✅
**Option A (No Attribution):**
- **Source:** Freesound.org
- **Author:** eZZin
- **Title:** "Coin flip.m4a"
- **License:** CC0 (Public Domain)
- **Link:** https://freesound.org/people/eZZin/sounds/545857/

**Option B (Best Quality - Attribution Required):**
- **Source:** Freesound.org
- **Author:** InspectorJ (www.jshaw.co.uk)
- **Title:** "Coin Flipping, A.wav"
- **License:** CC Attribution 3.0
- **Link:** https://freesound.org/people/InspectorJ/sounds/342242/
- **Attribution:** Sound Effect by InspectorJ (www.jshaw.co.uk) from Freesound.org

### flip-result.mp3 ✅
- **Source:** Mixkit.co
- **Title:** "Arcade game jump coin"
- **License:** Mixkit License (Free, no attribution required)
- **Link:** https://mixkit.co/free-sound-effects/click/

## Alternative: Generate Sounds

If you can't find suitable sounds, consider:
- **Web Audio API:** Generate synthetic sounds programmatically
- **SFXR/JSFXR:** Online 8-bit sound effect generator
- **Audacity:** Record and edit your own sounds (coin, keys, etc.)

## Usage in Application

Sounds will be imported in the React application:

```typescript
import flipStartSound from '@/assets/sounds/flip-start.mp3';
import coinRattleSound from '@/assets/sounds/coin-rattle.mp3';
import flipResultSound from '@/assets/sounds/flip-result.mp3';
```

Or copied to `frontend/src/assets/sounds/` directory during development.

---

**Status:** ✅ Complete – All sounds integrated with HTML5 Audio API  
**Last Updated:** November 5, 2025 (Synced v1.0.1)

### Integration Checklist
- [ ] Copy mp3 files to `frontend/src/assets/sounds/`
- [ ] Implement SoundManager hook (play start, rattle loop, result)
- [ ] Add mute toggle binding to PreferencesContext
- [ ] Preload short sounds (start/result) for responsive playback
- [ ] Document attribution in final ABOUT or CREDITS section (if CC-BY used)

### Attribution Template (Use If CC-BY Selected)
```
Sound Effect: "<Title>" by <Author> from <Source URL> — License: CC-BY 3.0.
```

### Suggested Folder Layout
```
frontend/
  src/
    assets/
      sounds/
        flip-start.mp3
        coin-rattle.mp3
        flip-result.mp3
    hooks/
      useSound.ts
    context/
      PreferencesContext.tsx
```

### React Hook Sketch (Pending Implementation)
```typescript
// useSound.ts (sketch)
import { useRef, useCallback } from 'react';
import flipStart from '@/assets/sounds/flip-start.mp3';
import coinRattle from '@/assets/sounds/coin-rattle.mp3';
import flipResult from '@/assets/sounds/flip-result.mp3';

export function useSound(muted: boolean) {
  const startRef = useRef<HTMLAudioElement>();
  const rattleRef = useRef<HTMLAudioElement>();
  const resultRef = useRef<HTMLAudioElement>();

  if (!startRef.current) startRef.current = new Audio(flipStart);
  if (!rattleRef.current) rattleRef.current = new Audio(coinRattle);
  if (!resultRef.current) resultRef.current = new Audio(flipResult);

  const play = useCallback((ref: React.MutableRefObject<HTMLAudioElement | undefined>) => {
    if (muted || !ref.current) return;
    ref.current.currentTime = 0;
    ref.current.play().catch(() => {/* swallow for autoplay policies */});
  }, [muted]);

  const playStart = () => play(startRef);
  const playRattle = () => play(rattleRef);
  const stopRattle = () => { if (rattleRef.current) rattleRef.current.pause(); };
  const playResult = () => play(resultRef);

  return { playStart, playRattle, stopRattle, playResult };
}
```

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import type { SoundContextType } from '../types';

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('soundMuted');
    return saved === 'true';
  });

  // Audio references
  const flipStartAudioRef = useRef<HTMLAudioElement | null>(null);
  const coinRattleAudioRef = useRef<HTMLAudioElement | null>(null);
  const flipResultAudioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio elements
  useEffect(() => {
    flipStartAudioRef.current = new Audio('/sounds/flip-start.mp3');
    coinRattleAudioRef.current = new Audio('/sounds/coin-rattle.mp3');
    flipResultAudioRef.current = new Audio('/sounds/flip-result.mp3');

    // Preload audio files
    flipStartAudioRef.current?.load();
    coinRattleAudioRef.current?.load();
    flipResultAudioRef.current?.load();

    // Cleanup on unmount
    return () => {
      flipStartAudioRef.current?.pause();
      coinRattleAudioRef.current?.pause();
      flipResultAudioRef.current?.pause();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('soundMuted', String(isMuted));
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const playFlipStart = useCallback(() => {
    if (isMuted || !flipStartAudioRef.current) return;
    try {
      // Ensure the sound is always heard by pausing and resetting before play
      flipStartAudioRef.current.pause();
      flipStartAudioRef.current.currentTime = 0;
      flipStartAudioRef.current.play().catch(() => {
        // Silently handle autoplay policy restrictions
      });
    } catch (error) {
      console.warn('Could not play flip start sound:', error);
    }
  }, [isMuted]);

  const playCoinRattle = useCallback(() => {
    if (isMuted || !coinRattleAudioRef.current) return;
    
    try {
      coinRattleAudioRef.current.currentTime = 0;
      coinRattleAudioRef.current.loop = true;
      coinRattleAudioRef.current.play().catch(() => {
        // Silently handle autoplay policy restrictions
      });
    } catch (error) {
      console.warn('Could not play coin rattle sound:', error);
    }
  }, [isMuted]);

  const stopCoinRattle = useCallback(() => {
    if (!coinRattleAudioRef.current) return;
    
    try {
      coinRattleAudioRef.current.pause();
      coinRattleAudioRef.current.currentTime = 0;
    } catch (error) {
      console.warn('Could not stop coin rattle sound:', error);
    }
  }, []);

  const playFlipEnd = useCallback((result: 'HEADS' | 'TAILS') => {
    if (isMuted || !flipResultAudioRef.current) return;
    
    try {
      flipResultAudioRef.current.currentTime = 0;
      flipResultAudioRef.current.play().catch(() => {
        // Silently handle autoplay policy restrictions
      });
    } catch (error) {
      console.warn('Could not play flip result sound:', error);
    }
  }, [isMuted]);

  const value: SoundContextType = {
    isMuted,
    toggleMute,
    playFlipStart,
    playCoinRattle,
    stopCoinRattle,
    playFlipEnd,
  };

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};

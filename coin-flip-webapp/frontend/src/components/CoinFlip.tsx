import { useState, useEffect } from 'react';
import { Box, Button, Typography, Card, CardContent, Switch, FormControlLabel } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useSound } from '../context/SoundContext';

const CoinFlip = () => {
  const { isAuthenticated } = useAuth();
  const { playFlipStart, playCoinRattle, stopCoinRattle, playFlipEnd } = useSound();
  const [result, setResult] = useState<'HEADS' | 'TAILS' | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [hasFlipped, setHasFlipped] = useState(false);
  const [skipAnimation, setSkipAnimation] = useState(false);
  const [resultAnimationSkipped, setResultAnimationSkipped] = useState(false);
  const [flippingFace, setFlippingFace] = useState<'HEADS' | 'TAILS'>('HEADS');
  const [idleFace, setIdleFace] = useState<'HEADS' | 'TAILS'>('HEADS');
  const [sessionId, setSessionId] = useState(() => {
    const existing = localStorage.getItem('sessionId');
    if (existing) return existing;
    return generateSessionId();
  });

  function generateSessionId() {
    const id = `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('sessionId', id);
    return id;
  }

  // Alternate coin face during flipping
  useEffect(() => {
    if (isFlipping) {
      const interval = setInterval(() => {
        setFlippingFace(prev => prev === 'HEADS' ? 'TAILS' : 'HEADS');
      }, 250); // Change face every 250ms (half of 0.5s animation)
      
      return () => clearInterval(interval);
    }
  }, [isFlipping]);

  // Alternate coin face during idle animation (synchronized with CSS rotation)
  useEffect(() => {
    if (!hasFlipped && !isFlipping && !result) {
      // CSS animation: 0deg(0s) -> 90deg(0.75s) -> 180deg(1.5s) -> 270deg(2.25s) -> 360deg(3s)
      // Coin is edge-on at 90deg and 270deg - switch exactly at these moments
      
      // Start switching at 0.75s (first edge-on at 90deg)
      const initialDelay = window.setTimeout(() => {
        setIdleFace('TAILS');
        
        // Then switch every 1.5s (at 270deg, then 90deg, etc.)
        const interval = setInterval(() => {
          setIdleFace(prev => prev === 'HEADS' ? 'TAILS' : 'HEADS');
        }, 1500);
        
        // Store interval ID to clear it later
        (window as any)._idleInterval = interval;
      }, 750);
      
      return () => {
        clearTimeout(initialDelay);
        if ((window as any)._idleInterval) {
          clearInterval((window as any)._idleInterval);
          delete (window as any)._idleInterval;
        }
      };
    } else {
      // Reset to HEADS when leaving idle state
      setIdleFace('HEADS');
    }
  }, [hasFlipped, isFlipping, result]);

  // Regenerate sessionId if it was cleared (e.g., after logout)
  useEffect(() => {
    if (!isAuthenticated) {
      const existing = localStorage.getItem('sessionId');
      if (!existing) {
        const newId = generateSessionId();
        setSessionId(newId);
      }
    }
  }, [isAuthenticated]);

  const handleFlip = async () => {
    // Play flip start sound
    playFlipStart();
    
    setResult(null); // Clear previous result
    setHasFlipped(true); // Mark that first flip has occurred
    setResultAnimationSkipped(skipAnimation); // Capture current skip state for this flip
    setIsFlipping(true);
    
    // Play coin rattle sound during animation
    playCoinRattle();

    try {
      const requestBody = isAuthenticated ? {} : { sessionId };
      const response = await axios.post('/api/flip', requestBody);
      
      const animationDuration = skipAnimation ? 0 : 1000;
      setTimeout(() => {
        setResult(response.data.result);
        setIsFlipping(false);
        // Stop rattle sound and play result sound
        stopCoinRattle();
        playFlipEnd(response.data.result);
      }, animationDuration);
    } catch (error) {
      console.error('Flip error:', error);
      setIsFlipping(false);
      stopCoinRattle(); // Stop rattle sound on error
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: 4,
      }}
    >
      <Card 
        sx={{ 
          minWidth: { xs: 280, sm: 350 },
          maxWidth: 450,
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          borderRadius: 4,
          background: (theme) => theme.palette.mode === 'dark' 
            ? 'linear-gradient(145deg, rgba(30,30,30,0.95) 0%, rgba(40,40,40,0.98) 100%)'
            : 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.95) 100%)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <CardContent sx={{ p: { xs: 5, sm: 6 }, py: { xs: 6, sm: 8 } }}>
          {/* Coin Animation */}
          <Box
            sx={{
              width: { xs: '120px', sm: '150px' },
              height: { xs: '120px', sm: '150px' },
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
            }}
          >
            <Box
              component="img"
              src={
                isFlipping 
                  ? flippingFace === 'HEADS' ? '/coin-heads.svg' : '/coin-tails.svg'
                  : result === 'HEADS' 
                  ? '/coin-heads.svg' 
                  : result === 'TAILS' 
                  ? '/coin-tails.svg' 
                  : idleFace === 'HEADS' ? '/coin-heads.svg' : '/coin-tails.svg'
              }
              alt={result || 'Coin'}
              sx={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                animation: !hasFlipped && !isFlipping && !result
                  ? 'idleRotate 3s linear infinite'
                  : isFlipping 
                  ? 'flipCoin 0.5s linear infinite'
                  : result
                  ? `showResult ${resultAnimationSkipped ? '0.1s' : '1s'} cubic-bezier(0.34, 1.56, 0.64, 1) forwards`
                  : 'none',
                '@keyframes idleRotate': {
                  '0%': { transform: 'rotateY(0deg)' },
                  '50%': { transform: 'rotateY(180deg)' },
                  '100%': { transform: 'rotateY(360deg)' },
                },
                '@keyframes flipCoin': {
                  '0%': { transform: 'rotateX(0deg) rotateY(0deg)' },
                  '25%': { transform: 'rotateX(90deg) rotateY(180deg)' },
                  '50%': { transform: 'rotateX(180deg) rotateY(360deg)' },
                  '75%': { transform: 'rotateX(270deg) rotateY(540deg)' },
                  '100%': { transform: 'rotateX(360deg) rotateY(720deg)' },
                },
                '@keyframes showResult': {
                  '0%': { transform: 'rotateX(360deg) rotateY(360deg) scale(0.7)', opacity: 0.5 },
                  '50%': { transform: 'rotateX(0deg) rotateY(0deg) scale(1.25)', opacity: 1 },
                  '75%': { transform: 'rotateX(0deg) rotateY(0deg) scale(0.95)' },
                  '100%': { transform: 'rotateX(0deg) rotateY(0deg) scale(1)', opacity: 1 },
                },
              }}
            />
          </Box>
          
          {result && !isFlipping && (
            <Box
              sx={{
                animation: 'fadeInScale 0.5s ease-out',
                '@keyframes fadeInScale': {
                  '0%': { opacity: 0, transform: 'scale(0.8)' },
                  '100%': { opacity: 1, transform: 'scale(1)' },
                },
              }}
            >
              <Typography 
                variant="h3" 
                sx={{
                  fontFamily: '"Bangers", cursive',
                  fontSize: { xs: '2.5rem', sm: '3rem' },
                  background: result === 'HEADS' 
                    ? 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
                    : 'linear-gradient(45deg, #9C27B0 30%, #E91E63 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 4,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                {result}
              </Typography>
            </Box>
          )}
          
          <Button
            variant="contained"
            size="large"
            onClick={handleFlip}
            disabled={isFlipping}
            sx={{ 
              mt: 3, 
              mb: 4,
              py: { xs: 2, sm: 2.5 },
              px: { xs: 6, sm: 8 },
              fontSize: { xs: '1.2rem', sm: '1.3rem' },
              fontFamily: '"Fredoka", sans-serif',
              fontWeight: 700,
              borderRadius: 3,
              textTransform: 'none',
              boxShadow: '0 4px 16px rgba(25, 118, 210, 0.4)',
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              width: '100%',
              maxWidth: '300px',
              display: 'block',
              mx: 'auto',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(25, 118, 210, 0.6)',
                transform: 'translateY(-2px)',
              },
              '&:active': {
                transform: 'translateY(0)',
              },
              transition: 'all 0.3s ease',
              '&:disabled': {
                background: 'rgba(0, 0, 0, 0.12)',
                animation: isFlipping ? 'pulse 1s ease-in-out infinite' : 'none',
              },
              '@keyframes pulse': {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.5 },
              },
            }}
          >
            {isFlipping ? '🎲 Flipping...' : 'Flip Coin'}
          </Button>
          
          <FormControlLabel
            control={
              <Switch
                checked={skipAnimation}
                onChange={(e) => setSkipAnimation(e.target.checked)}
              />
            }
            label="⚡ Skip Animation"
            sx={{
              display: 'block',
              width: '100%',
              mx: 0,
              justifyContent: 'center',
              userSelect: 'none',
              '& .MuiFormControlLabel-label': {
                fontFamily: '"Comic Neue", sans-serif',
                fontSize: '1.1rem',
                fontWeight: 600,
                color: (theme) => theme.palette.mode === 'dark' 
                  ? theme.palette.text.primary
                  : 'inherit',
              },
              '& *': {
                cursor: 'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><text y="35" font-size="35">👆</text></svg>\') 10 0, pointer !important',
              },
            }}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default CoinFlip;

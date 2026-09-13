import { Box, Typography } from '@mui/material';
import CoinFlip from '../components/CoinFlip';

const MainPage = () => {
  return (
    <Box sx={{ py: 2 }}>
      <Typography 
        variant="h3" 
        align="center" 
        gutterBottom
        sx={{
          fontFamily: '"Bangers", cursive',
          fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
          background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
          letterSpacing: '0.05em',
          mb: 1,
          mt: 2,
        }}
      >
        ✨ Ready to Flip the Coin? ✨
      </Typography>
      <Typography 
        variant="h5" 
        align="center" 
        sx={{
          mb: 1,
          fontFamily: '"Fredoka", "Comic Neue", sans-serif',
          fontWeight: 600,
          color: 'primary.main',
          fontSize: { xs: '1.2rem', sm: '1.5rem' },
        }}
      >
        🎲 Let Fate Decide! 🎲
      </Typography>
      <Typography 
        variant="body1" 
        align="center" 
        color="text.secondary" 
        sx={{ 
          mb: 3,
          fontFamily: '"Comic Neue", sans-serif',
          fontSize: { xs: '1rem', sm: '1.1rem' },
          fontWeight: 500,
          px: 2,
        }}
      >
        Hit that button and watch the magic happen! Keep track of all your epic flips!
      </Typography>
      <CoinFlip />
    </Box>
  );
};

export default MainPage;

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Container, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { DarkMode, LightMode, History, Person, ExitToApp, AccountCircle, VolumeUp, VolumeOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useThemeContext } from '../context/ThemeContext';
import { useSound } from '../context/SoundContext';
import HistoryDialog from './HistoryDialog';
import AuthDialog from './AuthDialog';

const Layout = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  const { mode, toggleTheme } = useThemeContext();
  const { isMuted, toggleMute } = useSound();
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const profileMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleProfileMenuClose();
    navigate('/profile');
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    logout();
    navigate('/');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ 
              flexGrow: 1, 
              cursor: 'pointer',
              fontFamily: '"Bangers", cursive',
              fontSize: '1.8rem',
              letterSpacing: '0.1em',
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
            }}
            onClick={() => navigate('/')}
          >
            🪙 Coin Flip
          </Typography>

          <IconButton 
            color="inherit" 
            onClick={toggleTheme}
            sx={{ 
              fontSize: '1.8rem',
              '& .MuiSvgIcon-root': { fontSize: '2rem' }
            }}
            title={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {mode === 'dark' ? <LightMode fontSize="large" /> : <DarkMode fontSize="large" />}
          </IconButton>

          <IconButton 
            color="inherit" 
            onClick={toggleMute}
            sx={{ 
              fontSize: '1.8rem',
              '& .MuiSvgIcon-root': { fontSize: '2rem' }
            }}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeOff fontSize="large" /> : <VolumeUp fontSize="large" />}
          </IconButton>

          <Button
            color="inherit"
            startIcon={<History sx={{ fontSize: '1.8rem !important' }} />}
            onClick={() => setHistoryDialogOpen(true)}
            sx={{
              fontSize: '1.1rem',
              fontWeight: 600,
              padding: '12px 24px',
              minHeight: '56px',
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
            }}
          >
            History
          </Button>

          {isAuthenticated ? (
            <>
              <Button
                color="inherit"
                startIcon={<AccountCircle sx={{ fontSize: '1.8rem !important' }} />}
                onClick={handleProfileMenuOpen}
                aria-controls={profileMenuOpen ? 'profile-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={profileMenuOpen ? 'true' : undefined}
                sx={{
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  padding: '12px 24px',
                  minHeight: '56px',
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
                }}
              >
                {user?.username}
              </Button>
              <Menu
                id="profile-menu"
                anchorEl={anchorEl}
                open={profileMenuOpen}
                onClose={handleProfileMenuClose}
                MenuListProps={{
                  'aria-labelledby': 'profile-button',
                  sx: {
                    padding: 0,
                  }
                }}
                PaperProps={{
                  sx: {
                    minWidth: 200,
                  }
                }}
              >
                <MenuItem 
                  onClick={handleProfileClick}
                  sx={{ 
                    minHeight: '56px !important',
                    padding: '16px 24px !important',
                    fontSize: '1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <ListItemIcon sx={{ minWidth: '40px' }}>
                    <Person fontSize="medium" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Profile"
                    primaryTypographyProps={{ 
                      fontSize: '1.1rem', 
                      fontWeight: 500,
                      lineHeight: 1,
                    }}
                  />
                </MenuItem>
                <MenuItem 
                  onClick={handleLogout}
                  sx={{ 
                    minHeight: '56px !important',
                    padding: '16px 24px !important',
                    fontSize: '1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <ListItemIcon sx={{ minWidth: '40px' }}>
                    <ExitToApp fontSize="medium" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Logout"
                    primaryTypographyProps={{ 
                      fontSize: '1.1rem', 
                      fontWeight: 500,
                      lineHeight: 1,
                    }}
                  />
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button 
              color="inherit" 
              startIcon={<AccountCircle sx={{ fontSize: '1.8rem !important' }} />}
              onClick={() => setAuthDialogOpen(true)}
              sx={{
                fontSize: '1.1rem',
                fontWeight: 600,
                padding: '12px 24px',
                minHeight: '56px',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
              }}
            >
              Login / Register
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Outlet />
      </Container>

      <HistoryDialog 
        open={historyDialogOpen} 
        onClose={() => setHistoryDialogOpen(false)} 
      />

      <AuthDialog
        open={authDialogOpen}
        onClose={() => setAuthDialogOpen(false)}
      />
    </Box>
  );
};

export default Layout;

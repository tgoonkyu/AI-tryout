import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  Tabs,
  Tab,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

interface AuthDialogProps {
  open: boolean;
  onClose: () => void;
}

const AuthDialog = ({ open, onClose }: AuthDialogProps) => {
  const { login, register } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError('');
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  };

  const validateRegisterForm = () => {
    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (registerData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (!registerData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(loginData.username, loginData.password);
      onClose();
      setLoginData({ username: '', password: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateRegisterForm()) return;

    setLoading(true);

    try {
      await register(registerData.username, registerData.email, registerData.password);
      onClose();
      setRegisterData({ username: '', email: '', password: '', confirmPassword: '' });
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Registration failed. Username or email may already exist.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setError('');
    setLoginData({ username: '', password: '' });
    setRegisterData({ username: '', email: '', password: '', confirmPassword: '' });
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: '0 12px 48px rgba(0, 0, 0, 0.2)',
        }
      }}
    >
      <DialogTitle sx={{ pb: 0 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          centered
          sx={{
            '& .MuiTab-root': {
              fontFamily: '"Fredoka", sans-serif',
              fontWeight: 600,
              fontSize: '1.1rem',
              textTransform: 'none',
            },
          }}
        >
          <Tab label="🔐 Login" />
          <Tab label="✨ Register" />
        </Tabs>
      </DialogTitle>
      <DialogContent sx={{ pt: 3, pb: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {tabValue === 0 ? (
          <Box component="form" onSubmit={handleLoginSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={loginData.username}
              onChange={handleLoginChange}
              margin="normal"
              required
              autoFocus
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={loginData.password}
              onChange={handleLoginChange}
              margin="normal"
              required
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              sx={{ 
                mt: 3, 
                mb: 2,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 700,
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                '&:hover': {
                  boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                },
              }}
              disabled={loading}
            >
              {loading ? '⏳ Logging in...' : '🔐 Login'}
            </Button>

            <Typography align="center" variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Typography
                component="span"
                color="primary"
                sx={{ 
                  cursor: 'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><text y="35" font-size="35">👆</text></svg>\') 10 0, pointer !important',
                  textDecoration: 'underline',
                  fontWeight: 600,
                  padding: '8px 4px',
                  display: 'inline-block',
                  '&:hover': {
                    textDecoration: 'none',
                  }
                }}
                onClick={() => setTabValue(1)}
              >
                Register here
              </Typography>
            </Typography>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleRegisterSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={registerData.username}
              onChange={handleRegisterChange}
              margin="normal"
              required
              autoFocus
            />

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={registerData.email}
              onChange={handleRegisterChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={registerData.password}
              onChange={handleRegisterChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={registerData.confirmPassword}
              onChange={handleRegisterChange}
              margin="normal"
              required
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              sx={{ 
                mt: 3, 
                mb: 2,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 700,
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                '&:hover': {
                  boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                },
              }}
              disabled={loading}
            >
              {loading ? '⏳ Registering...' : '✨ Register'}
            </Button>

            <Typography align="center" variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Typography
                component="span"
                color="primary"
                sx={{ 
                  cursor: 'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><text y="35" font-size="35">👆</text></svg>\') 10 0, pointer !important',
                  textDecoration: 'underline',
                  fontWeight: 600,
                  padding: '8px 4px',
                  display: 'inline-block',
                  '&:hover': {
                    textDecoration: 'none',
                  }
                }}
                onClick={() => setTabValue(0)}
              >
                Login here
              </Typography>
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;

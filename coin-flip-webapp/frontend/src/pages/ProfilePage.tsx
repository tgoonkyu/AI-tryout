import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Button,
  Divider,
  Chip,
} from '@mui/material';
import { 
  ArrowBack, 
  Casino, 
  TrendingUp, 
  Today, 
  DateRange, 
  CalendarMonth,
  Person,
  Email,
  Badge
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface StatsSummary {
  totalFlips: number;
  headsCount: number;
  tailsCount: number;
  headsRatio: number;
  tailsRatio: number;
  today: {
    totalFlips: number;
    headsCount: number;
    tailsCount: number;
  };
  thisWeek: {
    totalFlips: number;
    headsCount: number;
    tailsCount: number;
  };
  thisMonth: {
    totalFlips: number;
    headsCount: number;
    tailsCount: number;
  };
}

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<StatsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/stats/summary');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetHistory = async () => {
    if (!confirm('Are you sure you want to reset your flip history? This cannot be undone!')) return;

    try {
      await axios.delete('/api/history');
      fetchStats();
      alert('History reset successfully!');
    } catch (error) {
      console.error('Error resetting history:', error);
      alert('Failed to reset history');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">
          Profile
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          sx={{
            fontWeight: 700,
            textTransform: 'none',
            fontSize: '1.05rem',
          }}
        >
          Back to Coin Flip
        </Button>
      </Box>

      <Paper 
        elevation={3}
        sx={{ 
          p: 0, 
          mb: 2,
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <Box 
          sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            p: 2,
            color: 'white'
          }}
        >
          <Typography variant="h6" fontWeight="600">
            User Information
          </Typography>
        </Box>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Box display="flex" alignItems="center" gap={1.5}>
                <Box 
                  sx={{ 
                    bgcolor: 'success.main',
                    color: 'white',
                    borderRadius: '50%',
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Badge />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    User ID
                  </Typography>
                  <Typography variant="body2" fontWeight="600" sx={{ wordBreak: 'break-all' }}>
                    {user?.userId}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box display="flex" alignItems="center" gap={1.5}>
                <Box 
                  sx={{ 
                    bgcolor: 'primary.main',
                    color: 'white',
                    borderRadius: '50%',
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Person />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Username
                  </Typography>
                  <Typography variant="body1" fontWeight="600">
                    {user?.username}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box display="flex" alignItems="center" gap={1.5}>
                <Box 
                  sx={{ 
                    bgcolor: 'secondary.main',
                    color: 'white',
                    borderRadius: '50%',
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Email />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Email
                  </Typography>
                  <Typography variant="body1" fontWeight="600">
                    {user?.email}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 2, mb: 1.5 }}>
        <Typography variant="h5">
          Statistics
        </Typography>
        <Button 
          variant="outlined" 
          color="error" 
          onClick={handleResetHistory}
          sx={{
            fontWeight: 700,
            textTransform: 'none',
            fontSize: '1.05rem',
          }}
        >
          Reset History
        </Button>
      </Box>

      <Grid container spacing={2}>
        {/* Overall Statistics */}
        <Grid item xs={12}>
          <Typography variant="h6" color="text.secondary" gutterBottom sx={{ ml: 1 }}>
            Overall Statistics
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            height: '100%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}>
            <CardContent sx={{ py: 1.2, px: 1.8 }}>
              <Box display="flex" alignItems="center" mb={0.5}>
                <Casino sx={{ mr: 1, fontSize: 24 }} />
                <Typography variant="subtitle2">
                  Total Flips
                </Typography>
              </Box>
              <Typography variant="h3" fontWeight="bold">
                {stats?.totalFlips || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ py: 1.2, px: 1.8 }}>
              <Box display="flex" alignItems="center" mb={0.5}>
                <Box 
                  sx={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    bgcolor: 'primary.main', 
                    mr: 1 
                  }} 
                />
                <Typography variant="subtitle2" color="text.secondary">
                  Heads
                </Typography>
              </Box>
              <Typography variant="h3" color="primary" fontWeight="bold">
                {stats?.headsCount || 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {stats ? `${Math.round(stats.headsRatio * 100)}%` : '0%'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ py: 1.2, px: 1.8 }}>
              <Box display="flex" alignItems="center" mb={0.5}>
                <Box 
                  sx={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    bgcolor: 'secondary.main', 
                    mr: 1 
                  }} 
                />
                <Typography variant="subtitle2" color="text.secondary">
                  Tails
                </Typography>
              </Box>
              <Typography variant="h3" color="secondary" fontWeight="bold">
                {stats?.tailsCount || 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {stats ? `${Math.round(stats.tailsRatio * 100)}%` : '0%'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ py: 1.2, px: 1.8 }}>
              <Box display="flex" alignItems="center" mb={0.5}>
                <TrendingUp sx={{ mr: 1, color: 'success.main', fontSize: 20 }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Ratio
                </Typography>
              </Box>
              <Typography variant="h3" fontWeight="bold">
                {stats ? `${Math.round(stats.headsRatio * 100)}:${Math.round(stats.tailsRatio * 100)}` : '0:0'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Heads : Tails
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Time-Based Statistics */}
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom sx={{ ml: 1 }}>
            Time-Based Statistics
          </Typography>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={{ height: '100%', borderLeft: 4, borderColor: 'info.main' }}>
            <CardContent sx={{ py: 1.2, px: 1.8 }}>
              <Box display="flex" alignItems="center" mb={1}>
                <Today sx={{ mr: 1, color: 'info.main', fontSize: 20 }} />
                <Typography variant="h6" color="text.secondary">
                  Today
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {stats?.today?.totalFlips || 0}
              </Typography>
              <Box display="flex" gap={2} mt={0.5}>
                <Chip 
                  label={`H: ${stats?.today?.headsCount || 0}`} 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                />
                <Chip 
                  label={`T: ${stats?.today?.tailsCount || 0}`} 
                  size="small" 
                  color="secondary" 
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={{ height: '100%', borderLeft: 4, borderColor: 'warning.main' }}>
            <CardContent sx={{ py: 1.2, px: 1.8 }}>
              <Box display="flex" alignItems="center" mb={1}>
                <DateRange sx={{ mr: 1, color: 'warning.main', fontSize: 20 }} />
                <Typography variant="h6" color="text.secondary">
                  This Week
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {stats?.thisWeek?.totalFlips || 0}
              </Typography>
              <Box display="flex" gap={2} mt={0.5}>
                <Chip 
                  label={`H: ${stats?.thisWeek?.headsCount || 0}`} 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                />
                <Chip 
                  label={`T: ${stats?.thisWeek?.tailsCount || 0}`} 
                  size="small" 
                  color="secondary" 
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={{ height: '100%', borderLeft: 4, borderColor: 'success.main' }}>
            <CardContent sx={{ py: 1.2, px: 1.8 }}>
              <Box display="flex" alignItems="center" mb={1}>
                <CalendarMonth sx={{ mr: 1, color: 'success.main', fontSize: 20 }} />
                <Typography variant="h6" color="text.secondary">
                  This Month
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {stats?.thisMonth?.totalFlips || 0}
              </Typography>
              <Box display="flex" gap={2} mt={0.5}>
                <Chip 
                  label={`H: ${stats?.thisMonth?.headsCount || 0}`} 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                />
                <Chip 
                  label={`T: ${stats?.thisMonth?.tailsCount || 0}`} 
                  size="small" 
                  color="secondary" 
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfilePage;

import { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Typography,
  Chip,
  TableSortLabel,
} from '@mui/material';
import { History as HistoryIcon } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface FlipHistoryItem {
  serialNo: number;
  flipId: string;
  result: string;
  createdAt: string;
}

interface HistoryDialogProps {
  open: boolean;
  onClose: () => void;
}

const HistoryDialog = ({ open, onClose }: HistoryDialogProps) => {
  const { isAuthenticated } = useAuth();
  const [history, setHistory] = useState<FlipHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [sessionId, setSessionId] = useState('');

  // Update sessionId when dialog opens or auth state changes
  useEffect(() => {
    if (!isAuthenticated) {
      const currentSessionId = localStorage.getItem('sessionId') || '';
      setSessionId(currentSessionId);
    }
  }, [open, isAuthenticated]);

  useEffect(() => {
    if (open) {
      // Reset state when dialog opens
      setHistory([]);
      setPage(0);
      setHasMore(true);
      fetchHistory(0);
      // Scroll to top when dialog opens
      setTimeout(() => {
        if (tableContainerRef.current) {
          tableContainerRef.current.scrollTop = 0;
        }
      }, 100);
    }
  }, [open, sessionId]); // Also re-fetch when sessionId changes

  const fetchHistory = async (pageNum: number) => {
    if (loading) return;
    
    setLoading(true);
    try {
  const params: Record<string, unknown> = {
        page: pageNum,
        size: 15,
        sort: 'createdAt,desc',
      };

      if (!isAuthenticated) {
        params.sessionId = sessionId;
      }

      const response = await axios.get('/api/history', { params });
      
      if (pageNum === 0) {
        setHistory(response.data.content);
      } else {
        setHistory(prev => [...prev, ...response.data.content]);
      }
      
      setTotalElements(response.data.totalElements);
      setHasMore(!response.data.last);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    if (!tableContainerRef.current || loading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = tableContainerRef.current;
    
    // Load more when scrolled to within 100px of bottom
    if (scrollHeight - scrollTop - clientHeight < 100) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchHistory(nextPage);
    }
  };

  const handleClearHistory = async () => {
    if (!confirm('Are you sure you want to clear all history?')) return;

    try {
      const params = !isAuthenticated ? { sessionId } : {};
      await axios.delete('/api/history', { params });
      setHistory([]);
      setPage(0);
      setHasMore(false);
      setTotalElements(0);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1}>
            <HistoryIcon color="primary" />
            <Typography variant="h5" fontWeight="600">
              History
            </Typography>
          </Box>
          <Button 
            onClick={handleClearHistory} 
            color="error" 
            variant="outlined" 
            size="small"
            sx={{ 
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '1rem',
            }}
          >
            Clear History
          </Button>
        </Box>
        {totalElements > 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, display: 'block', fontWeight: 600, fontSize: '0.95rem' }}>
            {totalElements} total coin-flip{totalElements !== 1 ? 's' : ''}
          </Typography>
        )}
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
        {loading && history.length === 0 ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer 
            component={Paper} 
            elevation={0}
            ref={tableContainerRef}
            onScroll={handleScroll}
            sx={{ 
              flex: 1,
              minHeight: `${48 + (Math.min(Math.max(history.length, 3), 9.5) * 48)}px`, // Header (48px) + rows (48px each, max 9.5)
              maxHeight: `${48 + (9.5 * 48)}px`, // Header + max 9.5 rows
              overflowY: 'auto',
              overflowX: 'hidden'
            }}
          >
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell 
                    sx={{ 
                      fontWeight: 700,
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      borderBottom: 2,
                      borderColor: 'primary.dark'
                    }}
                  >
                    No.
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      fontWeight: 700,
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      borderBottom: 2,
                      borderColor: 'primary.dark'
                    }}
                  >
                    Result
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      fontWeight: 700,
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      borderBottom: 2,
                      borderColor: 'primary.dark'
                    }}
                  >
                    <TableSortLabel
                      active={true}
                      direction="desc"
                      sx={{ 
                        cursor: 'default',
                        color: 'inherit !important',
                        '&:hover': { color: 'inherit' },
                        '& .MuiTableSortLabel-icon': {
                          opacity: 1,
                          color: 'inherit !important'
                        }
                      }}
                    >
                      Timestamp
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      <Box py={4}>
                        <Typography variant="body1" color="text.secondary" gutterBottom>
                          No flip history yet
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Start flipping coins to see your history here!
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {history.map((item, index) => (
                      <TableRow 
                        key={item.flipId}
                        sx={{ 
                          '&:hover': { bgcolor: 'action.hover' },
                          transition: 'background-color 0.2s'
                        }}
                      >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <Chip
                            label={item.result}
                            color={item.result === 'HEADS' ? 'primary' : 'secondary'}
                            size="small"
                            sx={{ fontWeight: 600, minWidth: 70 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(item.createdAt)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                    {loading && (
                      <TableRow>
                        <TableCell colSpan={3} align="center" sx={{ py: 2 }}>
                          <CircularProgress size={24} />
                        </TableCell>
                      </TableRow>
                    )}
                    {!hasMore && history.length > 0 && (
                      <TableRow>
                        <TableCell colSpan={3} align="center" sx={{ py: 0.5, height: '35px', fontSize: '0.75rem' }}>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                            No more entries
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button 
          onClick={onClose} 
          variant="contained"
          sx={{ 
            textTransform: 'none', 
            minWidth: 100,
            fontWeight: 700,
            fontSize: '1.05rem',
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HistoryDialog;

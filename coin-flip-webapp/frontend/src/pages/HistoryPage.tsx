import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TablePagination,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface FlipHistoryItem {
  serialNo: number;
  flipId: string;
  result: string;
  createdAt: string;
}

const HistoryPage = () => {
  const { isAuthenticated } = useAuth();
  const [history, setHistory] = useState<FlipHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const sessionId = localStorage.getItem('sessionId') || '';

  useEffect(() => {
    fetchHistory();
  }, [page, rowsPerPage]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
  const params: Record<string, unknown> = {
        page,
        size: rowsPerPage,
        sort: 'createdAt,desc',
      };

      if (!isAuthenticated) {
        params.sessionId = sessionId;
      }

      const response = await axios.get('/api/history', { params });
      setHistory(response.data.content);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!confirm('Are you sure you want to clear all history?')) return;

    try {
      const params = !isAuthenticated ? { sessionId } : {};
      await axios.delete('/api/history', { params });
      fetchHistory();
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Flip History</Typography>
        <Button variant="outlined" color="error" onClick={handleClearHistory}>
          Clear History
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Serial No.</TableCell>
              <TableCell>Result</TableCell>
              <TableCell>Timestamp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No flip history yet. Start flipping!
                </TableCell>
              </TableRow>
            ) : (
              history.map((item) => (
                <TableRow key={item.flipId}>
                  <TableCell>{item.serialNo}</TableCell>
                  <TableCell>
                    <Typography
                      color={item.result === 'HEADS' ? 'primary' : 'secondary'}
                      fontWeight="bold"
                    >
                      {item.result}
                    </Typography>
                  </TableCell>
                  <TableCell>{formatDate(item.createdAt)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={totalElements}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[10, 25]}
      />
    </Box>
  );
};

export default HistoryPage;

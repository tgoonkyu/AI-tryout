import React from 'react';
import { Box, Container } from '@mui/material';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      {/* TODO: Add Navbar/Header here */}
      <Container
        component="main"
        maxWidth="lg"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          py: 4,
        }}
      >
        {children}
      </Container>
      {/* TODO: Add Footer here */}
    </Box>
  );
};

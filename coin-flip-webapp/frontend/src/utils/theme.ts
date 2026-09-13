import { createTheme, Theme, ThemeOptions } from '@mui/material/styles';
import { ThemeMode } from '@/types';

/**
 * Color palette definitions for light and dark themes
 */
const palette = {
  light: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#dc004e',
      light: '#ff6090',
      dark: '#9a0036',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
    },
  },
  dark: {
    primary: {
      main: '#90caf9',
      light: '#e3f2fd',
      dark: '#42a5f5',
      contrastText: '#000000',
    },
    secondary: {
      main: '#f48fb1',
      light: '#ffc1e3',
      dark: '#bf5f82',
      contrastText: '#000000',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
};

/**
 * Common theme configuration shared between light and dark themes
 */
const getCommonThemeConfig = (): Partial<ThemeOptions> => ({
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.125rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.4,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          fontSize: '0.875rem',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          '&:hover': {
            transform: 'translateY(-1px)',
            transition: 'transform 0.2s ease-in-out',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            fontWeight: 600,
            fontSize: '0.875rem',
          },
        },
      },
    },
  },
});

/**
 * Create a Material-UI theme based on the specified mode
 * 
 * @param mode - Theme mode ('light' or 'dark')
 * @returns Material-UI theme object
 */
export const createAppTheme = (mode: ThemeMode): Theme => {
  const commonConfig = getCommonThemeConfig();
  
  const themeOptions: ThemeOptions = {
    ...commonConfig,
    palette: {
      mode,
      ...palette[mode],
    },
  };

  return createTheme(themeOptions);
};

/**
 * Get the opposite theme mode
 * 
 * @param currentMode - Current theme mode
 * @returns Opposite theme mode
 */
export const getOppositeMode = (currentMode: ThemeMode): ThemeMode => {
  return currentMode === 'light' ? 'dark' : 'light';
};

/**
 * Check if the current theme is dark mode
 * 
 * @param mode - Theme mode to check
 * @returns True if dark mode, false otherwise
 */
export const isDarkMode = (mode: ThemeMode): boolean => {
  return mode === 'dark';
};

/**
 * Get system theme preference
 * 
 * @returns 'dark' if system prefers dark mode, 'light' otherwise
 */
export const getSystemThemePreference = (): ThemeMode => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

/**
 * Custom theme breakpoints for responsive design
 */
export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
} as const;

/**
 * Animation durations used throughout the app
 */
export const animations = {
  short: 200,
  standard: 300,
  long: 500,
  coinFlip: 3000,
} as const;

/**
 * Z-index values for layering
 */
export const zIndex = {
  drawer: 1200,
  modal: 1300,
  snackbar: 1400,
  tooltip: 1500,
} as const;
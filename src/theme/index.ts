import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    gradient: {
      main: string;
      dark: string;
    };
  }
  interface PaletteOptions {
    gradient?: {
      main?: string;
      dark?: string;
    };
  }
}

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00BFFF', // Deep Sky Blue
      light: '#4DD0FF',
      dark: '#0088CC',
      contrastText: '#fff',
    },
    secondary: {
      main: '#1DE9B6', // Teal
      light: '#64FFDA',
      dark: '#00B686',
      contrastText: '#000',
    },
    error: {
      main: '#FF5252',
      light: '#FF8A80',
      dark: '#C50E29',
    },
    warning: {
      main: '#FFB74D',
      light: '#FFE0B2',
      dark: '#F57C00',
    },
    info: {
      main: '#8A2BE2', // Blue Violet
      light: '#AC68F0',
      dark: '#6A1B9A',
    },
    success: {
      main: '#69F0AE',
      light: '#B9F6CA',
      dark: '#00C853',
    },
    background: {
      default: '#0A1929', // Deep navy
      paper: '#102a43',
    },
    gradient: {
      main: '#0A1929', // Changed from linear-gradient to solid color
      dark: '#071420', // Changed from linear-gradient to solid color
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.2,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.2,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.2,
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: 1.2,
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.2,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 500,
      fontSize: '0.875rem',
      lineHeight: 1.5,
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        },
        contained: {
          '&:hover': {
            boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.2)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          padding: 16,
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
          backgroundColor: 'rgba(16, 42, 67, 0.95)', // Changed from gradient to solid color with opacity
          backdropFilter: 'blur(8px)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(16, 42, 67, 0.95)', // Changed from gradient to solid color with opacity
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        },
        head: {
          fontWeight: 600,
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(0, 191, 255, 0.08)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          color: '#00BFFF',
        },
        track: {
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
        },
      },
    },
  },
});

export default theme;
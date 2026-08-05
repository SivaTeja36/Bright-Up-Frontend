import { createTheme } from '@mui/material/styles';
import '@mui/x-data-grid/themeAugmentation';

export type ThemeMode = 'light' | 'dark';

declare module '@mui/material/styles' {
  interface Palette {
    gradient: {
      main: string;
      dark: string;
      light: string;
      brand: string;
    };
  }
  interface PaletteOptions {
    gradient?: {
      main?: string;
      dark?: string;
      light?: string;
      brand?: string;
    };
  }
}

interface ThemeTokens {
  bgDefault: string;
  bgPaper: string;
  bgSubtle: string;
  divider: string;
  borderSubtle: string;
  primaryMain: string;
  primaryLight: string;
  primaryDark: string;
  secondaryMain: string;
  secondaryLight: string;
  secondaryDark: string;
  textPrimary: string;
  textSecondary: string;
  headerBg: string;
  rowHover: string;
  brandGradient: string;
  navGradient: string;
  focusBorder: string;
}

const lightTokens: ThemeTokens = {
  bgDefault: '#F3F6FB',
  bgPaper: '#FFFFFF',
  bgSubtle: '#F8FAFD',
  divider: '#E4E8F0',
  borderSubtle: '#EAF0F8',
  primaryMain: '#2563EB',
  primaryLight: '#60A5FA',
  primaryDark: '#1D4ED8',
  secondaryMain: '#0EA5E9',
  secondaryLight: '#7DD3FC',
  secondaryDark: '#0369A1',
  textPrimary: '#0B1220',
  textSecondary: '#5B6478',
  headerBg: '#F7F9FC',
  rowHover: 'rgba(37, 99, 235, 0.07)',
  brandGradient: 'linear-gradient(120deg, #1D4ED8 0%, #2563EB 45%, #0EA5E9 100%)',
  navGradient: 'linear-gradient(90deg, #1D4ED8 0%, #2563EB 55%, #0EA5E9 100%)',
  focusBorder: '#2563EB',
};

const darkTokens: ThemeTokens = {
  bgDefault: '#0B1220',
  bgPaper: '#141D2E',
  bgSubtle: '#182238',
  divider: '#26314A',
  borderSubtle: '#223048',
  primaryMain: '#3B82F6',
  primaryLight: '#60A5FA',
  primaryDark: '#2563EB',
  secondaryMain: '#38BDF8',
  secondaryLight: '#7DD3FC',
  secondaryDark: '#0284C7',
  textPrimary: '#EAF0FA',
  textSecondary: '#94A3B8',
  headerBg: '#17223A',
  rowHover: 'rgba(59, 130, 246, 0.14)',
  brandGradient: 'linear-gradient(120deg, #1E40AF 0%, #3B82F6 50%, #0EA5E9 100%)',
  navGradient: 'linear-gradient(90deg, #1E40AF 0%, #3B82F6 55%, #0EA5E9 100%)',
  focusBorder: '#60A5FA',
};

export const getTheme = (mode: ThemeMode) => {
  const tokens = mode === 'dark' ? darkTokens : lightTokens;

  return createTheme({
    palette: {
      mode,
      primary: {
        main: tokens.primaryMain,
        light: tokens.primaryLight,
        dark: tokens.primaryDark,
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: tokens.secondaryMain,
        light: tokens.secondaryLight,
        dark: tokens.secondaryDark,
        contrastText: '#FFFFFF',
      },
      error: {
        main: '#EF4444',
        light: '#FCA5A5',
        dark: '#B91C1C',
      },
      warning: {
        main: '#F59E0B',
        light: '#FCD34D',
        dark: '#B45309',
      },
      info: {
        main: '#06B6D4',
        light: '#67E8F9',
        dark: '#0E7490',
      },
      success: {
        main: '#10B981',
        light: '#6EE7B7',
        dark: '#047857',
      },
      background: {
        default: tokens.bgDefault,
        paper: tokens.bgPaper,
      },
      divider: tokens.divider,
      gradient: {
        main: tokens.bgDefault,
        dark: tokens.bgPaper,
        light: tokens.bgSubtle,
        brand: tokens.brandGradient,
      },
      text: {
        primary: tokens.textPrimary,
        secondary: tokens.textSecondary,
      },
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: '"Plus Jakarta Sans", "Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
        fontSize: '2.1rem',
        lineHeight: 1.2,
        letterSpacing: '-0.02em',
      },
      h2: {
        fontWeight: 700,
        fontSize: '1.7rem',
        lineHeight: 1.2,
        letterSpacing: '-0.02em',
      },
      h3: {
        fontWeight: 700,
        fontSize: '1.5rem',
        lineHeight: 1.2,
        letterSpacing: '-0.01em',
      },
      h4: {
        fontWeight: 700,
        fontSize: '1.3rem',
        lineHeight: 1.2,
        letterSpacing: '-0.01em',
      },
      h5: {
        fontWeight: 600,
        fontSize: '1.1rem',
        lineHeight: 1.2,
      },
      h6: {
        fontWeight: 600,
        fontSize: '0.925rem',
        lineHeight: 1.2,
      },
      subtitle1: {
        fontSize: '0.9375rem',
        lineHeight: 1.5,
      },
      subtitle2: {
        fontSize: '0.875rem',
        lineHeight: 1.5,
      },
      body1: {
        fontSize: '0.9375rem',
        lineHeight: 1.55,
      },
      body2: {
        fontSize: '0.8125rem',
        lineHeight: 1.55,
      },
      button: {
        fontWeight: 600,
        fontSize: '0.8125rem',
        lineHeight: 1.5,
        textTransform: 'none',
        letterSpacing: '0.01em',
      },
      caption: {
        fontSize: '0.75rem',
        lineHeight: 1.5,
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: tokens.bgDefault,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            padding: '9px 18px',
            boxShadow: 'none',
            transition: 'all 0.25s ease-in-out',
            '&:hover': {
              transform: 'translateY(-1px)',
            },
          },
          containedPrimary: {
            backgroundColor: tokens.primaryMain,
            boxShadow: `0px 6px 18px rgba(37, 99, 235, 0.35)`,
            '&:hover': {
              backgroundColor: tokens.primaryDark,
              boxShadow: `0px 10px 24px rgba(37, 99, 235, 0.45)`,
            },
          },
          containedSecondary: {
            backgroundColor: tokens.secondaryMain,
            boxShadow: `0px 6px 18px rgba(14, 165, 233, 0.35)`,
            '&:hover': {
              backgroundColor: tokens.secondaryDark,
              boxShadow: `0px 10px 24px rgba(14, 165, 233, 0.45)`,
            },
          },
          outlined: {
            boxShadow: 'none',
          },
          text: {
            boxShadow: 'none',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 18,
            overflow: 'hidden',
            boxShadow: mode === 'dark'
              ? '0px 6px 28px rgba(0, 0, 0, 0.35)'
              : '0px 6px 28px rgba(15, 23, 42, 0.07)',
            backgroundColor: tokens.bgPaper,
            border: `1px solid ${tokens.borderSubtle}`,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          rounded: {
            borderRadius: 14,
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${tokens.divider}`,
          },
          head: {
            fontWeight: 700,
            color: tokens.textSecondary,
            backgroundColor: tokens.headerBg,
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            transition: 'background-color 0.2s ease',
            '&:hover': {
              backgroundColor: tokens.rowHover,
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 600,
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          switchBase: {
            color: tokens.textSecondary,
            '&.Mui-checked': {
              color: tokens.primaryMain,
            },
          },
          track: {
            backgroundColor: mode === 'dark'
              ? 'rgba(148, 163, 184, 0.4)'
              : 'rgba(15, 23, 42, 0.2)',
            '.Mui-checked.Mui-checked + &': {
              backgroundColor: 'rgba(37, 99, 235, 0.5)',
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: tokens.primaryLight,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: tokens.focusBorder,
              borderWidth: 2,
            },
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            backgroundColor: mode === 'dark' ? '#223048' : '#EAF0F8',
          },
          bar: {
            borderRadius: 6,
            background: tokens.navGradient,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'dark'
              ? 'rgba(11, 18, 32, 0.75)'
              : 'rgba(255, 255, 255, 0.72)',
            backgroundImage: 'none',
          },
        },
      },
      MuiDataGrid: {
        styleOverrides: {
          root: {
            border: 'none',
            color: tokens.textPrimary,
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: tokens.headerBg,
              color: tokens.textSecondary,
              fontWeight: 700,
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 700,
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            },
            '& .MuiDataGrid-row': {
              transition: 'background-color 0.2s ease',
              '&:hover': {
                backgroundColor: tokens.rowHover,
              },
            },
            '& .MuiDataGrid-cell': {
              borderBottom: `1px solid ${tokens.divider}`,
              fontSize: '0.8125rem',
            },
            '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
              outline: 'none',
            },
            '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': {
              outline: 'none',
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: `1px solid ${tokens.divider}`,
              backgroundColor: tokens.headerBg,
            },
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: mode === 'dark' ? '#EAF0FA' : '#0B1220',
            color: mode === 'dark' ? '#0B1220' : '#FFFFFF',
            borderRadius: 8,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: tokens.bgPaper,
            backgroundImage: 'none',
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            backgroundColor: tokens.bgPaper,
            backgroundImage: 'none',
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundColor: tokens.bgPaper,
            backgroundImage: 'none',
          },
        },
      },
    },
  });
};

export default getTheme('light');

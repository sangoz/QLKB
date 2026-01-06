import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#094067', // Headline color
      light: '#3da9fc', // Button color  
      dark: '#001d3d',
      contrastText: '#fffffe', // Background color
    },
    secondary: {
      main: '#3da9fc', // Button color
      light: '#90b4ce', // Secondary color
      dark: '#0077b6',
      contrastText: '#fffffe',
    },
    error: {
      main: '#ef4565', // Tertiary color
      light: '#ff7b9d',
      dark: '#c1004b',
      contrastText: '#fffffe',
    },
    warning: {
      main: '#f4845f',
      light: '#ff9999',
      dark: '#c6502f',
      contrastText: '#fffffe',
    },
    info: {
      main: '#90b4ce', // Secondary color
      light: '#b5d4e8',
      dark: '#6b8aa0',
      contrastText: '#094067',
    },
    success: {
      main: '#28a745',
      light: '#5cb85c',
      dark: '#1e7e34',
      contrastText: '#fffffe',
    },
    background: {
      default: '#fffffe', // Background color
      paper: '#fffffe',
    },
    text: {
      primary: '#094067', // Headline color
      secondary: '#5f6c7b', // Paragraph color
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
      color: '#094067',
    },
    h2: {
      fontWeight: 700,
      color: '#094067',
    },
    h3: {
      fontWeight: 600,
      color: '#094067',
    },
    h4: {
      fontWeight: 600,
      color: '#094067',
    },
    h5: {
      fontWeight: 600,
      color: '#094067',
    },
    h6: {
      fontWeight: 600,
      color: '#094067',
    },
    body1: {
      color: '#5f6c7b',
    },
    body2: {
      color: '#5f6c7b',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
        contained: {
          backgroundColor: '#3da9fc',
          color: '#fffffe',
          '&:hover': {
            backgroundColor: '#2c8fd1',
          },
        },
        outlined: {
          borderColor: '#3da9fc',
          color: '#3da9fc',
          '&:hover': {
            borderColor: '#2c8fd1',
            backgroundColor: 'rgba(61, 169, 252, 0.04)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(9, 64, 103, 0.1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: '#3da9fc',
          color: '#fffffe',
        },
        colorSecondary: {
          backgroundColor: '#90b4ce',
          color: '#094067',
        },
        colorError: {
          backgroundColor: '#ef4565',
          color: '#fffffe',
        },
        colorWarning: {
          backgroundColor: '#f4845f',
          color: '#fffffe',
        },
        colorSuccess: {
          backgroundColor: '#28a745',
          color: '#fffffe',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          '& .MuiTab-root': {
            color: '#5f6c7b',
            fontWeight: 500,
          },
          '& .Mui-selected': {
            color: '#094067',
            fontWeight: 600,
          },
          '& .MuiTabs-indicator': {
            backgroundColor: '#3da9fc',
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#f8f9fa',
          '& .MuiTableCell-head': {
            fontWeight: 600,
            color: '#094067',
          },
        },
      },
    },
  },
});

export default theme;

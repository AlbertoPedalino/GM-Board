import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import App from './App.jsx';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#151411',
      paper: '#211d18',
    },
    primary: {
      main: '#d7ad52',
      contrastText: '#17120d',
    },
    secondary: {
      main: '#70b7a6',
    },
    error: {
      main: '#de675f',
    },
    warning: {
      main: '#d69245',
    },
    success: {
      main: '#58b879',
    },
    text: {
      primary: '#f0e6d4',
      secondary: '#bda98a',
    },
    divider: 'rgba(215, 173, 82, 0.22)',
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: 'Georgia, "Times New Roman", serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
      letterSpacing: 0,
    },
    h2: {
      fontSize: '1.25rem',
      fontWeight: 700,
      letterSpacing: 0,
    },
    button: {
      textTransform: 'none',
      letterSpacing: 0,
      fontWeight: 700,
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(215, 173, 82, 0.18)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          maxWidth: '100%',
          minWidth: 0,
          flexShrink: 1,
        },
        label: {
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          minWidth: 0,
        },
      },
    },
    MuiStack: {
      styleOverrides: {
        root: {
          minWidth: 0,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          minWidth: 0,
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          minWidth: 0,
        },
      },
    },
  },
});

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);

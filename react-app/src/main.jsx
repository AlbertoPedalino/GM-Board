import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import App from './App.jsx';
import { theme } from './theme.js';
import { AuthProvider } from './shared/cloud/auth/AuthProvider.jsx';
import { ToastProvider } from './shared/ui/ToastProvider.jsx';

const basename = import.meta.env.BASE_URL.replace(/\/+$/, '');

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastProvider>
        <BrowserRouter basename={basename}>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  </React.StrictMode>,
);

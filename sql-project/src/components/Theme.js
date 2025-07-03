import { createTheme } from '@mui/material/styles';

export const getTheme = (mode) => {
  return createTheme({
    palette: {
      mode,
      ...(mode === 'dark'
        ? {
          primary: {
              main: '#999999',
            },
            background: {
              default: '#0d0d0d',
              paper: '#1a1a1a',
            },
            text: {
              primary: '#ffffff',
              secondary: '#f44336',
            },
          }
        : {
          primary: {
              main: '#555555',
              contrastText: '#ffffff',
              dark: '#333333',
            },
            background: {
              default: '#ffffff',
              paper: '#999999',
            },
            text: {
              primary: '#000000',
              secondary: '#f44336',
            },
          }),
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
  });
};
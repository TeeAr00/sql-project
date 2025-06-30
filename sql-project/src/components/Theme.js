import { createTheme } from '@mui/material/styles';

export const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            primary: {
              main: '#1976d2',
            },
            background: {
              default: '#fdfdfd',
              paper: '#ffffff',
            },
            text: {
              primary: '#000000',
              secondary: '#555555',
            },
          }
        : {
            primary: {
              main: '#90caf9',
            },
            background: {
              default: '#0d0d0d',
              paper: '#1a1a1a',
            },
            text: {
              primary: '#ffffff',
              secondary: '#bbbbbb',
            },
          }),
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
  });
import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, Button, IconButton,Tooltip } from '@mui/material';
import { Link,useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import ContrastIcon from '@mui/icons-material/Contrast';
import { useThemeToggle } from './ThemeContext';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { useSoundControl } from './SoundContext';

function NavBar() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { toggleTheme } = useThemeToggle();

  const { muted, setMuted } = useSoundControl();

  useEffect(() => {
    localStorage.setItem('muted', muted);
  }, [muted]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const toggleMute = () => setMuted((prev) => !prev);
  
  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        boxShadow: 'none',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
          SQL
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tooltip title={muted ? 'Poista mykistys' : 'Mykistä'}>
            <IconButton
              onClick={toggleMute}
              sx={{
                color: theme.palette.text.primary,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              {muted ? <VolumeOffIcon /> : <VolumeUpIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Vaihda teema">
            <IconButton
              onClick={toggleTheme}
              sx={{
                color: theme.palette.text.primary,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <ContrastIcon />
            </IconButton>
          </Tooltip>
          <Button
            component={Link}
            to="/profile"
            sx={{
              color: theme.palette.text.primary,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            Profiili
          </Button>
          <Button
            onClick={handleLogout}
            sx={{
              color: theme.palette.text.primary,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            Kirjaudu ulos
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;

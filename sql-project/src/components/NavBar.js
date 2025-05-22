import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: '#1e1e2f',
        color: '#ffffff',
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
          SQL Laboratory
        </Typography>
        <Box>
          <Button
            component={Link}
            to="/profile"
            sx={{
              color: '#ffffff',
              '&:hover': {
                backgroundColor: '#2c2c3e',
              },
            }}
          >
            Profile
          </Button>
          <Button
          component={Link}
          to="/login"
            sx={{
              color: '#ffffff',
              '&:hover': {
                backgroundColor: '#2c2c3e',
              },
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;

import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';

function NavBar() {
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
          My App
        </Typography>
        <Box>
          <Button color="inherit">Profile</Button>
          <Button color="inherit">Logout</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;

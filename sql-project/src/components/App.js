import React from 'react';
import { CssBaseline, Box, Toolbar, AppBar, Typography } from '@mui/material';

//Komponentit
import Footer from './Footer';
import NavBar from './NavBar';
import SideBar from './SideBar';


function App() {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" noWrap>
            My App
          </Typography>
        </Toolbar>
      </AppBar>
      <SideBar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Typography paragraph>
          Aula
        </Typography>
      </Box>
    </Box>
  );
}

export default App;

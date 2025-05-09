import React from 'react';
import { CssBaseline, Box, Toolbar, Typography } from '@mui/material';

//Komponentit
import Footer from './Footer';
import NavBar from './NavBar';
import SideBar from './SideBar';


function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      <NavBar />
      <Box sx={{ display: 'flex', flex: 1 }}>
        <SideBar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Typography paragraph>
            Aula
          </Typography>
        </Box>
        <Footer />
      </Box>
    </Box>
  );
}

export default App;

import React from 'react';
import { CssBaseline, Box, Toolbar, Typography } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

//Komponentit
import Footer from './Footer';
import NavBar from './NavBar';
import SideBar from './SideBar';
import Questions from './Questions';
import Profile from './Profile';


function HomePage() {
  return <div>Aula</div>;
}

function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <CssBaseline />
        <NavBar />
        <Box sx={{ display: 'flex', flex: 1 }}>
          <SideBar />
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Toolbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/Questions" element={<Questions />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </Box>
        </Box>
        <Footer />
      </Box>
    </Router>
  );
}

export default App;
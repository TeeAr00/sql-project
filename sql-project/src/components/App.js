import React from 'react';
import { CssBaseline, Box, Toolbar, Typography } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

//Komponentit
import Footer from './Footer';
import NavBar from './NavBar';
import SideBar from './SideBar';
import Questions from './Questions';
import Profile from './Profile';
import Login from './Login';
import Register from './Register';
import Auth from './Auth';

//Databasen testaukseen
function HomePage() {
  const [persons, setPersons] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/testRoute')
      .then((res) => res.json())
      .then((data) => setPersons(data))
      .catch((err) => console.error('Virhe haettaessa henkilöitä:', err));
  }, []);

  return (
    <div>
      <h2>Aula</h2>
      <ul>
        {persons.map((person) => (
          <li key={person.id}>{person.firstname}</li>
        ))}
      </ul>
    </div>
  );
}

function MainLayout({ children }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      <NavBar />
      <Box sx={{ display: 'flex', flex: 1 }}>
        <SideBar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          {children}
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/home" replace />} />

        <Route
          path="/home"
          element={
            <Auth>
              <MainLayout>
                <HomePage />
              </MainLayout>
            </Auth>
          }
        />
        <Route
          path="/questions"
          element={
            <Auth>
              <MainLayout>
                <Questions />
              </MainLayout>
            </Auth>
          }
        />
        <Route
          path="/profile"
          element={
            <Auth>
              <MainLayout>
                <Profile />
              </MainLayout>
            </Auth>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

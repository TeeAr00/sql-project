import React from 'react';
import { CssBaseline, Box, Toolbar, Typography } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

//Komponentit
import Footer from './Footer';
import NavBar from './NavBar';
import SideBar from './SideBar';
import Questions from './Questions';
import Profile from './Profile';
import Login from './Login';
import Register from './Register';
import Auth from './Auth';
import NewTests from './NewTests';
import EditTestSets from './EditTestSets';
import Scores from './Scores';
import SandboxTests from './SandboxTests';
import Exercises2 from './Exercises2';
import CreateTests from './CreateTests';
import NewTestsScramble from './NewTestsScramble';


//Databasen testaukseen + roolin varmennuksen testaus
function HomePage() {
  const [persons, setPersons] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      if (decoded.role === 'admin') {
        setIsAdmin(true);

        fetch('http://localhost:5000/api/testRoute', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
          .then((res) => {
            if (!res.ok) throw new Error('Unauthorized');
            return res.json();
          })
          .then((data) => setPersons(data))
          .catch((err) => console.error('Virhe haettaessa henkilöitä:', err));
      }
    } catch (error) {
      console.error('Invalid token:', error);
    }
  }, []);


  return (
    <div>
      <ul>
        <h1>SQL-harjoitustila</h1>
        <h2>Ominaisuudet</h2>
        <h3>Käyttäjätilit:</h3>
        <p>Rekisteröituminen, kirjautuminen, profiilin ja sivustoasetusten hallinta.</p>
        <h3>SQL-harjoitustila:</h3>
        <p>Testaa omia SQL-kyselyitä valmiista tietokannasta.</p>
        <h3>Tehtäväpaketit:</h3>
        <p>Käyttäjä voi suorittaa valmiita tehtäväpaketteja sekä seurata omaa edistymistään niissä.</p>
        <h3>Admin-toiminnot:</h3>
        <p>Tehtäväpakettien luominen, muokkaaminen ja poistaminen</p>
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
          path="/exercises2"
          element={
            <Auth>
              <MainLayout>
                <Exercises2 />
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
        <Route
          path="/newTests"
          element={
            <Auth>
              <MainLayout>
                <NewTests />
              </MainLayout>
            </Auth>
          }
        />
        <Route
          path="/editSets"
          element={
            <Auth>
              <MainLayout>
                <EditTestSets />
              </MainLayout>
            </Auth>
          }
        />
        <Route
          path="/scores"
          element={
            <Auth>
              <MainLayout>
                <Scores />
              </MainLayout>
            </Auth>
          }
        />
        <Route
          path="/sandboxTests"
          element={
            <Auth>
              <MainLayout>
                <SandboxTests />
              </MainLayout>
            </Auth>
          }
        />
        <Route
          path="/createTests"
          element={
            <Auth>
              <MainLayout>
                <CreateTests />
              </MainLayout>
            </Auth>
          }
        />
        <Route
          path="/newTestsScramble"
          element={
            <Auth>
              <MainLayout>
                <NewTestsScramble />
              </MainLayout>
            </Auth>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

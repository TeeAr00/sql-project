import React from 'react';
import { CssBaseline, Box, Toolbar, Typography } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';

//Komponentit
import Footer from './Footer';
import NavBar from './NavBar';
import SideBar from './SideBar';
import Questions from './Questions';
import Profile from './Profile';
import Login from './Login';

//databasen testausta varten tehty haku, poistuu
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
              <Route path="/Login" element={<Login />} />
              <Route path="/Questions" element={<Questions />} />
              <Route path="/Profile" element={<Profile />} />
            </Routes>
          </Box>
        </Box>
        <Footer />
      </Box>
    </Router>
  );
}

export default App;
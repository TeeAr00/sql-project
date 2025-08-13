import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
  if (password !== confirmPassword) {
    alert("Salasanat eivät täsmää");
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || 'Virhe rekisteröinnissä');
      return;
    }

    navigate('/');
  } catch (error) {
    console.error('Virhe rekisteröisnnissä:', error);
    alert('Jotain meni pieleen rekisteröinnissä');
  }
};

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Paper elevation={6} sx={{ p: 4, width: 300, bgcolor: 'background.default', color: 'text.primary' }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Rekisteröinti
        </Typography>
        <TextField
          label="Käyttäjänimi"
          variant="filled"
          fullWidth
          sx={{ mb: 2 }}
          InputProps={{ sx: { bgcolor: 'background.default', color: 'text.primary' } }}
          InputLabelProps={{ sx: { color: 'text.primary' } }}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Sähköposti"
          variant="filled"
          fullWidth
          sx={{ mb: 2 }}
          InputProps={{ sx: { bgcolor: 'background.default', color: 'text.primary' } }}
          InputLabelProps={{ sx: { color: 'text.primary' } }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Salasana"
          type="password"
          variant="filled"
          fullWidth
          sx={{ mb: 2 }}
          InputProps={{ sx: { bgcolor: 'background.default', color: 'text.primary' } }}
          InputLabelProps={{ sx: { color: 'text.primary' } }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          label="Salasana uudestaan"
          type="password"
          variant="filled"
          fullWidth
          sx={{ mb: 3 }}
          InputProps={{ sx: { bgcolor: 'background.default', color: 'text.primary' } }}
          InputLabelProps={{ sx: { color: 'text.primary' } }}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button variant="contained" fullWidth onClick={handleRegister}sx={{ mb: 1 }}>
          Rekistedöidy
        </Button>
        <Button variant="contained" fullWidth onClick={() => navigate('/login')}>
          Kirjaudu
        </Button>
      </Paper>
    </Box>
  );
}

export default Register;

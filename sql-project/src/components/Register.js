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
    alert("Passwords don't match");
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
      alert(data.message || 'Registration failed');
      return;
    }

    navigate('/');
  } catch (error) {
    console.error('Registration error:', error);
    alert('Something went wrong during registration');
  }
};

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: '#1e1e2f',
      }}
    >
      <Paper elevation={6} sx={{ p: 4, width: 300, bgcolor: '#2c2c3e', color: '#fff' }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Register
        </Typography>
        <TextField
          label="Username"
          variant="filled"
          fullWidth
          sx={{ mb: 2 }}
          InputProps={{ sx: { bgcolor: '#3a3a50', color: '#fff' } }}
          InputLabelProps={{ sx: { color: '#aaa' } }}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Email"
          variant="filled"
          fullWidth
          sx={{ mb: 2 }}
          InputProps={{ sx: { bgcolor: '#3a3a50', color: '#fff' } }}
          InputLabelProps={{ sx: { color: '#aaa' } }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          variant="filled"
          fullWidth
          sx={{ mb: 2 }}
          InputProps={{ sx: { bgcolor: '#3a3a50', color: '#fff' } }}
          InputLabelProps={{ sx: { color: '#aaa' } }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          label="Password again"
          type="password"
          variant="filled"
          fullWidth
          sx={{ mb: 3 }}
          InputProps={{ sx: { bgcolor: '#3a3a50', color: '#fff' } }}
          InputLabelProps={{ sx: { color: '#aaa' } }}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button variant="contained" fullWidth onClick={handleRegister}sx={{ mb: 1 }}>
          Register
        </Button>
        <Button variant="text" fullWidth onClick={() => navigate('/login')} sx={{ color: '#aaa' }}>
          Login
        </Button>
      </Paper>
    </Box>
  );
}

export default Register;

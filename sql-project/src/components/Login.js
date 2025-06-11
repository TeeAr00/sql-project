import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      if (response.status === 400) {
          alert('Check your username and password');
        } else {
          alert('Login failed. Please try again.');
        }
      return;
    }

    const data = await response.json();

    if (data.token) {
      navigate('/Home');
    } else {
      console.error('No token received from login');
    }
  } catch (error) {
    console.error('Error during login:', error);
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
          Login
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
          label="Password"
          type="password"
          variant="filled"
          fullWidth
          sx={{ mb: 3 }}
          InputProps={{ sx: { bgcolor: '#3a3a50', color: '#fff' } }}
          InputLabelProps={{ sx: { color: '#aaa' } }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" fullWidth onClick={handleLogin}sx={{ mb: 1 }}>
          Login
        </Button>
        <Button variant="text" fullWidth onClick={() => navigate('/register')} sx={{ color: '#aaa' }}>
          Register
        </Button>
      </Paper>
    </Box>
  );
}

export default LoginPage;

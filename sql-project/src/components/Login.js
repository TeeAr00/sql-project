import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();

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
      localStorage.setItem('authToken', data.token);
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
        bgcolor: 'background.default',
      }}
    >
      <Paper elevation={6} sx={{ p: 4, width: 300, bgcolor: 'background.default', color: '#fff' }}>
        <Typography variant="h5" sx={{ mb: 2,color: theme.palette.text.primary,
          borderColor: theme.palette.text.primary, }}>
          Login
        </Typography>
        <TextField
          label="Username"
          variant="filled"
          fullWidth
          sx={{ mb: 2 }}
          InputProps={{ sx: { bgcolor: 'background.default', color: 'text.primary' } }}
          InputLabelProps={{ sx: { color: 'text.primary' } }}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          variant="filled"
          fullWidth
          sx={{ mb: 3 }}
          InputProps={{ sx: { bgcolor: 'background.default', color: 'text.primary' } }}
          InputLabelProps={{ sx: { color: 'text.primary' } }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" fullWidth onClick={handleLogin}sx={{ mb: 1 }}>
          Login
        </Button>
        <Button variant="contained" fullWidth onClick={() => navigate('/register')}>
          Register
        </Button>
      </Paper>
    </Box>
  );
}

export default LoginPage;

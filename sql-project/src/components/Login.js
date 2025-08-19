import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';

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
          alert('Tarkasta käyttäjänimi ja salasana');
        } else {
          alert('Virhe kirjautumisessa. Kokeile uudestaan.');
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
    console.error('Virhe kirjautumisessa:', error);
  }
};

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: theme.palette.background.default,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: '100%', maxWidth: 360 }}
      >
        <Paper elevation={6} sx={{ p: 4, borderradius: 4, width: 300, bgcolor: theme.palette.background.default }}>
          <Typography variant="h5" gutterBottom sx={{
            mb: 2, fontweight: 'bold',
            textAlign: "center",
            color: theme.palette.text.primary,
            borderColor: theme.palette.text.primary,
          }}>
            Kirjautuminen
          </Typography>
          <TextField
            label="Käyttäjänimi"
            variant="filled"
            fullWidth
            sx={{ mb: 2 }}
            InputProps={{ sx: { bgcolor: theme.palette.background.default, color: theme.palette.text.primary } }}
            InputLabelProps={{ sx: { color: theme.palette.text.primary } }}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Salasana"
            type="password"
            variant="filled"
            fullWidth
            sx={{ mb: 3 }}
            InputProps={{ sx: { bgcolor: theme.palette.background.default, color: theme.palette.text.primary } }}
            InputLabelProps={{ sx: { color: theme.palette.text.primary } }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            variant="outlined"
            fullWidth
            onClick={handleLogin}
            sx={{
              mb: 2,
              py: 1.2,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 'bold',
            }}
          >
            Kirjaudu
          </Button>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => navigate('/register')}
            sx={{
              mb: 2,
              py: 1.2,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 'bold',
            }}
          >
            Rekisteröinti
          </Button>
        </Paper>
      </motion.div>
    </Box>
  );
}

export default LoginPage;

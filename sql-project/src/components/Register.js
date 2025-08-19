import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();

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
            Rekisteröinti
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
            label="Sähköposti"
            variant="filled"
            fullWidth
            sx={{ mb: 2 }}
            InputProps={{ sx: { bgcolor: theme.palette.background.default, color: theme.palette.text.primary } }}
            InputLabelProps={{ sx: { color: theme.palette.text.primary } }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Salasana"
            type="password"
            variant="filled"
            fullWidth
            sx={{ mb: 2 }}
            InputProps={{ sx: { bgcolor: theme.palette.background.default, color: theme.palette.text.primary } }}
            InputLabelProps={{ sx: { color: theme.palette.text.primary } }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            label="Salasana uudestaan"
            type="password"
            variant="filled"
            fullWidth
            sx={{ mb: 3 }}
            InputProps={{ sx: { bgcolor: theme.palette.background.default, color: theme.palette.text.primary } }}
            InputLabelProps={{ sx: { color: theme.palette.text.primary } }}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button variant="outlined" fullWidth onClick={handleRegister}
            sx={{
              mb: 2,
              py: 1.2,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 'bold',
            }}>
            Rekistedöidy
          </Button>
          <Button variant="outlined" fullWidth onClick={() => navigate('/login')}
            sx={{
              mb: 2,
              py: 1.2,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 'bold',
            }}>
            Kirjaudu
          </Button>
        </Paper>
      </motion.div>
    </Box>
  );
}

export default Register;

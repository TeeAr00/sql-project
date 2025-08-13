import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';
import { useThemeToggle } from './ThemeContext';
import { useTheme } from '@mui/material/styles';

function Profile() {
  const [userData, setUserData] = useState({ username: '', email: '' });   //Käyttäjän tiedot backendistä
  
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);        // sposti ja salasana lomakkeet

  const [oldEmail, setOldEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const { mode, toggleTheme } = useThemeToggle();
  const theme = useTheme();

  //Käyttäjätietojen haku
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:5000/api/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Backend response:', errorText);
          throw new Error('Virhe haettaessa profiili tietoja');
        }

        const data = await response.json();
        setUserData({ username: data.username, email: data.email });
      } catch (error) {
        console.error('Virhe:', error);
      }
    };

    fetchProfile();
  }, []);

  //Sähköpostin kenttien tarkastus ja sähköpostin vaihto
  const handleEmailChange = async () => {
    if (oldEmail !== userData.email) {
      alert('Vanha sähköposti ei täsmää.');
      return;
    }
    if (!newEmail || !emailPassword) {
      alert('Täytä kaikki kentät.');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/profile/change-email', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newEmail }),
      });

      if (!response.ok) {
        const errData = await response.json();
        alert(errData.message || 'Virhe päivittäessä sähköpostia.');
        return;
      }

      alert('Sähköposti vaihdettu!');
      setUserData(prev => ({ ...prev, email: newEmail }));
      setShowEmailForm(false);
      setOldEmail('');
      setNewEmail('');
      setEmailPassword('');
    } catch (error) {
      console.error('Virhe päivittäessä sähköpostia:', error);
      alert('Virhe.');
    }
  };

  //Salasanan kenttien tarkastus ja salasanan vaihto
  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword) {
      alert('Täytä molemmat salasanakentät.');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/profile/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!response.ok) {
        const errData = await response.json();
        alert(errData.message || 'Virhe päivittäessä salasanaa.');
        return;
      }

      alert('Salasana vaihdettu!');
      setShowPasswordForm(false);
      setCurrentPassword('');
      setNewPassword('');
    } catch (error) {
      console.error('Virhe päivittäessä salasanaa:', error);
      alert('Virhe.');
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: 'auto', }}>
      <Typography variant="h6" gutterBottom>
        Tumma/Vaalea teema
      </Typography>
      <Button
        variant="outlined"
        onClick={toggleTheme}
        sx={{
          mb: 3,
          color: theme.palette.text.primary,
          borderColor: theme.palette.text.primary,
          '&:hover': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
          },
        }}
      >
        Vaihda teema
      </Button>

      <Typography variant="h4" gutterBottom>
        Profiili
      </Typography>

      <Typography variant="h6" gutterBottom>
        Profiilin tiedot
      </Typography>

      <TextField
        fullWidth
        label="Käyttäjänimi"
        margin="normal"
        value={userData.username}
        disabled
        variant="outlined"
        sx={{
          '& .MuiInputLabel-root': {
            color: theme.palette.text.secondary,
          },
          '& .MuiInputLabel-root.Mui-disabled': {
          color: theme.palette.text.primary,
          },
          '& .MuiInputBase-input.Mui-disabled': {
            WebkitTextFillColor: theme.palette.text.primary,
          },
          '& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.text.primary,
          },
        }}
      />
      <TextField
        fullWidth
        label="Sähköposti"
        margin="normal"
        value={userData.email}
        disabled
        variant="outlined"
        sx={{
          '& .MuiInputLabel-root': {
            color: theme.palette.text.secondary
          },
          '& .MuiInputLabel-root.Mui-disabled': {
          color: theme.palette.text.primary,
          },
          '& .MuiInputBase-input.Mui-disabled': {
            WebkitTextFillColor: theme.palette.text.primary,
          },
          '& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.text.primary,
          },
        }}
      />

      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button variant="outlined" onClick={() => {
          setShowEmailForm(!showEmailForm);
          setShowPasswordForm(false);
        }}
        sx={{
          mb: 3,
          color: theme.palette.text.primary,
          borderColor: theme.palette.text.primary,
        }}
        >
          Vaihda sähköposti
        </Button>
        <Button variant="outlined" onClick={() => {
          setShowPasswordForm(!showPasswordForm);
          setShowEmailForm(false);
        }}
        sx={{
          mb: 3,
          color: theme.palette.text.primary,
          borderColor: theme.palette.text.primary,
        }}
        >
          Vaihda salasana
        </Button>
      </Box>

      {showEmailForm && (
        <Paper sx={{ mt: 3, p: 3}}>
          <Typography variant="h6" gutterBottom>Vaihda sähköposti</Typography>
          <TextField
            fullWidth
            label="Nykyinen sähköpsoti"
            margin="normal"
            value={oldEmail}
            onChange={e => setOldEmail(e.target.value)}
            autoComplete="off"
            sx={{
              '& .MuiInputLabel-root': {
                color: theme.palette.text.primary,
              },
              '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.text.primary,
              },
              '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
              },
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
                borderWidth: '2px',
              },
              '& .MuiInputBase-input': {
                color: theme.palette.text.primary,
              },
            }}
          />
          <TextField
            fullWidth
            label="Uusi sähköposti"
            margin="normal"
            value={newEmail}
            onChange={e => setNewEmail(e.target.value)}
            autoComplete="off"
            sx={{
              '& .MuiInputLabel-root': {
                color: theme.palette.text.primary,
              },
              '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.text.primary,
              },
              '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
              },
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
                borderWidth: '2px',
              },
              '& .MuiInputBase-input': {
                color: theme.palette.text.primary,
              },
            }}
          />
          <TextField
            fullWidth
            label="Salasana"
            type="password"
            margin="normal"
            value={emailPassword}
            onChange={e => setEmailPassword(e.target.value)}
            autoComplete="off"
            sx={{
              '& .MuiInputLabel-root': {
                color: theme.palette.text.primary,
              },
              '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.text.primary,
              },
              '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
              },
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
                borderWidth: '2px',
              },
              '& .MuiInputBase-input': {
                color: theme.palette.text.primary,
              },
            }}
          />
          <Button variant="outlined" sx={{
          mb: 3,
          color: theme.palette.text.primary,
          borderColor: theme.palette.text.primary,
        }} onClick={handleEmailChange}>
            Päivitä sähköposti
          </Button>
        </Paper>
      )}

      {showPasswordForm && (
        <Paper sx={{ mt: 3, p: 3}}>
          <Typography variant="h6" gutterBottom>Vaihda salasana</Typography>
          <TextField
            fullWidth
            label="Nykyinen salalsana"
            type="password"
            margin="normal"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            autoComplete="off"
            sx={{
              '& .MuiInputLabel-root': {
                color: theme.palette.text.primary,
              },
              '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.text.primary,
              },
              '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
              },
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
                borderWidth: '2px',
              },
              '& .MuiInputBase-input': {
                color: theme.palette.text.primary,
              },
            }}
          />
          <TextField
            fullWidth
            label="Uusi salasana"
            type="password"
            margin="normal"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            autoComplete="off"
            sx={{
              '& .MuiInputLabel-root': {
                color: theme.palette.text.primary,
              },
              '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.text.primary,
              },
              '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
              },
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
                borderWidth: '2px',
              },
              '& .MuiInputBase-input': {
                color: theme.palette.text.primary,
              },
            }}
          />
          <Button variant="outlined" sx={{
          mb: 3,
          color: theme.palette.text.primary,
          borderColor: theme.palette.text.primary,
        }} onClick={handlePasswordChange}>
            Päivitä salasana
          </Button>
        </Paper>
      )}
    </Box>
  );
}

export default Profile;

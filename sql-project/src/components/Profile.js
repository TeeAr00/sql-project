import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';
import { useThemeToggle } from './ThemeContext';

function Profile() {
  const [userData, setUserData] = useState({ username: '', email: '' });
  
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [oldEmail, setOldEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const { mode, toggleTheme } = useThemeToggle();

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
          throw new Error('Failed to fetch profile data');
        }

        const data = await response.json();
        setUserData({ username: data.username, email: data.email });
      } catch (error) {
        console.error('Profile fetch error:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleEmailChange = async () => {
    if (oldEmail !== userData.email) {
      alert('Old email does not match your current email.');
      return;
    }
    if (!newEmail || !emailPassword) {
      alert('Please fill all fields.');
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
        alert(errData.message || 'Failed to update email.');
        return;
      }

      alert('Email updated successfully!');
      setUserData(prev => ({ ...prev, email: newEmail }));
      setShowEmailForm(false);
      setOldEmail('');
      setNewEmail('');
      setEmailPassword('');
    } catch (error) {
      console.error('Email update error:', error);
      alert('Something went wrong.');
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword) {
      alert('Please fill all password fields.');
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
        alert(errData.message || 'Failed to update password.');
        return;
      }

      alert('Password updated successfully!');
      setShowPasswordForm(false);
      setCurrentPassword('');
      setNewPassword('');
    } catch (error) {
      console.error('Password update error:', error);
      alert('Something went wrong.');
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Dark/Light Theme
      </Typography>
      <Button
        variant="outlined"
        onClick={toggleTheme}
        sx={{ mb: 3 }}
      >
        Switch to {mode === 'light' ? 'Dark' : 'Light'} Mode
      </Button>

      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>

      <Typography variant="body1" sx={{ mb: 2 }}>
        Profile information
      </Typography>

      <TextField fullWidth label="Username" margin="normal" value={userData.username} disabled />
      <TextField fullWidth label="Email" margin="normal" value={userData.email} disabled />

      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button variant="contained" onClick={() => {
          setShowEmailForm(!showEmailForm);
          setShowPasswordForm(false);
        }}>
          Change Email
        </Button>
        <Button variant="contained" onClick={() => {
          setShowPasswordForm(!showPasswordForm);
          setShowEmailForm(false);
        }}>
          Change Password
        </Button>
      </Box>

      {/* sähköposti lomake */}
      {showEmailForm && (
        <Paper sx={{ mt: 3, p: 3, bgcolor: '#f5f5f5' }}>
          <Typography variant="h6" gutterBottom>Change Email</Typography>
          <TextField
            fullWidth
            label="Current Email"
            margin="normal"
            value={oldEmail}
            onChange={e => setOldEmail(e.target.value)}
            autoComplete="off"
          />
          <TextField
            fullWidth
            label="New Email"
            margin="normal"
            value={newEmail}
            onChange={e => setNewEmail(e.target.value)}
            autoComplete="off"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={emailPassword}
            onChange={e => setEmailPassword(e.target.value)}
            autoComplete="off"
          />
          <Button variant="contained" sx={{ mt: 2 }} onClick={handleEmailChange}>
            Update Email
          </Button>
        </Paper>
      )}

      {/* salasanan lomake */}
      {showPasswordForm && (
        <Paper sx={{ mt: 3, p: 3, bgcolor: '#f5f5f5' }}>
          <Typography variant="h6" gutterBottom>Change Password</Typography>
          <TextField
            fullWidth
            label="Current Password"
            type="password"
            margin="normal"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            autoComplete="off"
          />
          <TextField
            fullWidth
            label="New Password"
            type="password"
            margin="normal"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            autoComplete="off"
          />
          <Button variant="contained" sx={{ mt: 2 }} onClick={handlePasswordChange}>
            Update Password
          </Button>
        </Paper>
      )}
    </Box>
  );
}

export default Profile;

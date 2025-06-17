import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';

function Profile() {
  const [userData, setUserData] = useState({ username: '', email: '' });

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
        console.log(data.username);
      } catch (error) {
        console.error('Profile fetch error:', error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>

      <Typography variant="body1" sx={{ mb: 2 }}>
        Profile information
      </Typography>

      <TextField
        fullWidth
        label="Username"
        margin="normal"
        value={userData.username}
        disabled
      />
      <TextField
        fullWidth
        label="Email"
        margin="normal"
        value={userData.email}
        disabled
      />

      <Button variant="contained" sx={{ mt: 2 }} disabled>
        Confirm
      </Button>
    </Box>
  );
}

export default Profile;

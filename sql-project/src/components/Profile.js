import React from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';

function Profile() {
  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>

      <Typography variant="body1" sx={{ mb: 2 }}>
        Profile information
      </Typography>

      <TextField fullWidth label="Name" margin="normal" disabled />
      <TextField fullWidth label="Email" margin="normal" disabled />

      <Button variant="contained" sx={{ mt: 2 }} disabled>
        Confirm
      </Button>
    </Box>
  );
}

export default Profile;
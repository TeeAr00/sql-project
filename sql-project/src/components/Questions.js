import React from 'react';
import { Typography, Box, Button } from '@mui/material';

function Questions() {
  return (
    <Box sx={{ textAlign: 'center', mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Questions
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 4 }}>
        <Button variant="contained" color="primary" size="large" sx={{ px: 5, py: 2 }}>
          Testi 1
        </Button>
        <Button variant="contained" color="secondary" size="large" sx={{ px: 5, py: 2 }}>
          Testi 2
        </Button>
      </Box>
    </Box>
  );
}

export default Questions;

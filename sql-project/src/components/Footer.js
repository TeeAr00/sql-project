import React from 'react';
import { Box, Typography } from '@mui/material';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 3,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.primary.main,
        textAlign: 'center'
      }}
    >
      <Typography variant="body2" color="text.primary">
      2025 SQL harjoittelutyökalu
      </Typography>
    </Box>
  );
}

export default Footer;

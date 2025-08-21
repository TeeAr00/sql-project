import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

//Välisivujo, josta valitaan kummanlaisia tehtäviä ollaan luomassa
function CreateTests() {

    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.role !== 'admin') {
                    navigate('/Home');
                } else {
                    setLoading(false);
                }
            } catch (err) {
                console.error('Invalid token:', err);
                navigate('/Home');
            }
        } else {
            navigate('/Home');
        }
    }, [navigate]);

    if (loading) return null;

  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>Luo uusi harjoitus</Typography>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 3 }}>
        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate('/newTests')}
        >
          Tehtäväsetti
        </Button>
        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate('/NewTestsScramble')}
        >
          Sanajärjestely
        </Button>
      </Box>
    </Box>
  );
}

export default CreateTests;

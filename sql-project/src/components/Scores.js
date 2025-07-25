import React, { useEffect, useState } from 'react';
import { Typography, Box, Paper, CircularProgress, List, ListItem, ListItemText } from '@mui/material';

function Scores() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchScores() {
    const token = localStorage.getItem('authToken');
      try {
        const res = await fetch('http://localhost:5000/api/scores', {
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
            }
        });
        const data = await res.json();
        setScores(data);
      } catch (err) {
        console.error('Virhe ladattaessa tuloksia:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchScores();
  }, []);

  if (loading) {
    return <CircularProgress sx={{ mt: 5, display: 'block', mx: 'auto' }} />;
  }

  return (
    <Box sx={{ mt: 5, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Suoritukset
      </Typography>

      {scores.length === 0 ? (
        <Typography variant="body1">Ei suorituksia vielä.</Typography>
      ) : (
        <Paper sx={{ maxWidth: 600, mx: 'auto', mt: 3, p: 2 }}>
          <List>
            {scores.map((score) => (
              <ListItem key={score.id} divider>
                <ListItemText
                  primary={`${score.test_set_name} - ${Number(score.score).toFixed(2)}%`}
                  secondary={new Date(score.scored_at).toLocaleString('fi-FI')}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}

export default Scores;

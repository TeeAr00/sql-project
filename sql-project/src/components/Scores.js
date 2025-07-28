import React, { useEffect, useState } from 'react';
import {
  Typography, Box, Paper, CircularProgress, List, ListItem, ListItemText,
  Select, MenuItem, Checkbox, ListItemIcon
} from '@mui/material';

function Scores() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTests, setSelectedTests] = useState([]);
  const [sortOption, setSortOption] = useState('score_desc');

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

  const uniqueTestNames = [...new Set(scores.map(score => score.test_set_name))];

  const filteredScores = scores.filter(score =>
    selectedTests.length === 0 || selectedTests.includes(score.test_set_name)
  );

  const sortedScores = [...filteredScores].sort((a, b) => {
    if (sortOption === 'score_asc') return a.score - b.score;
    if (sortOption === 'score_desc') return b.score - a.score;
    if (sortOption === 'name_asc') return a.test_set_name.localeCompare(b.test_set_name);
    if (sortOption === 'name_desc') return b.test_set_name.localeCompare(a.test_set_name);
    if (sortOption === 'date_asc') return new Date(a.scored_at) - new Date(b.scored_at);
    if (sortOption === 'date_desc') return new Date(b.scored_at) - new Date(a.scored_at);
    return 0;
  });

  if (loading) {
    return <CircularProgress sx={{ mt: 5, display: 'block', mx: 'auto' }} />;
  }

  return (
    <Box sx={{ mt: 5, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Suoritukset
      </Typography>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="body1" sx={{ mb: 1 }}>Suodata:</Typography>
          <Select
            multiple
            value={selectedTests}
            onChange={(e) => setSelectedTests(e.target.value)}
            renderValue={(selected) => selected.join(', ')}
            sx={{ minWidth: 200 }}
          >
            {uniqueTestNames.map((name) => (
              <MenuItem key={name} value={name}>
                <Checkbox checked={selectedTests.includes(name)} />
                <ListItemText primary={name} />
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Box>
          <Typography variant="body1" sx={{ mb: 1 }}>Järjestä:</Typography>
          <Select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="score_desc">Pisteet: Suurin ensin</MenuItem>
            <MenuItem value="score_asc">Pisteet: Pienin ensin</MenuItem>
            <MenuItem value="name_asc">Testin nimi: A-Ö</MenuItem>
            <MenuItem value="name_desc">Testin nimi: Ö-A</MenuItem>
            <MenuItem value="date_desc">Päivämäärä: Uusin ensin</MenuItem>
            <MenuItem value="date_asc">Päivämäärä: Vanhin ensin</MenuItem>
          </Select>
        </Box>
      </Box>

      {sortedScores.length === 0 ? (
        <Typography variant="body1" sx={{ mt: 3 }}>Ei suorituksia valituilla suodattimilla.</Typography>
      ) : (
        <Paper sx={{ maxWidth: 600, mx: 'auto', mt: 3, p: 2 }}>
          <List>
            {sortedScores.map((score) => (
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

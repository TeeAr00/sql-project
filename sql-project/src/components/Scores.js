import React, { useEffect, useState } from 'react';
import {
  Typography, Box, Paper, CircularProgress, List, ListItem, ListItemText,
  Select, MenuItem, Checkbox, Button, Collapse
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { LineChart } from '@mui/x-charts/LineChart';

function Scores() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTests, setSelectedTests] = useState([]);
  const [sortOption, setSortOption] = useState('date_desc');  //Järjestyksen asetus
  const [openChartId, setOpenChartId] = useState(null);

  //Pisteiden haku
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

  //Listat eri tehtäväsettien nimistä (vaihdetaan idn perusteella, jos sattuu olemaan kaksi samannimistä settiä)
  const uniqueTestNames = [...new Set(scores.map(score => score.test_set_name))];

  //Suodatetut pisteet
  const filteredScores = scores.filter(score =>
    selectedTests.length === 0 || selectedTests.includes(score.test_set_name)
  );

  //tulosten järjestämisen valinnat
  const sortedScores = [...filteredScores].sort((a, b) => {
    if (sortOption === 'score_asc') return a.score - b.score;
    if (sortOption === 'score_desc') return b.score - a.score;
    if (sortOption === 'name_asc') return a.test_set_name.localeCompare(b.test_set_name);
    if (sortOption === 'name_desc') return b.test_set_name.localeCompare(a.test_set_name);
    if (sortOption === 'date_asc') return new Date(a.scored_at) - new Date(b.scored_at);
    if (sortOption === 'date_desc') return new Date(b.scored_at) - new Date(a.scored_at);
    return 0;
  });

  //tulosten seurannan kaavion näyttö
  const toggleChart = (scoreId) => {
    setOpenChartId(prev => prev === scoreId ? null : scoreId);
  };

  // 5 edellistä testiä kaavioon
  const getLastScoresForTest = (testSetName) => {
    const testScores = scores
      .filter(s => s.test_set_name === testSetName)
      .sort((a, b) => new Date(a.scored_at) - new Date(b.scored_at));
    return testScores.slice(-5);
  };

  if (loading) {
    return <CircularProgress sx={{ mt: 5, display: 'block', mx: 'auto' }} />;
  }

  return (
    <Box sx={{ mt: 5, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Suoritukset
      </Typography>
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
        {/* Tehtäväsettien suodatus */}
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
          {/* tehtäväsettien järjestäminen */}
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
            {sortedScores.map((score) => {
              const relatedScores = getLastScoresForTest(score.test_set_name);
              const chartData = relatedScores.map((s) => ({
                score: Math.round(s.score),
                label: new Date(s.scored_at).toLocaleDateString('fi-FI'),
              }));


              return (
                <React.Fragment key={score.id}>
                  <ListItem divider sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <ListItemText
                      primary={`${score.test_set_name} - ${Number(score.score).toFixed(2)}%`}
                      secondary={new Date(score.scored_at).toLocaleString('fi-FI')}
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => toggleChart(score.id)}
                      endIcon={openChartId === score.id ? <ExpandLess /> : <ExpandMore />}
                    >
                      Näytä edistyminen
                    </Button>
                  </ListItem>

                  <Collapse in={openChartId === score.id} timeout="auto" unmountOnExit>
                    <Box sx={{ my: 2 }}>
                      {relatedScores.length <= 1 ? (
                        <Typography variant="body2" color="text.secondary">
                          Ei tarpeeksi suorituksia
                        </Typography>
                      ) : (
                        <LineChart
                          height={300}
                          series={[{
                            data: chartData.map(item => item.score),
                            color: '#1976d2',
                          }]}
                          xAxis={[{
                            scaleType: 'band',
                            data: chartData.map((_, i) => i + 1),
                            ticks: chartData.map((_, i) => i + 1),
                            format: () => '',
                            label: '',
                          }]}
                          yAxis={[{
                            min: 0,
                            max: 100,
                            label: 'Pisteet (%)',
                          }]}
                        />
                      )}
                    </Box>
                  </Collapse>
                </React.Fragment>
              );
            })}
          </List>
        </Paper>
      )}
    </Box>
  );
}

export default Scores;

import React, { useEffect, useState } from 'react';
import { Typography, Box, Button, TextField, Paper, CircularProgress } from '@mui/material';

//Testauksen vuoksi tänne psukettu kaikki, myöhemmin laitetaan omiin osioihin.

function Questions() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [userQuery, setUserQuery] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Hae harjoitukset bäkkäristä
  useEffect(() => {
    async function fetchExercises() {
      try {
        const res = await fetch('http://localhost:5000/api/exercises');
        const data = await res.json();
        setExercises(data);
      } catch (err) {
        console.error('Virhe haettaessa harjoituksia:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchExercises();
  }, []);

  // Hae valitun harjoituksen tiedot
  async function selectExercise(exerciseId) {
    setFeedback(null);
    setUserQuery('');
    setShowHint(false);

    try {
      const res = await fetch(`http://localhost:5000/api/exercises/${exerciseId}`);
      const data = await res.json();
      setSelectedExercise(data);
    } catch (err) {
      console.error('Virhe haettaessa harjoitusta:', err);
    }
  }

  //  käyttäjän kysely bäkkärille tarkistettavaksi
  async function handleSubmit() {
    if (!userQuery.trim() || !selectedExercise) return;

    try {
      const res = await fetch(`http://localhost:5000/api/exercises/${selectedExercise.id}/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userQuery }),
      });
      const data = await res.json();

      setFeedback(data.correct ? ' Oikein!' : ' Tarkista kyselysi');
    } catch (err) {
      console.error('Virhe tarkistuksessa:', err);
      setFeedback(' Virhe tarkistuksessa');
    }
  }

  if (loading) return <CircularProgress sx={{ mt: 5, display: 'block', mx: 'auto' }} />;

  if (!selectedExercise) {
    // Näytä lista harjoituksista
    return (
      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          Exercises
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap', mt: 4 }}>
          {exercises.map((ex) => (
            <Button
              key={ex.id}
              variant="contained"
              size="large"
              sx={{ px: 5, py: 2, minWidth: 150 }}
              onClick={() => selectExercise(ex.id)}
            >
              {`Question ${ex.id}`}
            </Button>
          ))}
        </Box>
      </Box>
    );
  }

  // Näytä valittu harjoitus ja siitää aukeaa lomake
  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 5, textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom>
        Tehtävä:
      </Typography>
      <Typography variant="body1" gutterBottom>
        {selectedExercise.description}
      </Typography>

      <TextField
        label="Kirjoita SQL-kysely"
        multiline
        rows={4}
        fullWidth
        value={userQuery}
        onChange={(e) => setUserQuery(e.target.value)}
        sx={{ mt: 2 }}
      />

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="outlined" onClick={() => setShowHint(!showHint)}>
          {showHint ? 'Piilota vinkki' : 'Näytä vinkki'}
        </Button>

        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={!userQuery.trim()}>
          Tarkista
        </Button>
      </Box>

      {showHint && (
        <Paper sx={{ mt: 2, p: 2, bgcolor: '#f0f0f0', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
          {selectedExercise.expected_query}
        </Paper>
      )}

      {feedback && (
        <Typography sx={{ mt: 3, fontWeight: 'bold' }}>
          {feedback}
        </Typography>
      )}

      <Button sx={{ mt: 4 }} onClick={() => setSelectedExercise(null)}>
        &larr; Takaisin harjoituslistaan
      </Button>
    </Box>
  );
}
export default Questions;

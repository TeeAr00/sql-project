import React, { useState, useEffect } from 'react';
import { Box, Button, Paper, Typography, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';

function Exercises2() {
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [available, setAvailable] = useState([]);
  const [assembled, setAssembled] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);

  // Tehtävälistan lataus
  useEffect(() => {
    async function loadList() {
      const res = await fetch('http://localhost:5000/api/exercises2');
      const data = await res.json();
      setExercises(data);
      setLoading(false);
    }
    loadList();
  }, []);

  async function startExercise(id) {
    const res = await fetch(`http://localhost:5000/api/exercises2/${id}`);
    const data = await res.json();
    setSelectedExercise(data);
    setAvailable(data.word_bank);
    setAssembled([]);
    setFeedback('');
  }

  function pickWord(word, fromAvailable = true) {
    if (fromAvailable) {
      setAvailable(available.filter((w, i) => i !== available.indexOf(word)));
      setAssembled([...assembled, word]);
    } else {
      setAssembled(assembled.filter((w, i) => i !== assembled.indexOf(word)));
      setAvailable([...available, word]);
    }
  }

  async function handleSubmit() {
    const res = await fetch(`http://localhost:5000/api/exercises2/${selectedExercise.id}/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_tokens: assembled })
    });
    const data = await res.json();
    if (data.correct) {
      setFeedback('Oikein!');
    } else {
      setFeedback(`Tarkista sanat. `);
      //debug Odotettu kysely: ${data.expected_query}
    }
  }

  if (loading) return <CircularProgress sx={{ mt: 5 }} />;

  if (!selectedExercise) {
    return (
      <Box sx={{ mt: 5, textAlign: 'center' }}>
        <Typography variant="h4">Valitse sana-järjestelytehtävä</Typography>
        {exercises.map(ex => (
          <Button
            key={ex.id}
            variant="contained"
            sx={{ m: 1 }}
            onClick={() => startExercise(ex.id)}
          >
            {ex.description}
          </Button>
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 5, textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>{selectedExercise.description}</Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography>Valittavissa olevat sanat:</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
          {available.map((word, i) => (
            <motion.div whileHover={{ scale: 1.05 }} key={i}>
              <Button sx={(theme) => ({
                color: theme.palette.text.primary,
                borderColor: theme.palette.text.primary,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                  borderColor: theme.palette.text.primary,
                },
              })} variant="outlined" onClick={() => pickWord(word, true)}>
                {word}
              </Button>
            </motion.div>
          ))}
        </Box>
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography>Rakennettu kysely:</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
          {assembled.map((word, i) => (
            <motion.div whileHover={{ scale: 1.05 }} key={i}>
              <Button variant="contained" onClick={() => pickWord(word, false)}>
                {word}
              </Button>
            </motion.div>
          ))}
        </Box>
      </Paper>

      <Button
        variant="contained"
        disabled={!assembled.length}
        onClick={handleSubmit}
      >
        Tarkista
      </Button>

      {feedback && <Typography sx={{ mt: 2 }}>{feedback}</Typography>}

      <Button sx={{ mt: 4 }} onClick={() => setSelectedExercise(null)}>
        Takaisin
      </Button>
    </Box>
  );
}

export default Exercises2;
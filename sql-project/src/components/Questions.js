import React, { useEffect, useState } from 'react';
import { Typography, Box, Button, TextField, Paper, CircularProgress } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { motion, AnimatePresence } from 'framer-motion';

import er_diagram from '../assets/er_diagrammi.png';

const classLabels = {
  1: 'SELECT',
  2: 'WHERE',
  3: 'ORDER BY',
  4: 'JOIN',
  5: 'COUNT',
  6: 'SUBQUERY'
};

function Questions() {
  const [setti, setSetti] = useState(null); // eri kysymysseteille
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [userQuery, setUserQuery] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [showImage, setShowImage] = useState(false);

  // Hae harjoitukset bäkkäristä
  useEffect(() => {
    async function fetchExercises() {
      try {
        const res = await fetch('http://localhost:5000/api/exercises');
        const data = await res.json();
        console.log('Fetched exercises:', data);//dbug
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

  if (!setti) {
    return (
      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          Main Menu
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
          <Button variant="contained" size="large" onClick={() => setSetti('setti1')}>
            Question Set 1
          </Button>
          <Button variant="contained" size="large" onClick={() => setSetti('setti2')}>
            Question Set 2
          </Button>
        </Box>
      </Box>
    );
  }

  if (setti === 'setti2') {
    return (
      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Typography variant="h5">Setti 2</Typography>
        <Button sx={{ mt: 3 }} onClick={() => setSetti(null)}>
          &larr; Takaisin päävalikkoon
        </Button>
      </Box>
    );
  }

  // Setti 1 helpot SELECT kysymykset, tällä hetkellä kaikki yhdessä
  if (loading) return <CircularProgress sx={{ mt: 5, display: 'block', mx: 'auto' }} />;

  if (!selectedExercise) {
    return (
      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          Exercises
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap', mt: 4 }}>
          {exercises.map((ex) => (
            <motion.div
              key={ex.id}
              layoutId={`card-${ex.id}`}
              onClick={() => selectExercise(ex.id)}
              style={{ margin: 12 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="contained"
                size="large"
                sx={{ px: 5, py: 2, minWidth: 150 }}
              >
                {`Q${ex.id}: ${classLabels[+ex.class] || 'Other'}`}
              </Button>
            </motion.div>
          ))}

        </Box>

        <Button sx={{ mt: 4 }} onClick={() => setSetti(null)}>
          &larr; Takaisin päävalikkoon
        </Button>
      </Box>
    );
  }

  // Näytä valittu harjoitus ja siitää aukeaa lomake
  
  if (selectedExercise) {
  return (
    <AnimatePresence mode="wait">
    {selectedExercise && (
      <motion.div
        key={selectedExercise.id}
        layoutId={`card-${selectedExercise.id}`}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        style={{ maxWidth: 700, margin: 'auto', marginTop: 40, textAlign: 'center' }}
      >
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
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="outlined" onClick={() => setShowHint(!showHint)}>
              {showHint ? 'Piilota vinkki' : 'Näytä vinkki'}
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="outlined" onClick={() => setShowImage((prev) => !prev)}>
              {showImage ? 'Piilota er-kaavio' : 'Näytä er-kaavio'}
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={!userQuery.trim()}
            >
              Tarkista
            </Button>
          </motion.div>
        </Box>

        {showHint && (
          <Paper sx={{ mt: 2, p: 2, bgcolor: '#f0f0f0', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
            {selectedExercise.expected_query}
          </Paper>
        )}

        <Dialog open={showImage} onClose={() => setShowImage(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ m: 0, p: 2 }}>
            ER-Kaavio
            <IconButton
              aria-label="close"
              onClick={() => setShowImage(false)}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <img
                src={er_diagram}
                alt="ER-diagrammi"
                style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px' }}
              />
            </Box>
          </DialogContent>
        </Dialog>

        {feedback && (
          <Typography sx={{ mt: 3, fontWeight: 'bold' }}>
            {feedback}
          </Typography>
        )}

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button sx={{ mt: 4 }} onClick={() => setSelectedExercise(null)}>
            &larr; Takaisin harjoituslistaan
          </Button>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>  );
}

}

export default Questions;

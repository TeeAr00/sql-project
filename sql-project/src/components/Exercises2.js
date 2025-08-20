import React, { useState, useEffect } from 'react';
import { Box, Button, Paper, Typography, CircularProgress } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import useSound from 'use-sound';
import { useSoundControl } from './SoundContext';
import CloseIcon from '@mui/icons-material/Close';

import er_diagram from '../assets/er_diagrammi.png';
import correctSfx from '../assets/correct.mp3';
import wrongSfx from '../assets/wrong.mp3';

function Exercises2() {
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [available, setAvailable] = useState([]);
  const [assembled, setAssembled] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);
  const [hint, setHint] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [showImage, setShowImage] = useState(false);

  const { muted } = useSoundControl();
  const [playCorrect] = useSound(correctSfx, { soundEnabled: !muted });
  const [playWrong] = useSound(wrongSfx, { soundEnabled: !muted });

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
    setHint(data.hint);
    setShowHint(false);
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

  function clearAssembled() {
    setAvailable([...available, ...assembled]);
    setAssembled([]);
    setFeedback('');
  }

  async function handleSubmit() {
    const res = await fetch(`http://localhost:5000/api/exercises2/${selectedExercise.id}/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_tokens: assembled })
    });
    const data = await res.json();
    if (data.correct) {
      playCorrect();
      setFeedback('Oikein!');
    } else {
      playWrong();
      setFeedback(`Tarkista sanat. `);
      //debug Odotettu kysely: ${data.expected_query}
    }
  }

  if (loading) return <CircularProgress sx={{ mt: 5 }} />;

  if (!selectedExercise) {
    return (
      <Box sx={{ mt: 5, textAlign: 'center' }}>
        <Box>
          <Typography variant="h4">Valitse sana-järjestelytehtävä</Typography>
          {exercises.length > 0 && (
            <Button
              variant="contained"
              size="large"
              sx={{ m: 2 }}
              onClick={() => {
                const randomIndex = Math.floor(Math.random() * exercises.length);
                startExercise(exercises[randomIndex].id);
              }}
            >
              Satunnainen tehtävä
            </Button>
          )}
        </Box>
        {exercises.map(ex => (
          <Button
            key={ex.id}
            variant="contained"
            size ="large"
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
      <Typography variant="h5" gutterBottom fontWeight={600}>
        {selectedExercise.description}
      </Typography>

      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark'
              ? theme.palette.grey[900]
              : theme.palette.grey[50],
        }}
      >
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{ borderBottom: 2, borderColor: 'divider', pb: 1, fontWeight: 600 }}
        >
          Valittavissa olevat sanat
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 1.5,
          }}
        >
          <AnimatePresence>
            {available.map((word, i) => (
              <motion.div
                key={word}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outlined"
                  sx={(theme) => ({
                    fontWeight: 600,
                    borderRadius: '50px',
                    borderWidth: 2,
                    borderColor: theme.palette.text.primary,
                    color: theme.palette.text.primary,
                    minWidth: '120px',
                    textTransform: 'none',
                  })}
                  onClick={() => pickWord(word, true)}
                >
                  {word}
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </Box>
      </Paper>

      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark'
              ? theme.palette.grey[800]
              : theme.palette.grey[100],
        }}
      >
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{ borderBottom: 2, borderColor: 'divider', pb: 1, fontWeight: 600 }}
        >
          Rakennettu kysely
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 1.5,
          }}
        >
          {assembled.map((word, i) => (
            <motion.div
              key={word + i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <Button
                variant="contained"
                sx={{ minWidth: '120px', fontWeight: 600, borderRadius: '50px' }}
                onClick={() => pickWord(word, false)}
              >
                {word}
              </Button>
            </motion.div>
          ))}
        </Box>
      </Paper>

      <Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Button
            variant="outlined"
            size="large"
            onClick={clearAssembled}
            disabled={!assembled.length}
          >
            Tyhjennä
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => setShowHint(!showHint)}
          >
            Vihje
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => setShowImage((prev) => !prev)}
          >
            {showImage ? 'Piilota er-kaavio' : 'Näytä er-kaavio'}
          </Button>

          <Button
            variant="contained"
            size="large"
            disabled={!assembled.length}
            onClick={handleSubmit}
          >
            Tarkista
          </Button>
        </Box>
        {showHint && (
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ mt: 2}}
          >
             {hint ? hint : "Ei vihjettä saatavilla"}
          </Typography>
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

        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              {feedback}
            </motion.div>
          )}
        </AnimatePresence>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button
            variant="outlined"
            size="large"
            onClick={() => setSelectedExercise(null)}
          >
            Takaisin
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default Exercises2;
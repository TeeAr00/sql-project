import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, TextField, Button, Paper, MenuItem,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { jwtDecode } from 'jwt-decode';

const classOptions = [
  { value: 1, label: 'SELECT' },
  { value: 2, label: 'WHERE' },
  { value: 3, label: 'ORDER BY' },
  { value: 4, label: 'JOIN' },
  { value: 5, label: 'COUNT' },
  { value: 6, label: 'SUBQUERY' }
];

function NewTests() {
  const [testSetName, setTestSetName] = useState('');
  const [exercises, setExercises] = useState([
    { description: '', expected_query: '', hint: '', class: '' }
  ]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('authToken');

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

  const handleExerciseChange = (index, field, value) => {
    const updated = [...exercises];
    updated[index][field] = value;
    setExercises(updated);
  };

  const addExercise = () => {
    setExercises([...exercises, { description: '', expected_query: '', hint: '', class: '' }]);
  };

  const removeExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!testSetName.trim() || exercises.some(e => !e.description || !e.expected_query || !e.class)) {
      setMessage('Täytä kaikki kentät ennen tallennusta');
      return;
    }

    try {
      setSaving(true);
      const savedExerciseIds = [];

      for (const ex of exercises) {
        const res = await fetch('http://localhost:5000/api/exercises', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(ex)
        });
        const data = await res.json();
        if (!data.id) throw new Error('Virhe tallennettaessa tehtävää');
        savedExerciseIds.push(data.id);
      }

      const res = await fetch('http://localhost:5000/api/exercises/test-sets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: testSetName,
          exerciseIds: savedExerciseIds
        })
      });
      const result = await res.json();

      if (result.id) {
        setMessage(`Testisetti "${testSetName}" tallennettu onnistuneesti!`);
        setTestSetName('');
        setExercises([{ description: '', expected_query: '', hint: '', class: '' }]);
      } else {
        throw new Error('Tallennus epäonnistui');
      }

    } catch (err) {
      console.error(err);
      setMessage('Virhe tallennuksessa');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: (theme) => theme.palette.text.primary }}>Testisetin luonti</Typography>
      <TextField
        label="Testisetin nimi"
        fullWidth
        value={testSetName}
        onChange={(e) => setTestSetName(e.target.value)}
        sx={{
          mb: 3,
          '& .MuiInputBase-input': {
            color: (theme) => theme.palette.text.primary,
          },
          '& .MuiInputLabel-root': {
            color: (theme) => theme.palette.text.primary,
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: (theme) => theme.palette.text.primary,
          },
        }}
      />

      {exercises.map((ex, index) => (
        <Paper key={index} sx={{ mb: 3, p: 2,borderColor: theme.palette.background.primary }}>
          <Typography variant="h6">Tehtävä {index + 1}</Typography>
          <TextField
            label="Kuvaus"
            fullWidth
            multiline
            rows={2}
            sx={{ mt: 2,color: theme.palette.text.primary }}
            value={ex.description}
            onChange={(e) => handleExerciseChange(index, 'description', e.target.value)}
          />
          <TextField
            label="Odotettu SQL-kysely"
            fullWidth
            multiline
            rows={3}
            sx={{ mt: 2 }}
            value={ex.expected_query}
            onChange={(e) => handleExerciseChange(index, 'expected_query', e.target.value)}
          />
          <TextField
            label="Vinkki (valinnainen)"
            fullWidth
            sx={{ mt: 2 }}
            value={ex.hint}
            onChange={(e) => handleExerciseChange(index, 'hint', e.target.value)}
          />
          <TextField
            label="Kategoria"
            fullWidth
            select
            sx={{ mt: 2 }}
            value={ex.class}
            onChange={(e) => handleExerciseChange(index, 'class', e.target.value)}
          >
            {classOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
            ))}
          </TextField>
          {exercises.length > 1 && (
            <Button
              variant="outlined"
              color="error"
              onClick={() => removeExercise(index)}
              sx={{ mt: 2 }}
            >
              Poista tehtävä
            </Button>
          )}
        </Paper>
      ))}

      <Button
       variant="outlined" 
       onClick={addExercise}
       sx={(theme) => ({
          mb: 3,
          color: theme.palette.text.primary,
          borderColor: theme.palette.text.primary,
          '&:hover': {
            borderColor: theme.palette.text.primary,
            backgroundColor: theme.palette.action.hover, 
          },
          '&:focus': {
            borderColor: theme.palette.text.primary,
          },
          '&:active': {
            borderColor: theme.palette.text.primary,
          },
        })}
      >
        Lisää tehtävä
        </Button>

      <Box sx={{ mt: 3,display: 'flex' }}>
        <Button
          variant="outlined"
          onClick={handleSubmit}
          disabled={saving}
          sx={(theme) => ({
          mb: 3,
          color: theme.palette.text.primary,
          borderColor: theme.palette.text.primary,
          '&:hover': {
            borderColor: theme.palette.text.primary,
            backgroundColor: theme.palette.action.hover, 
          },
          '&:focus': {
            borderColor: theme.palette.text.primary,
          },
          '&:active': {
            borderColor: theme.palette.text.primary,
          },
        })}
        >
          Tallenna testisetti
        </Button>
      </Box>

      {message && (
        <Typography sx={{ mt: 2 }} color="secondary">{message}</Typography>
      )}
    </Box>
  );
}

export default NewTests;

import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

function NewTestsScramble() {
  const [description, setDescription] = useState('');
  const [expectedQuery, setExpectedQuery] = useState('');
  const [hint, setHint] = useState('');
  const [wordBank, setWordBank] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('authToken');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

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

  const handleSubmit = async () => {
    if (!description.trim() || !expectedQuery.trim() || !wordBank.trim()) {
      setMessage("Täytä kaikki kentät");
      return;
    }
    try {
      setSaving(true);
      const res = await fetch("http://localhost:5000/api/exercises2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          description,
          expected_query: expectedQuery,
          hint,
          word_bank: wordBank.split(" ")
        })
      });
      const data = await res.json();
      if (data.id) {
        setMessage("Sanajärjestelytehtävä tallennettu!");
        setDescription('');
        setExpectedQuery('');
        setHint('');
        setWordBank('');
      } else {
        throw new Error();
      }
    } catch (err) {
      console.error(err);
      setMessage("Virhe tallennuksessa");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Sanajärjestely-tehtävän luonti</Typography>
      <Paper sx={{ p: 3, mb: 3 }}>
        <TextField
          label="Kuvaus"
          fullWidth
          sx={{ mb: 2 }}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          label="Odotettu SQL-kysely"
          fullWidth
          multiline
          rows={3}
          sx={{ mb: 2 }}
          value={expectedQuery}
          onChange={(e) => setExpectedQuery(e.target.value)}
        />
        <TextField
          label="Vihje (valinnainen)"
          fullWidth
          sx={{ mb: 2 }}
          value={hint}
          onChange={(e) => setHint(e.target.value)}
        />
        <TextField
          label="Sanapankki (välilyönnillä eroteltu)"
          fullWidth
          sx={{ mb: 2 }}
          value={wordBank}
          onChange={(e) => setWordBank(e.target.value)}
        />
        <Button
          variant="outlined"
          onClick={handleSubmit}
          disabled={saving}
        >
          Tallenna
        </Button>
      </Paper>
      {message && <Typography color="secondary">{message}</Typography>}
    </Box>
  );
}

export default NewTestsScramble;

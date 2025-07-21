import React from 'react';
import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, List, ListItem, ListItemText, Divider, useTheme } from '@mui/material';

function EditTestSets() {
  const [sets, setSets] = useState([]);
  const [selectedSetId, setSelectedSetId] = useState(null);
  const [selectedSetExercises, setSelectedSetExercises] = useState([]);
  const theme = useTheme();
  const token = localStorage.getItem('authToken');
  const authHeader = { 'Authorization': `Bearer ${token}` };
  const [selectedExercise, setSelectedExercise] = useState(null);


  useEffect(() => {
    fetch('http://localhost:5000/api/editSets/', { headers: authHeader })
      .then(res => res.json())
      .then(data => setSets(data))
      .catch(err => console.error('Error fetching test sets:', err));
  }, []);

  const handleSetClick = (id) => {
    setSelectedSetId(id);
    const selectedSet = sets.find(set => set.id === id);
    setSelectedSetExercises(selectedSet?.exercises || []);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this set?')) return;
    fetch(`http://localhost:5000/api/editSets/${id}`, {
        method: 'DELETE',
        headers: authHeader
        })
      .then(res => {
        if (res.ok) {
          setSets(sets.filter(set => set.id !== id));
          if (selectedSetId === id) {
            setSelectedSetId(null);
            setSelectedSetExercises([]);
          }
        } else {
          console.error('Failed to delete set');
        }
      });
  };
  const handleExerciseClick = (exerciseId) => {
    fetch(`http://localhost:5000/api/exercises/${exerciseId}`, { headers: authHeader })
      .then(res => res.json())
      .then(data => setSelectedExercise(data))
      .catch(err => console.error('Error fetching exercise details:', err));
  };

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>Edit Test Sets</Typography>

      <Paper sx={{ p: 3, mb: 4, backgroundColor: theme.palette.background.paper }}>
        <Typography variant="h6" gutterBottom>Test Sets</Typography>
        <List>
          {sets.map(set => (
            <React.Fragment key={set.id}>
              <ListItem
                button
                onClick={() => handleSetClick(set.id)}
                sx={{
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  }
                }}
              >
                <ListItemText primary={set.name} />
                <Button
                  variant="outlined"
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(set.id);
                  }}
                  sx={{
                    ml: 2,
                    borderColor: theme.palette.error.main,
                    color: theme.palette.error.main,
                    '&:hover': {
                      backgroundColor: theme.palette.error.main,
                      color: theme.palette.error.contrastText,
                    }
                  }}
                >
                  Delete
                </Button>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Paper>

      {selectedSetId && (
        <Paper sx={{ p: 3, backgroundColor: theme.palette.background.paper }}>
          <Typography variant="h6" gutterBottom>Exercises in Set</Typography>
          {selectedSetExercises.length === 0 ? (
            <Typography>No exercises found.</Typography>
          ) : (
            <List>
              {selectedSetExercises.map((ex, idx) => (
                <ListItem
                  key={idx}
                  button
                  onClick={() => handleExerciseClick(ex.id)}
                  sx={{
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    }
                  }}
                >
                  <ListItemText primary={`${idx + 1}. ${ex.description}`} />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      )}

      {selectedExercise && (
        <Paper sx={{ p: 3, mt: 3, backgroundColor: theme.palette.background.paper }}>
          <Typography variant="h6" gutterBottom>Selected Exercise</Typography>
          <Typography variant="h6" gutterBottom>Exercise Details</Typography>
          <Typography><strong>ID:</strong> {selectedExercise.id}</Typography>
          <Typography><strong>Description:</strong> {selectedExercise.description}</Typography>
          <Typography><strong>Expected Query:</strong> {selectedExercise.expected_query}</Typography>
          <Typography><strong>Hint:</strong> {selectedExercise.hint || 'No hint provided'}</Typography>
          <Typography><strong>Class:</strong> {selectedExercise.class}</Typography>
        </Paper>
      )}
    </Box>
  );
}

export default EditTestSets;
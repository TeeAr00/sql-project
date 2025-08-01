import React from 'react';
import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, List, ListItem, ListItemText, Divider, useTheme, TextField,} from '@mui/material';

function EditTestSets() {
  const [sets, setSets] = useState([]);
  const [selectedSetId, setSelectedSetId] = useState(null);
  const [selectedSetExercises, setSelectedSetExercises] = useState([]);
  const theme = useTheme();
  const token = localStorage.getItem('authToken');
  const authHeader = { 'Authorization': `Bearer ${token}` };
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedExercise, setEditedExercise] = useState(null);


  useEffect(() => {
    fetch('http://localhost:5000/api/editSets/', { headers: authHeader })
      .then(res => res.json())
      .then(data => setSets(data))
      .catch(err => console.error('Virhe haettaessa tehtäväsettejä:', err));
  }, []);

  const handleSetClick = (id) => {
    setSelectedSetId(id);
    const selectedSet = sets.find(set => set.id === id);
    setSelectedSetExercises(selectedSet?.exercises || []);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Poistetaanko tehtäväsetti?')) return;
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
          console.error('Virhe poistaessa settiä');
        }
      });
  };
  const handleExerciseClick = (exerciseId) => {
  fetch(`http://localhost:5000/api/exercises/${exerciseId}`, { headers: authHeader })
    .then(res => res.json())
    .then(data => {
      setSelectedExercise(data);
      setEditedExercise(data);
      setEditMode(false);
    })
    .catch(err => console.error('Virhe haettaessa tehtävää:', err));
};

const handleSaveEdit = () => {
  fetch(`http://localhost:5000/api/editSets/exercises/${selectedExercise.id}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    ...authHeader
  },
  body: JSON.stringify(editedExercise)
})
    .then(res => {
      if (!res.ok) throw new Error('Virhe tallentaessa tehtävää');
      return res.json();
    })
    .then(data => {
      setSelectedExercise(editedExercise);
      setEditMode(false);
    })
    .catch(err => console.error('Virhe tallentaessa tehtävää:', err));
};

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>Muokkaa tehtäväsettejä</Typography>

      <Paper sx={{ p: 3, mb: 4, backgroundColor: theme.palette.background.paper }}>
        <Typography variant="h6" gutterBottom>Tehtävä setit</Typography>
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
                  Poista
                </Button>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Paper>

      {selectedSetId && (
        <Paper sx={{ p: 3, backgroundColor: theme.palette.background.paper }}>
          <Typography variant="h6" gutterBottom>Tehtävät</Typography>
          {selectedSetExercises.length === 0 ? (
            <Typography>Tehtäviä ei löytynyt.</Typography>
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
          <Typography variant="h6" gutterBottom>Valittu tehtävä</Typography>

          {editMode ? (
            <>
              <TextField
                fullWidth
                margin="normal"
                label="Description"
                value={editedExercise.description}
                onChange={(e) => setEditedExercise({ ...editedExercise, description: e.target.value })}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Expected Query"
                value={editedExercise.expected_query}
                onChange={(e) => setEditedExercise({ ...editedExercise, expected_query: e.target.value })}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Hint"
                value={editedExercise.hint}
                onChange={(e) => setEditedExercise({ ...editedExercise, hint: e.target.value })}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Class"
                value={editedExercise.class}
                onChange={(e) => setEditedExercise({ ...editedExercise, class: e.target.value })}
              />
              <Box sx={{ mt: 2 }}>
                <Button variant="contained" color="primary" onClick={handleSaveEdit}>Tallenna</Button>
                <Button sx={{ ml: 2 }} variant="outlined" onClick={() => setEditMode(false)}>Peruuta</Button>
              </Box>
            </>
          ) : (
            <>
              <Typography><strong>ID:</strong> {selectedExercise.id}</Typography>
              <Typography><strong>Description:</strong> {selectedExercise.description}</Typography>
              <Typography><strong>Expected Query:</strong> {selectedExercise.expected_query}</Typography>
              <Typography><strong>Hint:</strong> {selectedExercise.hint || 'No hint provided'}</Typography>
              <Typography><strong>Class:</strong> {selectedExercise.class}</Typography>
              <Button sx={{ mt: 2 }} variant="outlined" onClick={() => setEditMode(true)}>Muokkaa</Button>
            </>
          )}
        </Paper>
      )}
    </Box>
  );
}

export default EditTestSets;
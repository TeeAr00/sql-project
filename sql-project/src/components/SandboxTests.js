import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, TextField, Paper, CircularProgress } from '@mui/material';
import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';

import er_diagram from '../assets/er_diagrammi.png';


function SandboxTests() {
  const [tables, setTables] = useState({});
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showImage, setShowImage] = useState(false);
  

  useEffect(() => {
    async function fetchTables() {
      try {
        const res = await fetch('http://localhost:5000/api/sandboxTests/tables');
        const data = await res.json();
        setTables(data);
      } catch (err) {
        console.error('Virhe pöytien haussa:', err);
      }
    }
    fetchTables();
  }, []);

  async function runQuery() {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch('http://localhost:5000/api/sandboxTests/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Virhe');
      setResult(data.rows);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
  <AnimatePresence mode="wait">
    <motion.div
      key="sandbox-tests"
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ duration: 0.3 }}
      style={{
        maxWidth: 700,
        margin: "auto",
        marginTop: 40,
        textAlign: "center",
        width: "100%"
      }}
    >
      <Typography variant="h4" gutterBottom>Komentojen testaus</Typography>

      <Typography variant="h6">Pöydät:</Typography>
      <Paper sx={{ p: 2, mb: 3, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
        {Object.entries(tables).map(([name, rows]) => (
          <div key={name}>
            <strong>{name}</strong> ({rows.length} riviä)
          </div>
        ))}
      </Paper>

      <TextField
        label="Testaa SQL kyselyä"
        multiline
        fullWidth
        rows={4}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        sx={(theme) => ({
            mt: 2,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: theme.palette.text.primary,
              },
              '&:hover fieldset': {
                borderColor: theme.palette.text.primary,
              },
              '&.Mui-focused fieldset': {
                borderColor: theme.palette.primary.main,
                borderWidth: '2px',
              },
            },
            '& .MuiInputLabel-root': {
              color: theme.palette.text.primary,
            },
        })}
      />

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outlined"
            onClick={() => setShowImage((prev) => !prev)}
            sx={(theme) => ({
              color: theme.palette.text.primary,
              borderColor: theme.palette.text.primary,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
                borderColor: theme.palette.text.primary,
              },
            })}
          >
            {showImage ? 'Piilota er-kaavio' : 'Näytä er-kaavio'}
          </Button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="contained"
            onClick={runQuery}
            disabled={!query.trim() || loading}
            sx={(theme) => ({
              color: theme.palette.primary.contrastText,
              backgroundColor: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark || theme.palette.primary.main,
              },
            })}
          >
            Suorita
          </Button>
        </motion.div>
      </Box>

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

      {loading && <CircularProgress sx={{ mt: 2 }} />}
      {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}

      {result && result.length > 0 && (
        <Paper sx={{ mt: 3, p: 2, bgcolor: 'background.default' }}>
            <Typography variant="h6" gutterBottom>
            Tulokset:
            </Typography>
            <TableContainer sx={{ maxHeight: 400 }}>
            <Table stickyHeader size="small">
                <TableHead>
                <TableRow>
                    {Object.keys(result[0]).map((col) => (
                    <TableCell
                        key={col}
                        sx={{
                        fontWeight: 'bold',
                        backgroundColor: 'background.paper',
                        color: 'text.primary',
                        borderBottom: (theme) => `2px solid ${theme.palette.divider}`
                        }}
                    >
                        {col}
                    </TableCell>
                    ))}
                </TableRow>
                </TableHead>
                <TableBody>
                {result.map((row, i) => (
                    <TableRow key={i} hover>
                    {Object.values(row).map((val, j) => (
                        <TableCell
                        key={j}
                        sx={{
                            color: 'text.primary',
                            borderBottom: (theme) => `1px solid ${theme.palette.divider}`
                        }}
                        >
                        {val !== null ? val.toString() : ''}
                        </TableCell>
                    ))}
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>
        </Paper>
    )}
      {result && result.length === 0 && (
        <Typography sx={{ mt: 2 }}>Ei tuloksia.</Typography>
      )}
    </motion.div>
  </AnimatePresence>
);
}

export default SandboxTests;

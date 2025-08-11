import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Chip,
  Stack,
  Snackbar,
  Alert
} from '@mui/material';
import AnimatedPage from '../../components/AnimatedPage';
import PageHeader from '../../components/PageHeader';
import { createSyllabus } from '../../api/syllabus'; 
import { SyllabusRequest } from '../../types/syllabus';

const CreateSyllabus: React.FC = () => {
  const [name, setName] = useState('');
  const [topics, setTopics] = useState<string[]>([]);
  const [topicInput, setTopicInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const handleAddTopic = () => {
    const trimmed = topicInput.trim();
    if (trimmed && !topics.includes(trimmed)) {
      setTopics([...topics, trimmed]);
      setTopicInput('');
    }
  };

  const handleDeleteTopic = (topicToDelete: string) => {
    setTopics(topics.filter((topic) => topic !== topicToDelete));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload: SyllabusRequest = { name, topics };

    try {
      await createSyllabus(payload);
      setSnackbarMessage('Syllabus created successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      // Reset form
      setName('');
      setTopics([]);
      setTopicInput('');
    } catch (err: any) {
      setSnackbarMessage(err.message || 'Failed to create syllabus');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  return (
    <AnimatedPage>
      <PageHeader
        title="Create Syllabus"
        subtitle="Create a new course syllabus"
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Syllabus', to: '/syllabus' },
          { label: 'Create Syllabus' }
        ]}
      />

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          mt: 2,
          maxWidth: 550,
          mx: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <TextField
          label="Syllabus Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          required
        />

        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            label="Add Topic"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTopic();
              }
            }}
            fullWidth
          />
          <Button
            variant="outlined"
            onClick={handleAddTopic}
            disabled={!topicInput.trim()}
            sx={{ height: '56px' }}
          >
            Add
          </Button>
        </Stack>

        {/* Wrapping chips */}
        <Box display="flex" flexWrap="wrap" gap={1}>
          {topics.map((topic) => (
            <Chip
              key={topic}
              label={topic}
              onDelete={() => handleDeleteTopic(topic)}
              color="primary"
              sx={{ mb: 0.5 }}
            />
          ))}
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Syllabus'}
        </Button>
      </Box>

      {/* Snackbar toaster notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ mt: 8 }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </AnimatedPage>
  );
};

export default CreateSyllabus;

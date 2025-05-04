import React, { useState } from 'react';
import { Box, TextField, Button, Chip, Stack, Typography } from '@mui/material';
import AnimatedPage from '../../components/AnimatedPage';
import PageHeader from '../../components/PageHeader';
import { createSyllabus } from '../../api/syllabus'; // Adjust import path
import { SyllabusRequest } from '../../types/syllabus'

const CreateSyllabus: React.FC = () => {
  const [name, setName] = useState('');
  const [topics, setTopics] = useState<string[]>([]);
  const [topicInput, setTopicInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    setError(null);
    setSuccess(null);

    const payload: SyllabusRequest = {
      name,
      topics,
    };

    try {
      await createSyllabus(payload);
      setSuccess('Syllabus created successfully!');
      setName('');
      setTopics([]);
      setTopicInput('');
    } catch (err: any) {
      setError(err.message || 'Failed to create syllabus');
    } finally {
      setLoading(false);
    }
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
          maxWidth: 500,
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

        <Stack direction="row" spacing={1} flexWrap="wrap">
          {topics.map((topic) => (
            <Chip
              key={topic}
              label={topic}
              onDelete={() => handleDeleteTopic(topic)}
              color="primary"
              sx={{ mb: 1 }}
            />
          ))}
        </Stack>

        {error && (
          <Typography color="error" align="center">
            {error}
          </Typography>
        )}
        {success && (
          <Typography color="success.main" align="center">
            {success}
          </Typography>
        )}

        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? 'Creating...' : 'Create Syllabus'}
        </Button>
      </Box>
    </AnimatedPage>
  );
};

export default CreateSyllabus;

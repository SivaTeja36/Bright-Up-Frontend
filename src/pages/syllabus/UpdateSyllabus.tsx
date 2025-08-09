import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Chip, Stack, CircularProgress } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import AnimatedPage from '../../components/AnimatedPage';
import PageHeader from '../../components/PageHeader';
import { getSyllabusById, updateSyllabus } from '../../api/syllabus';
import { SyllabusRequest, SyllabusResponse } from '../../types/syllabus';

const UpdateSyllabus: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [topics, setTopics] = useState<string[]>([]);
  const [topicInput, setTopicInput] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: SyllabusResponse = await getSyllabusById(Number(id));
        setName(data.name);
        setTopics(data.topics);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddTopic = () => {
    const trimmed = topicInput.trim();
    if (trimmed && !topics.includes(trimmed)) {
      setTopics([...topics, trimmed]);
      setTopicInput('');
    }
  };

  const handleDeleteTopic = (topic: string) => {
    setTopics(topics.filter(t => t !== topic));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: SyllabusRequest = { name, topics };
    try {
      await updateSyllabus(Number(id), payload);
      setTimeout(() => navigate('/syllabus'), 1500);
    } catch (err: any) {
    }
  };

  if (loading) {
    return <Box display="flex" justifyContent="center" alignItems="center" height="80vh"><CircularProgress /></Box>;
  }

  return (
    <AnimatedPage>
      <PageHeader
        title="Update Syllabus"
        subtitle={`Editing syllabus ID: ${id}`}
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Syllabus', to: '/syllabus' },
          { label: 'Update Syllabus' }
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

        <Button type="submit" variant="contained" color="primary">
          Update Syllabus
        </Button>
      </Box>
    </AnimatedPage>
  );
};

export default UpdateSyllabus;

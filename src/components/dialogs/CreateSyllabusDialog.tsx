import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Button,
  Chip,
  Stack,
  CircularProgress,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { createSyllabus } from '../../api/syllabus';
import { SyllabusRequest } from '../../types/syllabus';

interface CreateSyllabusDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

const CreateSyllabusDialog = ({ open, onClose, onCreated }: CreateSyllabusDialogProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const [name, setName] = useState('');
  const [topics, setTopics] = useState<string[]>([]);
  const [topicInput, setTopicInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setName('');
      setTopics([]);
      setTopicInput('');
    }
  }, [open]);

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
      enqueueSnackbar('Syllabus created successfully!', { variant: 'success' });
      onCreated?.();
      onClose();
    } catch (err: any) {
      enqueueSnackbar(err?.message || 'Failed to create syllabus', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Syllabus</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Stack spacing={2}>
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
                sx={{ height: '56px', whiteSpace: 'nowrap' }}
              >
                Add
              </Button>
            </Stack>
            {topics.length > 0 && (
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {topics.map((topic) => (
                  <Chip
                    key={topic}
                    label={topic}
                    onDelete={() => handleDeleteTopic(topic)}
                    color="primary"
                  />
                ))}
              </Stack>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading || !name.trim()}>
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Create Syllabus'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default CreateSyllabusDialog;

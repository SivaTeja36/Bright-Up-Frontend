import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Autocomplete,
  CircularProgress,
  Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { getAllSyllabi } from '../../api/syllabus';
import { createBatch, updateBatch } from '../../api/batch';
import { getAllUsers } from '../../api/auth';
import { BatchRequest, BatchResponse } from '../../types/batch';
import { SyllabusResponse } from '../../types/syllabus';
import { User } from '../../types/auth';

interface CreateBatchDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
  batch?: BatchResponse | null;
}

const CreateBatchDialog = ({ open, onClose, onCreated, batch }: CreateBatchDialogProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const isEditing = Boolean(batch);

  const [syllabusOptions, setSyllabusOptions] = useState<SyllabusResponse[]>([]);
  const [selectedSyllabi, setSelectedSyllabi] = useState<SyllabusResponse[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [mentorOptions, setMentorOptions] = useState<User[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<User | null>(null);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);
  const [syllabusLoading, setSyllabusLoading] = useState(true);
  const [mentorLoading, setMentorLoading] = useState(true);
  const [mentorError, setMentorError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setSelectedSyllabi([]);
      setStartDate(batch?.start_date ?? '');
      setEndDate(batch?.end_date ?? '');
      setSelectedMentor(null);
      setIsActive(batch?.is_active ?? true);
      setMentorError(null);

      let active = true;
      setSyllabusLoading(true);
      setMentorLoading(true);

      getAllSyllabi()
        .then((data) => {
          if (!active) return;
          setSyllabusOptions(data);
          if (batch?.syllabus && batch.syllabus.length > 0) {
            const subjects = batch.syllabus.map((s) => Object.keys(s)[0].toLowerCase());
            const matched = data.filter((s) =>
              subjects.some((subject) => s.name.toLowerCase() === subject)
            );
            setSelectedSyllabi(matched);
          }
        })
        .catch(() => {
          if (active) enqueueSnackbar('Failed to load syllabus options', { variant: 'error' });
        })
        .finally(() => {
          if (active) setSyllabusLoading(false);
        });

      getAllUsers({ page: 1, page_size: 1000, sort_by: 'name', order_by: 'asc' })
        .then((users) => {
          if (!active) return;
          const mentors = users.filter((u) => u.role === 'MENTOR' && u.is_active);
          setMentorOptions(mentors);
          if (batch?.mentor_id) {
            const match = mentors.find((m) => m.id === batch.mentor_id);
            setSelectedMentor(match ?? null);
          }
        })
        .catch(() => {
          if (active) setMentorError('Failed to load mentors. Please try again.');
        })
        .finally(() => {
          if (active) setMentorLoading(false);
        });

      return () => {
        active = false;
      };
    }
  }, [open, batch, enqueueSnackbar]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMentor) return;
    setLoading(true);
    const payload: BatchRequest = {
      syllabus_ids: selectedSyllabi.map((s) => s.id),
      start_date: startDate,
      end_date: endDate,
      mentor_id: selectedMentor.id,
      is_active: isActive,
    };
    try {
      if (isEditing && batch) {
        await updateBatch(batch.id, payload);
        enqueueSnackbar('Batch updated successfully!', { variant: 'success' });
      } else {
        await createBatch(payload);
        enqueueSnackbar('Batch created successfully!', { variant: 'success' });
      }
      onCreated?.();
      onClose();
    } catch (err: any) {
      enqueueSnackbar(err?.message || 'Failed to save batch', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditing ? 'Edit Batch' : 'Create Batch'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 0.5 }}>
            <Autocomplete
              multiple
              options={syllabusOptions}
              getOptionLabel={(option) => option.name}
              value={selectedSyllabi}
              onChange={(_, value) => setSelectedSyllabi(value)}
              loading={syllabusLoading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Syllabi"
                  placeholder="Select syllabi"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {syllabusLoading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
            <TextField
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
            <TextField
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
            <Autocomplete
              options={mentorOptions}
              getOptionLabel={(option) => option.name}
              value={selectedMentor}
              onChange={(_, value) => setSelectedMentor(value)}
              loading={mentorLoading}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Mentor"
                  placeholder="Select mentor"
                  required
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {mentorLoading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
            {mentorError && !mentorLoading && (
              <Typography variant="body2" color="error">
                {mentorError}
              </Typography>
            )}
            {!mentorLoading && !mentorError && mentorOptions.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                No active mentors available.
              </Typography>
            )}
            <FormControlLabel
              control={
                <Checkbox
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  color="primary"
                />
              }
              label="Is Active"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading || !selectedMentor}>
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : isEditing ? (
              'Save Changes'
            ) : (
              'Create Batch'
            )}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default CreateBatchDialog;

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Stack,
  CircularProgress,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { createClassSchedule, getAllBatches } from '../../api/batch';
import { Day, BatchResponse } from '../../types/batch';

function getFriendlyErrorMessage(error: any): string {
  if (!error) return 'An unknown error occurred.';
  if (typeof error === 'string') return error;
  if (error.detail === 'SCHEDULE_FOR_THIS_DAY_ALREADY_EXISTS_FOR_THIS_BATCH') {
    return 'Schedule for this day already exists for this batch.';
  }
  if (error.detail) {
    return (
      error.detail
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (c: string) => c.toUpperCase()) + '.'
    );
  }
  return 'Failed to create class schedule.';
}

interface ClassScheduleDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

const ClassScheduleDialog = ({ open, onClose, onCreated }: ClassScheduleDialogProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const [batchId, setBatchId] = useState<number | ''>('');
  const [batches, setBatches] = useState<BatchResponse[]>([]);
  const [day, setDay] = useState<Day | ''>('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [batchLoading, setBatchLoading] = useState(true);

  useEffect(() => {
    if (open) {
      setBatchId('');
      setDay('');
      setStartTime('');
      setEndTime('');
      let active = true;
      setBatchLoading(true);
      getAllBatches()
        .then((data) => {
          if (active) setBatches(data);
        })
        .catch(() => {
          if (active) enqueueSnackbar('Failed to load batches', { variant: 'error' });
        })
        .finally(() => {
          if (active) setBatchLoading(false);
        });
      return () => {
        active = false;
      };
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createClassSchedule(batchId as number, {
        day: day as Day,
        start_time: startTime,
        end_time: endTime,
      });
      enqueueSnackbar('Class schedule created successfully!', { variant: 'success' });
      onCreated?.();
      onClose();
    } catch (err: any) {
      let message = 'Failed to create class schedule';
      if (err?.response?.data) {
        message = getFriendlyErrorMessage(err.response.data);
      } else if (err?.detail) {
        message = getFriendlyErrorMessage(err);
      } else if (err?.message) {
        message = getFriendlyErrorMessage(err.message);
      }
      enqueueSnackbar(message, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Class Schedule</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 0.5 }}>
            <FormControl fullWidth required>
              <InputLabel id="batch-label">Batch</InputLabel>
              <Select
                labelId="batch-label"
                value={batchId}
                label="Batch"
                onChange={(e) => setBatchId(Number(e.target.value))}
                disabled={batchLoading}
              >
                {batchLoading ? (
                  <MenuItem value="">
                    <CircularProgress size={20} />
                  </MenuItem>
                ) : (
                  batches.map((batch) => (
                    <MenuItem key={batch.id} value={batch.id}>
                      {batch.mentor
                        ? `${batch.mentor} (${batch.start_date} - ${batch.end_date})`
                        : `Batch #${batch.id}`}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>

            <FormControl fullWidth required>
              <InputLabel id="day-label">Day</InputLabel>
              <Select
                labelId="day-label"
                value={day}
                label="Day"
                onChange={(e) => setDay(e.target.value as Day)}
              >
                {Object.values(Day).map((d) => (
                  <MenuItem key={d} value={d}>
                    {d}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Start Time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
              />
              <TextField
                label="End Time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
              />
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading || !batchId || !day}>
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Create Schedule'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default ClassScheduleDialog;

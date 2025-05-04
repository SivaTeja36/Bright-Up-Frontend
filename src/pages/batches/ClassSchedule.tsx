import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  CircularProgress,
  Stack,
} from '@mui/material';
import AnimatedPage from '../../components/AnimatedPage';
import PageHeader from '../../components/PageHeader';
import { createClassSchedule, getAllBatches } from '../../api/batch';
import { ClassScheduleRequest, Day, BatchResponse } from '../../types/batch';

// Helper to convert backend error codes to user-friendly messages
function getFriendlyErrorMessage(error: any): string {
  if (!error) return "An unknown error occurred.";
  if (typeof error === "string") return error;

  if (error.detail === "SCHEDULE_FOR_THIS_DAY_ALREADY_EXISTS_FOR_THIS_BATCH") {
    return "Schedule for this day already exists for this batch.";
  }

  if (error.detail) {
    // Convert SNAKE_CASE to normal sentence and capitalize first letters
    return (
      error.detail
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c: string) => c.toUpperCase()) + "."
    );
  }

  return "Failed to create class schedule.";
}

const ClassSchedule: React.FC = () => {
  const [batchId, setBatchId] = useState<number | ''>('');
  const [batches, setBatches] = useState<BatchResponse[]>([]);
  const [day, setDay] = useState<Day | ''>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [batchLoading, setBatchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchBatches = async () => {
      setBatchLoading(true);
      try {
        const data = await getAllBatches();
        setBatches(data);
      } catch (err) {
        setError('Failed to load batches');
      } finally {
        setBatchLoading(false);
      }
    };
    fetchBatches();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await createClassSchedule(batchId as number, {
        day: day as Day,
        start_time: startTime,
        end_time: endTime,
      });
      setSuccess('Class schedule created successfully!');
      setDay('');
      setStartTime('');
      setEndTime('');
      setBatchId('');
    } catch (err: any) {
      let message = "Failed to create class schedule";
      if (err?.response?.data) {
        message = getFriendlyErrorMessage(err.response.data);
      } else if (err?.detail) {
        message = getFriendlyErrorMessage(err);
      } else if (err?.message) {
        message = getFriendlyErrorMessage(err.message);
      }
      setError(message);
    }finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <PageHeader
        title="Class Schedule"
        subtitle="Manage batch class schedules"
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Batches', to: '/batches' },
          { label: 'Class Schedule' },
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
                  {batch.mentor_name
                    ? `${batch.mentor_name} (${batch.start_date} - ${batch.end_date})`
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

        <Stack direction="row" spacing={2}>
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
          {loading ? 'Creating...' : 'Create Class Schedule'}
        </Button>
      </Box>
    </AnimatedPage>
  );
};

export default ClassSchedule;

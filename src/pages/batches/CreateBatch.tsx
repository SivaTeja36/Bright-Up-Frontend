import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Autocomplete,
  CircularProgress,
  Typography,
} from '@mui/material';
import AnimatedPage from '../../components/AnimatedPage';
import PageHeader from '../../components/PageHeader';
import { SyllabusResponse } from '../../types/syllabus';
import { getAllSyllabi } from '../../api/syllabus';
import { createBatch } from '../../api/batch';
import { BatchRequest } from '../../types/batch';

const CreateBatch: React.FC = () => {
  // Form state
  const [syllabusOptions, setSyllabusOptions] = useState<SyllabusResponse[]>([]);
  const [selectedSyllabi, setSelectedSyllabi] = useState<SyllabusResponse[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [mentorName, setMentorName] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(true);

  // UI state
  const [loading, setLoading] = useState<boolean>(false);
  const [syllabusLoading, setSyllabusLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch syllabi on mount
  useEffect(() => {
    const fetchSyllabi = async () => {
      setSyllabusLoading(true);
      try {
        const data = await getAllSyllabi();
        setSyllabusOptions(data);
      } catch (err: any) {
        setError('Failed to load syllabus options');
      } finally {
        setSyllabusLoading(false);
      }
    };
    fetchSyllabi();
  }, []);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const payload: BatchRequest = {
      syllabus_ids: selectedSyllabi.map((s) => s.id),
      start_date: startDate,
      end_date: endDate,
      mentor_name: mentorName,
      is_active: isActive,
    };

    try {
      await createBatch(payload);
      setSuccess('Batch created successfully!');
      setSelectedSyllabi([]);
      setStartDate('');
      setEndDate('');
      setMentorName('');
      setIsActive(true);
    } catch (err: any) {
      setError(err.message || 'Failed to create batch');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <PageHeader
        title="Create Batch"
        subtitle="Create a new student batch"
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Batches', to: '/batches' },
          { label: 'Create Batch' },
        ]}
      />
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ mt: 2, maxWidth: 500, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}
      >
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
        />

        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />

        <TextField
          label="Mentor Name"
          value={mentorName}
          onChange={(e) => setMentorName(e.target.value)}
          fullWidth
        />

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
          {loading ? 'Creating...' : 'Create Batch'}
        </Button>
      </Box>
    </AnimatedPage>
  );
};

export default CreateBatch;

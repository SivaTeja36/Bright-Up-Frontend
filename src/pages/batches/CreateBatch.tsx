import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Autocomplete,
  CircularProgress,
  Typography,
  Card,
  CardContent,
  Divider,
  Grid,
  Chip,
  Stack,
  Snackbar,
  Alert,
} from '@mui/material';
import AnimatedPage from '../../components/AnimatedPage';
import PageHeader from '../../components/PageHeader';
import { SyllabusResponse } from '../../types/syllabus';
import { getAllSyllabi } from '../../api/syllabus';
import { createBatch } from '../../api/batch';
import { BatchRequest } from '../../types/batch';
import { GetUserDetailsResponse } from '../../types/auth';
import { getAllUsers } from '../../api/auth';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import BookIcon from '@mui/icons-material/Book';
import PeopleIcon from '@mui/icons-material/People';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ClassIcon from '@mui/icons-material/Class';

const CreateBatch: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [syllabusOptions, setSyllabusOptions] = useState<SyllabusResponse[]>([]);
  const [selectedSyllabi, setSelectedSyllabi] = useState<SyllabusResponse[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [mentorOptions, setMentorOptions] = useState<GetUserDetailsResponse[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<GetUserDetailsResponse | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [syllabusLoading, setSyllabusLoading] = useState<boolean>(true);
  const [mentorLoading, setMentorLoading] = useState<boolean>(true);
  
  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setSyllabusLoading(true);
        setMentorLoading(true);

        const [syllabiData, usersResponse] = await Promise.all([
          getAllSyllabi(),
          getAllUsers()
        ]);

        setSyllabusOptions(syllabiData);
        setMentorOptions(usersResponse);
      } catch (err: any) {
        showSnackbar('Failed to load options: ' + err.message, 'error');
        console.error('Error loading data:', err);
      } finally {
        setSyllabusLoading(false);
        setMentorLoading(false);
      }
    };
    fetchData();
  }, []);

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validations
    if (!name.trim()) {
      showSnackbar('Please enter a batch name', 'error');
      setLoading(false);
      return;
    }
    if (selectedSyllabi.length === 0) {
      showSnackbar('Please select at least one syllabus', 'error');
      setLoading(false);
      return;
    }
    if (!selectedMentor) {
      showSnackbar('Please select a mentor', 'error');
      setLoading(false);
      return;
    }
    if (!startDate || !endDate) {
      showSnackbar('Please select both start and end dates', 'error');
      setLoading(false);
      return;
    }

    const payload: BatchRequest = {
      name: name.trim(),
      syllabus_ids: selectedSyllabi.map((s) => s.id),
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      mentor_id: selectedMentor.id
    };

    try {
      await createBatch(payload);
      showSnackbar('Batch created successfully!', 'success');
      // Reset form
      setName('');
      setSelectedSyllabi([]);
      setStartDate(null);
      setEndDate(null);
      setSelectedMentor(null);
    } catch (err: any) {
      showSnackbar(err.message || 'Failed to create batch', 'error');
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

      <Box sx={{ maxWidth: 1100, mx: 'auto', mt: 3 }}>
        <Card sx={{ borderRadius: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PeopleIcon color="primary" />
              Batch Details
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                {/* Batch Name and Mentor */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <ClassIcon color="primary" fontSize="small" />
                    Batch Name
                  </Typography>
                  <TextField
                    label="Batch Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <PeopleIcon color="primary" fontSize="small" />
                    Mentor
                  </Typography>
                  <Autocomplete
                    options={mentorOptions}
                    getOptionLabel={(option) => option.name}
                    value={selectedMentor}
                    onChange={(_, value) => setSelectedMentor(value)}
                    loading={mentorLoading}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Mentor"
                        placeholder="Search mentor..."
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
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                  />
                </Grid>

                {/* Syllabus Selection */}
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
                  >
                    <BookIcon color="primary" fontSize="small" />
                    Syllabus
                  </Typography>
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
                        label="Select Syllabi"
                        placeholder="Search syllabi..."
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
                    renderTags={(value, getTagProps) => (
                      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', mt: 1 }}>
                        {value.map((option, index) => (
                          <Chip
                            label={option.name}
                            {...getTagProps({ index })}
                            key={option.id}
                          />
                        ))}
                      </Stack>
                    )}
                  />
                </Grid>

                {/* Dates */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CalendarTodayIcon color="primary" fontSize="small" />
                    Start Date
                  </Typography>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      value={startDate}
                      onChange={(newValue) => setStartDate(newValue)}
                      slots={{ textField: TextField }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true
                        }
                      }}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CalendarTodayIcon color="primary" fontSize="small" />
                    End Date
                  </Typography>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      value={endDate}
                      onChange={(newValue) => setEndDate(newValue)}
                      minDate={startDate || undefined}
                      slots={{ textField: TextField }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true
                        }
                      }}
                    />
                  </LocalizationProvider>
                </Grid>

                {/* Submit */}
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    sx={{ px: 4 }}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Create Batch'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Snackbar toaster notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ mt: 8 }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} variant="filled" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </AnimatedPage>
  );
};

export default CreateBatch;
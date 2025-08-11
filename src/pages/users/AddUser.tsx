import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Snackbar,
  Alert,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Typography,
  Paper,
  Stack,
} from '@mui/material';
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { GiGraduateCap } from "react-icons/gi";
import AnimatedPage from '../../components/AnimatedPage';
import PageHeader from '../../components/PageHeader';
import { createUser } from '../../api/auth';
import { UserCreationRequest } from '../../types/auth';

// Helper for user-friendly error messages
function getFriendlyErrorMessage(error: any): string {
  if (!error) return "An unknown error occurred.";
  if (typeof error === "string") return error;
  if (error.detail) {
    return (
      error.detail
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c: string) => c.toUpperCase()) + "."
    );
  }
  return "Failed to create user.";
}

const AddUser: React.FC = () => {
  const [form, setForm] = useState<UserCreationRequest>({
    name: '',
    email: '',
    gender: '',
    password: '',
    role: '',
    phone_number: '',
    education: {
      degree: '',
      specialization: '',
      start_year: new Date().getFullYear(),
      end_year: new Date().getFullYear(),
      current_year_of_study: undefined,
      status: '',
      city: '',
      state: ''
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);

  // TextField change handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Select change handler
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  // Nested education change handler
  const handleEducationChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      education: {
        ...prev.education,
        [name]: value,
      },
    }));
  };

  // Select change handler for education fields
  const handleEducationSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      education: {
        ...prev.education,
        [name as string]: value,
      },
    }));
  };

  // Password toggle
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const payload: UserCreationRequest = {
        ...form,
        role: form.role.toUpperCase(),
        gender: form.gender.toUpperCase(),
        education: {
          ...form.education,
          status: form.education.status,
        },
      };

      await createUser(payload);
      const successMsg = 'User created successfully!';
      setSuccess(successMsg);
      setSnackbarMessage(successMsg);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      // Reset form
      setForm({
        name: '',
        email: '',
        gender: '',
        password: '',
        role: '',
        phone_number: '',
        education: {
          degree: '',
          specialization: '',
          start_year: new Date().getFullYear(),
          end_year: new Date().getFullYear(),
          current_year_of_study: undefined,
          status: '',
          city: '',
          state: ''
        }
      });
    } catch (err: any) {
      let message = "Failed to create user";
      if (err?.response?.data) {
        message = getFriendlyErrorMessage(err.response.data);
      } else if (err?.detail) {
        message = getFriendlyErrorMessage(err);
      } else if (err?.message) {
        message = getFriendlyErrorMessage(err.message);
      }
      setError(message);
      setSnackbarMessage(message);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Snackbar close handler
  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  return (
    <AnimatedPage>
      <PageHeader
        title="Add User"
        subtitle="Create a new system user"
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Users', to: '/users' },
          { label: 'Add User' }
        ]}
      />

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          mt: 2,
          maxWidth: 1100,
          mx: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 3, // Reduced gap between Paper sections
        }}
      >
        {/* SECTION 1: User Details */}
        <Paper elevation={2} sx={{ p: 3, mb: 1 }}>
          <Stack direction="row" alignItems="center" gap={1.5} mb={2}>
            <FaUserCircle size={29} color="#1976d2" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              User Details
            </Typography>
          </Stack>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 3,
            }}
          >
            <TextField label="Name" name="name" value={form.name} onChange={handleChange} required fullWidth />
            <TextField label="Email" name="email" autoComplete='new-password' value={form.email} onChange={handleChange} required fullWidth />
            <FormControl fullWidth variant="outlined" required>
              <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                autoComplete='new-password'
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      onMouseUp={handleMouseUpPassword}
                      edge="end"
                    >
                      {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select labelId="gender-label" name="gender" value={form.gender} label="Gender" onChange={handleSelectChange}>
                <MenuItem value="MALE">Male</MenuItem>
                <MenuItem value="FEMALE">Female</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel id="role-label">Role</InputLabel>
              <Select labelId="role-label" name="role" value={form.role} label="Role" onChange={handleSelectChange}>
                <MenuItem value="ADMIN">Admin</MenuItem>
                <MenuItem value="MENTOR">Mentor</MenuItem>
                <MenuItem value="STUDENT">Student</MenuItem>
                <MenuItem value="GUEST">Guest</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Phone Number" name="phone_number" value={form.phone_number} onChange={handleChange} required fullWidth />
          </Box>
        </Paper>

        {/* SECTION 2: Education Details */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Stack direction="row" alignItems="center" gap={1.5} mb={2}>
            <GiGraduateCap size={29} color="#1976d2" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Education Details
            </Typography>
          </Stack>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 3,
            }}
          >
            <TextField label="Degree" name="degree" value={form.education.degree} onChange={handleEducationChange} required fullWidth />
            <TextField label="Specialization" name="specialization" value={form.education.specialization} onChange={handleEducationChange} required fullWidth />
            <TextField label="Start Year" name="start_year" type="number" value={form.education.start_year} onChange={handleEducationChange} required fullWidth />
            <TextField label="End Year" name="end_year" type="number" value={form.education.end_year} onChange={handleEducationChange} required fullWidth />
            <TextField label="Current Year of Study" name="current_year_of_study" type="number" value={form.education.current_year_of_study || ''} onChange={handleEducationChange} fullWidth />
            <FormControl fullWidth required>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              name="status"
              value={form.education.status}
              onChange={handleEducationSelectChange}
            >
              <MenuItem value="On Going">On Going</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Dropped">Dropped</MenuItem>
            </Select>
          </FormControl>
            <TextField label="City" name="city" value={form.education.city} onChange={handleEducationChange} required fullWidth />
            <TextField label="State" name="state" value={form.education.state} onChange={handleEducationChange} required fullWidth />
          </Box>
        </Paper>

        {/* Button container */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create'}
          </Button>
        </Box>
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

export default AddUser;

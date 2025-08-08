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
} from '@mui/material';
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
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
      // Ensure role and gender are sent in UPPERCASE
      const payload = {
        ...form,
        role: form.role.toUpperCase(),
        gender: form.gender.toUpperCase(),
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
          gap: 7,
        }}
      >
        {/* Grid container for inputs */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 3,
          }}
        >
          <TextField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            autoComplete='new-password'
            value={form.email}
            onChange={handleChange}
            required
            fullWidth
          />
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
                    aria-label={showPassword ? 'hide the password' : 'display the password'}
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
            <Select
              labelId="gender-label"
              name="gender"
              value={form.gender}
              label="Gender"
              onChange={handleSelectChange}
            >
              <MenuItem value="MALE">Male</MenuItem>
              <MenuItem value="FEMALE">Female</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth required>
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              name="role"
              value={form.role}
              label="Role"
              onChange={handleSelectChange}
            >
              <MenuItem value="ADMIN">Admin</MenuItem>
              <MenuItem value="MENTOR">Mentor</MenuItem>
              <MenuItem value="STUDENT">Student</MenuItem>
              <MenuItem value="GUEST">Guest</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Phone Number"
            name="phone_number"
            value={form.phone_number}
            onChange={handleChange}
            required
            fullWidth
          />
        </Box>

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

export default AddUser;

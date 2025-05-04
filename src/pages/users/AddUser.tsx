import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import AnimatedPage from '../../components/AnimatedPage';
import PageHeader from '../../components/PageHeader';
import { createUser } from '../../api/auth'; // Adjust this path as needed
import { UserCreationRequest } from '../../types/auth'; // Adjust this path as needed

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
    username: '',
    password: '',
    role: '',
    contact: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // For TextField
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // For Select
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await createUser(form);
      setSuccess('User created successfully!');
      setForm({
        name: '',
        username: '',
        password: '',
        role: '',
        contact: '',
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
    } finally {
      setLoading(false);
    }
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
          maxWidth: 500,
          mx: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <TextField
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Email"
          name="username"
          value={form.username}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          fullWidth
          required
        />
        <FormControl fullWidth required>
          <InputLabel id="role-label">Role</InputLabel>
          <Select
            labelId="role-label"
            name="role"
            value={form.role}
            label="Role"
            onChange={handleSelectChange}
          >
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="SuperAdmin">SuperAdmin</MenuItem>
            <MenuItem value="Mentor">Mentor</MenuItem>
            <MenuItem value="Student">Student</MenuItem>
            {/* Add more roles as needed */}
          </Select>
        </FormControl>
        <TextField
          label="Contact"
          name="contact"
          value={form.contact}
          onChange={handleChange}
          fullWidth
          required
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
          {loading ? 'Creating...' : 'Create User'}
        </Button>
      </Box>
    </AnimatedPage>
  );
};

export default AddUser;

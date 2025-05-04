import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import AnimatedPage from '../../components/AnimatedPage';
import PageHeader from '../../components/PageHeader';
import { createStudent } from '../../api/student'; // Adjust path as needed
import { StudentRequest } from '../../types/student'; // Adjust path as needed

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
  return "Failed to add student.";
}

const AddStudent: React.FC = () => {
  const [form, setForm] = useState<StudentRequest>({
    name: '',
    gender: '',
    email: '',
    phone_number: '',
    degree: '',
    specialization: '',
    passout_year: new Date().getFullYear(),
    city: '',
    state: '',
    refered_by: '',
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
      [name]: name === "passout_year" ? Number(value) : value,
    }));
  };

  // For MUI Select
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
      await createStudent(form);
      setSuccess('Student added successfully!');
      setForm({
        name: '',
        gender: '',
        email: '',
        phone_number: '',
        degree: '',
        specialization: '',
        passout_year: new Date().getFullYear(),
        city: '',
        state: '',
        refered_by: '',
      });
    } catch (err: any) {
      let message = "Failed to add student";
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
        title="Add Student"
        subtitle="Add a new student"
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Students', to: '/students' },
          { label: 'Add Student' }
        ]}
      />
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          mt: 2,
          maxWidth: 600,
          mx: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select
                labelId="gender-label"
                name="gender"
                value={form.gender}
                label="Gender"
                onChange={handleSelectChange}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Email" name="email" value={form.email} onChange={handleChange} type="email" fullWidth required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Phone Number" name="phone_number" value={form.phone_number} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Degree" name="degree" value={form.degree} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Specialization" name="specialization" value={form.specialization} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Passout Year" name="passout_year" value={form.passout_year} onChange={handleChange} type="number" fullWidth required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="City" name="city" value={form.city} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="State" name="state" value={form.state} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Referred By" name="refered_by" value={form.refered_by} onChange={handleChange} fullWidth />
          </Grid>
        </Grid>

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
          {loading ? 'Adding...' : 'Add Student'}
        </Button>
      </Box>
    </AnimatedPage>
  );
};

export default AddStudent;

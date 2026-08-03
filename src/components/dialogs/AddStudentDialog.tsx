import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  CircularProgress,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { createStudent } from '../../api/student';
import { StudentRequest } from '../../types/student';

function getFriendlyErrorMessage(error: any): string {
  if (!error) return 'An unknown error occurred.';
  if (typeof error === 'string') return error;
  if (error.detail) {
    return (
      error.detail
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (c: string) => c.toUpperCase()) + '.'
    );
  }
  return 'Failed to add student.';
}

const emptyForm: StudentRequest = {
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
};

interface AddStudentDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

const AddStudentDialog = ({ open, onClose, onCreated }: AddStudentDialogProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const [form, setForm] = useState<StudentRequest>(emptyForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(emptyForm);
    }
  }, [open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'passout_year' ? Number(value) : value,
    }));
  };

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
    try {
      await createStudent(form);
      enqueueSnackbar('Student added successfully!', { variant: 'success' });
      onCreated?.();
      onClose();
    } catch (err: any) {
      let message = 'Failed to add student';
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
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add New Student</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent dividers>
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
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Add Student'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default AddStudentDialog;

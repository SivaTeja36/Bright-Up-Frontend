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
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  OutlinedInput,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { FaRegEyeSlash, FaRegEye } from 'react-icons/fa';
import { useSnackbar } from 'notistack';
import { createUser } from '../../api/auth';
import { UserCreationRequest } from '../../types/auth';

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
  return 'Failed to create user.';
}

const emptyForm: UserCreationRequest = {
  name: '',
  email: '',
  gender: '',
  password: '',
  role: '',
  phone_number: '',
};

interface AddUserDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

const AddUserDialog = ({ open, onClose, onCreated }: AddUserDialogProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const [form, setForm] = useState<UserCreationRequest>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(emptyForm);
      setShowPassword(false);
    }
  }, [open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
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
      await createUser(form);
      enqueueSnackbar('User created successfully!', { variant: 'success' });
      onCreated?.();
      onClose();
    } catch (err: any) {
      let message = 'Failed to create user';
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
      <DialogTitle>Add New User</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
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
              value={form.email}
              onChange={handleChange}
              required
              fullWidth
            />
            <FormControl fullWidth variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? 'hide the password' : 'display the password'}
                      onClick={() => setShowPassword((show) => !show)}
                      onMouseDown={(event) => event.preventDefault()}
                      onMouseUp={(event) => event.preventDefault()}
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
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Create User'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default AddUserDialog;

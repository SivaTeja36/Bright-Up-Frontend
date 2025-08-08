import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
  MenuItem
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserById, updateUser } from '../../api/auth';
import { UserUpdateRequest } from '../../types/auth';
import AnimatedPage from '../../components/AnimatedPage';
import PageHeader from '../../components/PageHeader';

const genders = ['MALE', 'FEMALE'];
const roles = ['ADMIN', 'MENTOR', 'STUDENT', 'GUEST'];

const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const UpdateUser = () => {
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);
  const navigate = useNavigate();

  const [form, setForm] = useState<UserUpdateRequest>({
    name: '',
    gender: '',
    role: '',
    phone_number: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) {
        setError('Invalid user ID');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const user = await getUserById(userId);
        setForm({
          name: user.name,
          gender: user.gender || '',
          role: user.role,
          phone_number: user.phone_number,
        });
      } catch (err) {
        setError('Failed to fetch user details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // Always store in uppercase for backend
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value.toUpperCase(),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      await updateUser(userId, form);
      navigate('/users');
    } catch (err) {
      setError('Failed to update user');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <AnimatedPage>
      <PageHeader
        title="Update User"
        subtitle={`Update user ID: ${userId}`}
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Users', to: '/users' },
          { label: 'Update User' },
        ]}
      />

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ maxWidth: 1100, mx: 'auto', py: 3 }}
        noValidate
        autoComplete="off"
      >
        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
          <TextField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Gender"
            name="gender"
            select
            value={form.gender}
            onChange={handleChange}
            required
            fullWidth
          >
            {genders.map((g) => (
              <MenuItem key={g} value={g}>
                {capitalizeFirstLetter(g)}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Role"
            name="role"
            select
            value={form.role}
            onChange={handleChange}
            required
            fullWidth
          >
            {roles.map((r) => (
              <MenuItem key={r} value={r}>
                {capitalizeFirstLetter(r)}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Phone Number"
            name="phone_number"
            value={form.phone_number}
            onChange={handleChange}
            required
            fullWidth
          />
        </Box>

        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate('/users')}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Update'}
          </Button>
        </Box>
      </Box>
    </AnimatedPage>
  );
};

export default UpdateUser;

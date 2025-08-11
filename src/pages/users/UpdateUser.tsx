import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  MenuItem,
  Alert,
  Typography,
  Divider
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserById, updateUser } from '../../api/auth';
import { GetUserDetailsResponse, UpdateUserRequest } from '../../types/auth';
import AnimatedPage from '../../components/AnimatedPage';
import PageHeader from '../../components/PageHeader';
import AnimatedCard from '../../components/AnimatedCard';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';

const UpdateUser = () => {
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<UpdateUserRequest>({
    name: '',
    gender: '',
    role: '',
    phone_number: '',
    education: {
      degree: '',
      specialization: '',
      start_year: 0,
      end_year: 0,
      current_year_of_study: 0,
      status: '',
      city: '',
      state: '',
    },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data: GetUserDetailsResponse = await getUserById(userId);
        setFormData({
          name: data.name,
          gender: data.gender || '',
          role: data.role,
          phone_number: data.phone_number,
          education: {
            degree: data.education.degree,
            specialization: data.education.specialization,
            start_year: data.education.start_year,
            end_year: data.education.end_year,
            current_year_of_study: data.education.current_year_of_study,
            status: data.education.status,
            city: data.education.city,
            state: data.education.state,
          },
        });
      } catch (err) {
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEducationChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      education: { ...prev.education, [field]: value },
    }));
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      await updateUser(userId, formData);
      navigate(`/users/details/${userId}`);
    } catch (err) {
      setError('Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <AnimatedPage>
      <PageHeader
        title="Update User"
        subtitle={`Update details for ${formData.name}`}
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Users', to: '/users' },
          { label: 'Update User' },
        ]}
      />
      <AnimatedCard>
        <Box p={3} display="flex" flexDirection="column" gap={4}>
          
          {/* User Details Section */}
          <Box>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <PersonIcon color="primary" />
              <Typography variant="h6">User Details</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={3}>
              <TextField
                label="Name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                fullWidth
              />
              <TextField
                label="Gender"
                select
                value={formData.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
                fullWidth
              >
                <MenuItem value="MALE">Male</MenuItem>
                <MenuItem value="FEMALE">Female</MenuItem>
              </TextField>
              <TextField
                label="Role"
                select
                value={formData.role}
                onChange={(e) => handleChange('role', e.target.value)}
                fullWidth
              >
                <MenuItem value="ADMIN">Admin</MenuItem>
                <MenuItem value="MENTOR">Mentor</MenuItem>
                <MenuItem value="STUDENT">Student</MenuItem>
                <MenuItem value="GUEST">Guest</MenuItem>
              </TextField> 
              <TextField
                label="Phone Number"
                value={formData.phone_number}
                onChange={(e) => handleChange('phone_number', e.target.value)}
                fullWidth
              />
            </Box>
          </Box>

          {/* Education Details Section */}
          <Box>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <SchoolIcon color="primary" />
              <Typography variant="h6">Education Details</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={3}>
              <TextField
                label="Degree"
                value={formData.education.degree}
                onChange={(e) => handleEducationChange('degree', e.target.value)}
                fullWidth
              />
              <TextField
                label="Specialization"
                value={formData.education.specialization}
                onChange={(e) => handleEducationChange('specialization', e.target.value)}
                fullWidth
              />
              <TextField
                label="Start Year"
                type="number"
                value={formData.education.start_year}
                onChange={(e) => handleEducationChange('start_year', Number(e.target.value))}
                fullWidth
              />
              <TextField
                label="End Year"
                type="number"
                value={formData.education.end_year}
                onChange={(e) => handleEducationChange('end_year', Number(e.target.value))}
                fullWidth
              />
              <TextField
                label="Current Year of Study"
                type="number"
                value={formData.education.current_year_of_study}
                onChange={(e) => handleEducationChange('current_year_of_study', Number(e.target.value))}
                fullWidth
              />
              <TextField
                label="Status"
                select
                value={formData.education.status}
                onChange={(e) => handleEducationChange('status', e.target.value)}
                fullWidth
              >       
                <MenuItem value="On Going">On Going</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Dropped">Dropped</MenuItem>
              </TextField> 
              <TextField
                label="City"
                value={formData.education.city}
                onChange={(e) => handleEducationChange('city', e.target.value)}
                fullWidth
              />
              <TextField
                label="State"
                value={formData.education.state}
                onChange={(e) => handleEducationChange('state', e.target.value)}
                fullWidth
              />
            </Box>
          </Box>

          {/* Save Button */}
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </Box>
      </AnimatedCard>
    </AnimatedPage>
  );
};

export default UpdateUser;

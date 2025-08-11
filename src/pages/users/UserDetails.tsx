import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Alert,
  Card,
  CardContent,
  Avatar,
  Divider,
  Grid,
  Chip,
  Paper,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  School as SchoolIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Edit as EditIcon,
  Star as StarIcon,
  PersonAdd as PersonAddIcon,
  Update as UpdateIcon,
  DateRange as DateRangeIcon,
  VerifiedUser as VerifiedUserIcon,
  RadioButtonUnchecked as UncheckedIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserById } from '../../api/auth';
import { GetUserDetailsResponse } from '../../types/auth';
import AnimatedPage from '../../components/AnimatedPage';
import PageHeader from '../../components/PageHeader';
import { CheckCircleIcon } from 'lucide-react';

const UserDetails = () => {
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);
  const navigate = useNavigate();

  const [user, setUser] = useState<GetUserDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserById(userId);
        setUser(response || null);
      } catch (err) {
        setError('Failed to fetch user details');
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!user) return null;

  const getRatingStars = (rating = 4.5) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
      <Box display="flex" alignItems="center" gap={0.5} mt={1}>
        {[...Array(fullStars)].map((_, i) => (
          <StarIcon key={i} sx={{ color: '#FFD700', fontSize: 18 }} />
        ))}
        {hasHalfStar && <StarIcon sx={{ color: '#FFD700', fontSize: 18, opacity: 0.5 }} />}
        <Typography variant="body2" sx={{ ml: 1, fontWeight: 600 }}>
          {rating.toFixed(1)}
        </Typography>
      </Box>
    );
  };

  const getRoleDisplayName = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'Admin';
      case 'mentor':
        return 'Mentor';
      case 'student':
        return 'Student';
      case 'guest':
        return 'Guest';
      default:
        return role || 'User';
    }
  };

  return (
    <AnimatedPage>
      <PageHeader
        title="User Details"
        subtitle={`Details for ${user.name?.trim()}`}
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Users', to: '/users' },
          { label: 'User Details' }
        ]}
      />

      <Grid container spacing={3}>
        {/* Left Side - User Profile */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.08)', border: '1px solid rgba(255,255,255,0.1)', overflow: 'visible', position: 'relative' }}>
            <Box sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', height: 120, position: 'relative', borderRadius: '16px 16px 0 0' }}>
              <Avatar
                alt={user.name}
                src={user.profile_image || '/default-avatar.png'}
                sx={{ width: 100, height: 100, position: 'absolute', bottom: -50, left: '50%', transform: 'translateX(-50%)', border: '4px solid white', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', fontSize: '2rem', bgcolor: '#9e9e9e' }}
              >
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </Avatar>
            </Box>

            <CardContent sx={{ pt: 7, pb: 3, textAlign: 'center' }}>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                {user.name?.trim() || 'Unknown User'}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                {getRoleDisplayName(user.role)}
              </Typography>
              <Typography variant="body2" color="primary" sx={{ mb: 2 }}>
                {user.education?.city}, {user.education?.state}
              </Typography>
              {getRatingStars()}

              <Divider sx={{ my: 3 }} />

              {/* Contact Info */}
              <Stack spacing={2.5} sx={{ textAlign: 'left' }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box sx={{ width: 40, height: 40, borderRadius: 2, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <PhoneIcon sx={{ color: 'white', fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Phone
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {user.phone_number || 'Not provided'}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                  <Box sx={{ width: 40, height: 40, borderRadius: 2, background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <EmailIcon sx={{ color: 'white', fontSize: 20 }} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1" fontWeight={600} sx={{ wordBreak: 'break-all', fontSize: '0.85rem' }}>
                      {user.email || 'Not provided'}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                  <Box sx={{ width: 40, height: 40, borderRadius: 2, background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <LocationIcon sx={{ color: '#666', fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Location
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {user.education?.city}, {user.education?.state}
                    </Typography>
                  </Box>
                </Box>
              </Stack>

              <Divider sx={{ my: 3 }} />

              {/* User Stats */}
              <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
                <Chip label={user.gender || 'Not specified'} icon={<PersonIcon />} variant="outlined" size="small" sx={{ borderRadius: 3 }} />
                <Chip label={user.is_active ? 'Active' : 'Inactive'} color={user.is_active ? 'success' : 'error'} size="small" sx={{ borderRadius: 3 }} />
                {user.role?.toLowerCase() === 'admin' && (
                  <Chip label="Admin" icon={<AdminIcon />} color="primary" size="small" sx={{ borderRadius: 3 }} />
                )}
              </Stack>

              {/* Account Information */}
              <Divider sx={{ my: 2 }} />
              <Box sx={{ 
                borderRadius: 2, 
                p: 2, 
                mb: 3,
                border: '1px solid rgba(0, 0, 0, 0.12)'
              }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <VerifiedUserIcon color="primary" />
                  Account Information
                </Typography>
                
                <List dense sx={{ py: 0 }}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <DateRangeIcon color="action" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Created At" 
                      secondary={user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Not available'}
                      secondaryTypographyProps={{ variant: 'body2' }}
                    />
                    <ListItemIcon sx={{ minWidth: 36, ml: 2 }}>
                      <PersonAddIcon color="action" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Created By" 
                      secondary={user.created_by || 'Not available'}
                      secondaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                  
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <UpdateIcon color="action" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Last Updated" 
                      secondary={user.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'Not available'}
                      secondaryTypographyProps={{ variant: 'body2' }}
                    />
                    <ListItemIcon sx={{ minWidth: 36, ml: 2 }}>
                      <PersonAddIcon color="action" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Updated By" 
                      secondary={user.updated_by || 'Not available'}
                      secondaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                </List>
              </Box>

              {/* Edit Button */}
              <Button 
                variant="contained" 
                fullWidth
                startIcon={<EditIcon />} 
                onClick={() => navigate(`/users/update/${userId}`)}
                sx={{
                  borderRadius: 3,
                  textTransform: 'none',
                  py: 1.5,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': { background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)' }
                }}
              >
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Side */}
        <Grid item xs={12} md={7}>
          <Stack spacing={3}>
            {/* Education Details */}
            <Card sx={{ borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <SchoolIcon color="primary" fontSize="large" />
                  <Typography variant="h6" fontWeight={700}>Education Details</Typography>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" gap={2} mb={3}>
                      <CalendarIcon color="action" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">Start Year</Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {user.education?.start_year || 'Not specified'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" gap={2} mb={3}>
                      <CalendarIcon color="action" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">End Year</Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {user.education?.end_year || 'Not specified'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" gap={2} mb={3}>
                      <CalendarIcon color="action" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">Current Year</Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {user.education?.current_year_of_study ?? 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" gap={2} mb={3}>
                      <CheckCircleIcon color={user.education?.status === 'Completed' ? 'success' : 'action'} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">Status</Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {user.education?.status || 'Not specified'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" gap={2} mb={3}>
                      <LocationIcon color="action" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">City</Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {user.education?.city || 'Not specified'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" gap={2} mb={3}>
                      <LocationIcon color="action" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">State</Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {user.education?.state || 'Not specified'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <CalendarIcon color="action" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">Duration</Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {user.education?.start_year && user.education?.end_year
                            ? `${user.education.end_year - user.education.start_year} years`
                            : 'Not calculated'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Account Information */}
            <Card sx={{ borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <VerifiedUserIcon color="primary" fontSize="large" />
                  <Typography variant="h6" fontWeight={700}>Account Information</Typography>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="flex-start" gap={2} mb={3}>
                      <UncheckedIcon color="action" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">Created At</Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Not available'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mt={1}>Created By</Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {user.created_by || 'Not available'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="flex-start" gap={2} mb={3}>
                      <CheckCircleIcon color="success" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">Last Updated</Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {user.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'Not available'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mt={1}>Updated By</Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {user.updated_by || 'Not available'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </AnimatedPage>
  );
};

export default UserDetails;
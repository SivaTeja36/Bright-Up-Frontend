import { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Badge,
  useTheme,
  useMediaQuery,
  Modal,
  TextField,
  Button,
  Stack,
  Divider,
  InputAdornment,
  MenuItem,
  Menu,
} from '@mui/material';
import { Bell, Menu as MenuIcon, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { getUserInfo, getUserById, updateUserPassword } from '../../api/auth';
import { UserInfoResponse, UserDetails, UserPasswordUpdateRequest } from '../../types/auth';

interface NavbarProps {
  onMenuClick: () => void;
}

const EditProfileModal = ({ 
  open, 
  onClose, 
  user,
  onChangePasswordClick 
}: {
  open: boolean;
  onClose: () => void;
  user: UserDetails | null;
  onChangePasswordClick: () => void;
}) => {
  const theme = useTheme();

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', md: '500px' },
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          outline: 'none',
        }}
      >
        {/* Profile Image at the top center */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Avatar 
            sx={{ 
              width: 100, 
              height: 100,
              bgcolor: 'primary.main',
              fontSize: '2.5rem'
            }}
          >
            {user?.name?.charAt(0) || 'S'}
          </Avatar>
        </Box>

        <Typography variant="h5" component="h2" gutterBottom sx={{ textAlign: 'center' }}>
          Profile
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Name
              </Typography>
              <Typography variant="body1">
                {user?.name || ''}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Phone Number
              </Typography>
              <Typography variant="body1">
                {user?.phone_number || ''}
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1">
                {user?.email || ''}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Role
              </Typography>
              <Typography variant="body1">
                {user?.role || ''}
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={onChangePasswordClick}
          >
            Change Password
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

const ChangePasswordModal = ({ 
  open, 
  onClose,
  onSubmit
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UserPasswordUpdateRequest) => void;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    
    setError('');
    onSubmit({ password });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', md: '500px' },
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          outline: 'none',
        }}
      >
        <Typography mb={3} variant="h5" component="h2" gutterBottom>
          Change Password
        </Typography>
        
        <Stack spacing={3} sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="New Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete='new-password'
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Confirm New Password"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={!!error}
            helperText={error}
            autoComplete='new-password'
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Update Password
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { logout } = (() => {
    try {
      return { logout: () => { console.log("Logout called") } };
    } catch {
      return { logout: () => console.log("Logout fallback") };
    }
  })();

  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  const [userInfo, setUserInfo] = useState<UserInfoResponse | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loadingUserInfo, setLoadingUserInfo] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoadingUserInfo(true);
        setFetchError(null);
        const data = await getUserInfo();
        setUserInfo(data);
        
        // Fetch full user details when user info is loaded
        if (data?.id) {
          const userData = await getUserById(data.id);
          setUserDetails(userData);
        }
      } catch (error) {
        setFetchError('Failed to load user info.');
        console.error('Error fetching user info:', error);
      } finally {
        setLoadingUserInfo(false);
      }
    };
    fetchUser();
  }, []);

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleEditProfile = () => {
    setEditProfileOpen(true);
  };

  const handlePasswordUpdate = async (data: UserPasswordUpdateRequest) => {
    try {
      await updateUserPassword(data);
      // Handle success (maybe show a toast notification)
      console.log('Password updated successfully');
    } catch (error) {
      console.error('Error updating password:', error);
      // Handle error
    }
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - 280px)` },
          ml: { md: '280px' },
          backgroundColor: 'transparent',
          backgroundImage: 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton color="inherit" edge="start" sx={{ mr: 2 }} onClick={onMenuClick}>
              <MenuIcon />
            </IconButton>
          )}

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <IconButton color="inherit" sx={{ ml: 1 }} onClick={handleNotificationMenuOpen}>
                <Badge badgeContent={3} color="error">
                  <Bell size={20} />
                </Badge>
              </IconButton>
            </motion.div>

            {/* Avatar + Name + Role Section */}
            <Box
              sx={{
                ml: 2,
                display: 'flex',
                alignItems: 'center',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 2,
                py: 0.5,
                px: 1.2,
                minWidth: 180,
              }}
            >
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                onClick={handleEditProfile}
                style={{ cursor: 'pointer' }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ position: 'relative', mr: 1 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                      {userInfo?.name?.charAt(0) || 'S'}
                    </Avatar>
                    {/* Green dot */}
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        width: 8,
                        height: 8,
                        bgcolor: 'green',
                        borderRadius: '50%',
                        border: '2px solid white',
                      }}
                    />
                  </Box>
                  {!isMobile && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0, flexGrow: 1 }}>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                      >
                        {loadingUserInfo ? 'Loading...' : userInfo?.name || 'Siva Teja'}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textTransform: 'capitalize' }}
                      >
                        {loadingUserInfo ? '' : userInfo?.role || 'ADMIN'}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </motion.div>
            </Box>
          </Box>

          {/* Notification Menu */}
          <Menu
            anchorEl={notificationAnchorEl}
            open={Boolean(notificationAnchorEl)}
            onClose={handleNotificationMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: {
                mt: 1.5,
                width: 320,
                maxHeight: 400,
                backgroundImage: theme.palette.gradient?.dark || undefined,
                border: '1px solid rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <MenuItem onClick={handleNotificationMenuClose}>
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  New student joined
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  A new student has been added to Batch #123
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem onClick={handleNotificationMenuClose}>
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  Syllabus updated
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  React Fundamentals syllabus has been updated
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem onClick={handleNotificationMenuClose}>
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  Class rescheduled
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Android Development class moved to Friday
                </Typography>
              </Box>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Edit Profile Modal */}
      <EditProfileModal
        open={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
        user={userDetails}
        onChangePasswordClick={() => {
          setEditProfileOpen(false);
          setChangePasswordOpen(true);
        }}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        open={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
        onSubmit={handlePasswordUpdate}
      />
    </>
  );
};

export default Navbar;